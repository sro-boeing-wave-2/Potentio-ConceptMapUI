import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Component, Inject, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { GraphService } from './graph.service';
import * as d3 from 'd3';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public static dialogRef;
  @ViewChild('fileImportInput') fileImportInput: any;
  public csvRecords;
  public dataArr = [];
  public Domain;
  public Version;
  public concepttags = [];
  public node = [];
  public links = [];
  public graph = [];
  conceptmapdata: ConceptMapData = new ConceptMapData();

  constructor(public dialog: MatDialog, private graphservice: GraphService) { }
  @Output() clicked = new EventEmitter<ConceptMapData>();
  submit() {
    AppComponent.dialogRef = this.dialog.open(DialogDataExampleDialog, { width: '70%', height: '70%', data: this.conceptmapdata });

  }
  isCSVFile(file: any) {
    return file.name.endsWith(".csv");
  }
  getHeaderArray(csvRecordsArr: any) {
    let headers = csvRecordsArr[0].split(',');
    let headerArray = [];
    for (let j = 0; j < headers.length; j++) {
      headerArray.push(headers[j]);
    }
    return headerArray;
  }
  getDataRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any) {
    for (let i = 1; i < csvRecordsArray.length; i++) {
      let data = csvRecordsArray[i].split(',');
      if (data.length == headerLength) {
        var domain;
        var version;
        var csvRecord: ConceptMap = new ConceptMap();
        csvRecord.Source = { 'Domain': '', 'Name': '' };
        csvRecord.Target = { 'Domain': '', 'Name': '' };
        csvRecord.Relationship = { 'Name': '' };
        csvRecord.Source.Domain = data[0].trim();
        csvRecord.Source.Name = data[1].trim();
        csvRecord.Target.Domain = data[0].trim();
        domain = data[0].trim();
        version = data[4].trim();
        this.concepttags.push(data[1].trim());
        this.concepttags.push(data[2].trim());
        csvRecord.Target.Name = data[2].trim();
        csvRecord.Relationship.Name = data[3].trim();
        this.dataArr.push(csvRecord);
      }
      else {
        alert("Number of fields in  Concept Map {i} is not equal to number of fields in header");
      }
    }
    this.conceptmapdata.Triplet = this.dataArr;
    this.conceptmapdata.Domain = domain;
    this.conceptmapdata.Version = version;
    this.conceptmapdata.Concepts = this.concepttags.filter((v, i, a) => a.indexOf(v) === i);
    return this.conceptmapdata;
  }
  fileChangeListener($event: any): void {

    var text = [];
    var files = $event.srcElement.files;

    if (this.isCSVFile(files[0])) {
      var input = $event.target;
      var reader = new FileReader();
      reader.readAsText(input.files[0]);

      reader.onload = (data) => {
        let csvData = reader.result;
        let csvRecordsArray = (csvData as string).split(/\n/);

        let headersRow = this.getHeaderArray(csvRecordsArray);
        this.csvRecords = this.getDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length);

      }
      reader.onerror = function () {
        alert('Unable to read ' + input.files[0]);
      };

    } else {
      alert("Please import valid .csv file.");
      this.fileReset();
    }
  }
  fileReset() {
    this.fileImportInput.nativeElement.value = "";
    this.csvRecords = [];
  }
}
@Component({
  selector: 'create-concept-dialog',
  templateUrl: 'createconceptmap.html',
  styleUrls: ['createconceptmap.css']
})
export class DialogDataExampleDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: ConceptMapData, private _graphService: GraphService,
    public dialogforgraph: MatDialog) { }
  node_data: Data = new Data();
  public nodes = [];
  public links = [];
  ngOnInit() {
    this.loadgraph();
  }
  loadgraph() {
    var data = this.getNodeData();
    const svg = d3.select('svg');
    const width = +svg.attr('width');
    const height = +svg.attr('height');
    const color = d3.scaleOrdinal(d3.schemeCategory20);

    const simulation = d3.forceSimulation()
      .force('link', d3.forceLink().id((d) => d.id))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force("charge", d3.forceManyBody().strength(-2000));



    const link = svg.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(data.links)
      .enter()
      .append('line')
      .style("stroke", linkColour)
      .attr('stroke-width', 2);
      function linkColour(d){
        console.log(d);    
        if(d.label == "SAME_AS"){
            return "blue";
        } else {
            return "black";
        }
    }
    var node = svg.append("g")
      .attr("class", "nodes")
      .selectAll(".node")
      .data(data.nodes)
      .enter().append("g")
      .attr("class", "node")
      .call(d3.drag()
        .on("start", dragStarted)
        .on("drag", dragged)
        .on("end", dragEnded));

    node.append("circle")
      .attr("r", 8)
      .attr("fill", 'red');

    node.append("text")
      .attr("dx", 10)
      .attr("dy", ".25em")
      .text(function (d) { return d.id });


    

    simulation
      .nodes(data.nodes)
      .on('tick', ticked);

    simulation.force<d3.ForceLink<any, any>>('link')
      .links(data.links);

    function ticked() {
      link
        .attr('x1', function (d) { return d['source'].x; })
        .attr('y1', function (d) { return d['source'].y; })
        .attr('x2', function (d) { return d['target'].x; })
        .attr('y2', function (d) { return d['target'].y; });

      node
        .attr('cx', function (d) { return d['x']; })
        .attr('cy', function (d) { return d['y']; })
        .attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")"; });
    }


    function dragStarted(d) {
      if (!d3.event.active) { simulation.alphaTarget(0.3).restart(); }
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }

    function dragEnded(d) {
      if (!d3.event.active) { simulation.alphaTarget(0); }
      d.fx = null;
      d.fy = null;
    }
  }

  getNodeData() {

    this.data.Concepts.forEach(x => {
      var C: n = new n();
      C.id = x;

      this.nodes.push(C);

    });
    this.data.Triplet.forEach(x => {
      var l: linkData = new linkData();
      l.source = x.Source.Name;
      l.target = x.Target.Name;
      l.label = x.Relationship.Name;
      this.links.push(l);

    });
    this.node_data.nodes = this.nodes;
    this.node_data.links = this.links;
    return this.node_data;
  }
}




export class Concept {
  Name: string;
  Domain: string;
}
export class Predicate {
  Name: string;
}
export class ConceptMap {
  Source: Concept;
  Target: Concept;
  Relationship: Predicate;
}
export class ConceptMapData {
  Version: DoubleRange;
  Domain: string;
  Triplet: ConceptMap[];
  Concepts: string[];
}
export class Data {
  nodes: n[];
  links: linkData[];
}
export class linkData {
  source: string;
  target: string;
  label: string;
}
export class n {
  id: string;
}
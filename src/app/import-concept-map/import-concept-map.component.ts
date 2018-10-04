import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Component, Inject, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { GraphService } from '../graph.service';

import * as d3 from 'd3';
import { version } from 'punycode';

@Component({
  selector: 'import-concept-map',
  templateUrl: './import-concept-map.component.html',
  styleUrls: ['./import-concept-map.component.css'],
})
export class ImportConceptMapComponent {
  public static dialogRef;
  @ViewChild('fileImportInput') fileImportInput: any;
  public csvRecords;
  public dataArr = [];
  public contentArr=[];
  public Domain;
  public Version;
  public concepttags = [];
  public node = [];
  public links = [];
  public graph = [];
  isLinear = true;
  node_data: Data = new Data();
  public nodes = [];

  conceptmapdata: ConceptMapData = new ConceptMapData();

  constructor(public dialog: MatDialog, private graphservice: GraphService) { }
  submit() {
    console.log(this.conceptmapdata);
    var result;

    this.graphservice.PostConceptMap(this.conceptmapdata).subscribe(x => {
      console.log(x.status);
    });
     
  }

  isCSVFile(file: any) {
    return file.name.endsWith(".csv");
  }
  getHeaderArray(csvRecordsArr: any) {
    let headers = csvRecordsArr[2].split(',');
    let headerArray = [];
    for (let j = 0; j < headers.length; j++) {
      headerArray.push(headers[j]);
    }
    return headerArray;
  }
  getDataRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any) {
   var domain1=csvRecordsArray[0].trim();
    var version1=csvRecordsArray[1].trim();
    for (let i = 3; i < csvRecordsArray.length; i++) {
      let data = csvRecordsArray[i].split(',');
     
        console.log(data[0],data[1]);
        var csvRecord: ConceptMap = new ConceptMap();
        var contentTripletforSourceConcept= new ContentTriplet();
        var contentTripletforTargetConcept= new ContentTriplet();
        csvRecord.Source = { 'Domain': '', 'Name': '' };
        csvRecord.Target = { 'Domain': '', 'Name': '' };
        contentTripletforSourceConcept.Target={ 'Domain': '', 'Name': '' };
        contentTripletforSourceConcept.Source={ 'Title': '', 'Url': '' ,'Tags': []};
        contentTripletforSourceConcept.Relationship={ 'Name': '', 'Taxonomy': '' };
        contentTripletforTargetConcept.Target={ 'Domain': '', 'Name': '' };
        contentTripletforTargetConcept.Source={ 'Title': '', 'Url': '' ,'Tags': []};
        contentTripletforTargetConcept.Relationship={ 'Name': '', 'Taxonomy': '' };
        csvRecord.Relationship = { 'Name': '' };
        csvRecord.Source.Domain = domain1;
        csvRecord.Source.Name = data[0].trim();
        csvRecord.Target.Domain = domain1;
        csvRecord.Target.Name = data[1].trim();      
        this.concepttags.push(data[0].trim());
        this.concepttags.push(data[1].trim());        
        csvRecord.Relationship.Name = data[2].trim();
        this.dataArr.push(csvRecord);
        contentTripletforSourceConcept.Source.Title=data[3].trim();
        contentTripletforSourceConcept.Source.Url=data[4].trim();
        contentTripletforSourceConcept.Source.Tags.push(data[11].trim());
        contentTripletforSourceConcept.Relationship.Name=data[5].trim();
        contentTripletforSourceConcept.Relationship.Taxonomy=data[6].trim();
        contentTripletforSourceConcept.Target.Domain=domain1;
        contentTripletforSourceConcept.Target.Name=data[0].trim();
        contentTripletforTargetConcept.Source.Title=data[7].trim();
        contentTripletforTargetConcept.Source.Url=data[8].trim();
        contentTripletforTargetConcept.Source.Tags.push(data[12].trim());
        contentTripletforTargetConcept.Relationship.Name=data[9].trim();
        contentTripletforTargetConcept.Relationship.Taxonomy=data[10].trim();
        contentTripletforTargetConcept.Target.Name=data[1].trim();
        contentTripletforTargetConcept.Target.Domain=domain1;
        this.contentArr.push(contentTripletforSourceConcept);
        this.contentArr.push(contentTripletforTargetConcept);
      
     
    }
    this.conceptmapdata.Version=version1;
    this.conceptmapdata.Domain=domain1;
    this.conceptmapdata.Triplet = this.dataArr;
    this.conceptmapdata.Concepts = this.concepttags.filter((v, i, a) => a.indexOf(v) === i);
    this.conceptmapdata.contentConceptTriplet=this.contentArr;
    console.log(this.conceptmapdata);
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
  getNodeData() {

    this.conceptmapdata.Concepts.forEach(x => {
      var C: n = new n();
      C.id = x;

      this.nodes.push(C);

    });
    this.conceptmapdata.Triplet.forEach(x => {
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
  loadgraph() {
    var data = this.getNodeData();
    const svg = d3.select('svg');
    const width = +svg.attr('width');
    const height = +svg.attr('height');

    const simulation = d3.forceSimulation()
      .force('link', d3.forceLink().id((d) => d.id))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force("charge", d3.forceManyBody().strength(-200));



    const link = svg.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(data.links)
      .enter()
      .append('line')
      .style("stroke", linkColour)
      .attr('stroke-width', 2);
    function linkColour(d) {
      console.log(d);
      if (d.label == "SAME_AS") {
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
  contentConceptTriplet:ContentTriplet[];
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
export class Content{
 Title:string;
 Url :string;
 Tags :string[];

}
export class ContentRelationship{
  Name:string;
  Taxonomy:string;
}

export class ContentTriplet{
  Source:Content;
  Target:Concept;
  Relationship:ContentRelationship;
}

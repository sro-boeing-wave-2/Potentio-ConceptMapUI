import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Component, Inject, ViewChild } from '@angular/core';
import { GraphService } from './graph.service';
import * as d3 from 'd3';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
 
}
@Component({
  selector: 'create-concept-dialog',
  templateUrl: 'createconceptmap.html',
  styleUrls: ['createconceptmap.css']
})
export class DialogDataExampleDialog {
  public static dialogRef;
  @ViewChild('fileImportInput') fileImportInput: any;
  public csvRecords;
  public dataArr = []
  public Domain;
  public Version;
  public concepttags =[];
  public node=[];
  public links=[];
  public graph=[];
  conceptmapdata: ConceptMapData = new ConceptMapData();

  constructor(public dialog: MatDialog, private graphservice: GraphService) { }
  submit() {
    this.graphservice.PostConceptMap(this.conceptmapdata).subscribe(result => console.log(result.statusText));
    console.log(this.conceptmapdata);


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
    this.conceptmapdata.Concepts=this.concepttags.filter((v, i, a) => a.indexOf(v) === i);
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
  Triplet: ConceptMap[]
  Concepts: string[];
}
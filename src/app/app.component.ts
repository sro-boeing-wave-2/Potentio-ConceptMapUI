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

}

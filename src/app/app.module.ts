import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { GraphComponent } from './graph/graph.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {DialogDataExampleDialog} from './app.component';
import {HttpModule} from '@angular/http';
import * as d3 from "d3";
import {
  MatCardModule,
  MatDialogModule,
  MatPaginatorModule,
  MatToolbarModule,
  MatFormFieldModule,
  MatChipsModule,
  MatInputModule,
  MatIconModule,
  MatSelectModule,
  MatButtonModule,
  MatProgressSpinnerModule,
  MatSlideToggleModule,
  MatGridListModule,
  MatTableModule,
} from '@angular/material';
@NgModule({
  declarations: [
    AppComponent,
    GraphComponent,
    DialogDataExampleDialog,
  ],
  imports: [
    BrowserModule,
    MatButtonModule,
    MatToolbarModule,
    MatDialogModule,
    BrowserAnimationsModule,
    MatIconModule ,
    MatCardModule,
    MatButtonModule,
    HttpModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [DialogDataExampleDialog,GraphComponent]
})
export class AppModule { }

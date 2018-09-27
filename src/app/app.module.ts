import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {DialogDataExampleDialog} from './app.component';
import {HttpModule} from '@angular/http';
import { AppRoutingModule } from './app-routing-module';
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
import { GraphComponent } from './graph/graph.component';
@NgModule({
  declarations: [
    AppComponent,
    DialogDataExampleDialog,
    GraphComponent,
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
    HttpModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [DialogDataExampleDialog]
})
export class AppModule { }

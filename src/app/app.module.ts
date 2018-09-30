import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { ImportConceptMapComponent } from './import-concept-map/import-concept-map.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpModule } from '@angular/http';
import { MatStepperModule,  MatAutocompleteModule } from '@angular/material';
import { RouterModule, Routes, Router } from '@angular/router';
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

const appRoutes: Routes = [
  {
    path: 'import-concept-map',
    component: ImportConceptMapComponent,
  },
  {
    path: '',
    redirectTo: '/import-concept-map',
    pathMatch: 'full',
  }
];

@NgModule({
  declarations: [
    AppComponent,
    ImportConceptMapComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    MatButtonModule,
    MatToolbarModule,
    MatDialogModule,
    BrowserAnimationsModule,
    MatIconModule ,
    MatCardModule,
    MatButtonModule,
    HttpModule,
    MatStepperModule,
    MatAutocompleteModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DialogDataExampleDialog} from './app.component';
import {GraphComponent} from './graph/graph.component';
import {AppComponent} from './app.component';

const route: Routes = [
    { path: '', redirectTo: 'conceptmap', pathMatch: 'full' },
    { path: 'graph', component: GraphComponent },
    { path: 'conceptmap', component: DialogDataExampleDialog }
    
]

@NgModule({
    imports: [
        RouterModule.forRoot(route)
    ],
    exports: [RouterModule],
    declarations: []
})
export class AppRoutingModule { }
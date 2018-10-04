import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable({
  providedIn: 'root'
})
export class GraphService {

  constructor(private http: Http) {

   }
   PostConceptMap(ConceptMap){
  
      return this.http.post("http://13.126.26.172/conceptmap", ConceptMap);
    }
  }


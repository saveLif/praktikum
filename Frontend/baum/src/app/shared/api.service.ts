// https://angular.io/tutorial/toh-pt6#import-heroes
// https://angular.io/tutorial/toh-pt4

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private _http: HttpClient) {}


  //Abfrage des Servers mit einem bestimmten Pfad

  getGeoData(pfad: any, page: number , limit: number) {
    return this._http
      .get<any>(`http://localhost:5000/${pfad}?page=${page}&limit=${limit}`)
      .pipe(catchError(this.handleError<any[]>('getData', [])));
  }

  getMapData(pfad: any) {
    return this._http
    .get<any>(`http://localhost:5000/${pfad}`)
    .pipe(catchError(this.handleError<any[]>('getData', [])));
  }

  getData(pfad: any) {
    return this._http
      .get<any>(`http://localhost:5000/${pfad}`)
      .pipe(catchError(this.handleError<any[]>('getData', [])));
  }

  postData(pfad: any, createBody: any){
    const httpHeaders =new HttpHeaders();
    httpHeaders.append('content-type', 'application/json')
    return this._http
    .post<any>('http://localhost:5000/' + pfad,createBody,{ headers: httpHeaders})
    
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}

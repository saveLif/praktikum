import { Injectable } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/shared/api.service';
import { Form, FormBuilder } from '@angular/forms';
import {FormsModule} from "@angular/forms";
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { data } from 'autoprefixer';
import { Observable, Subject } from 'rxjs';
import { LoginService } from './login.service';
@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  public reservations: any;
  public msgTrue = false;
  constructor(private http:HttpClient, public fb:FormBuilder,private api: ApiService, private loginService: LoginService) { }
  addNewReservation(form: any) {
    const user_id = localStorage.getItem('user_id');
    const object_id = localStorage.getItem('object_id');
    const newFormData = {
      timestamp: form.value.timestamp
    };
    this.api.postData(`reservation/${user_id}/${object_id}`, newFormData).subscribe(data => {
      console.log(data);
      this.msgTrue = true;
    });
  }


  public checkReservation():Observable<boolean>{
    
    const user_id = localStorage.getItem('user_id');; // Hier würde normalerweise die user_id aus dem local storage verwendet werden
    var subject = new Subject <boolean>();
    this.api.getData(`reminder/${user_id}`).subscribe(res => {
      console.log(res)
      this.reservations = res;
      for (let reservation of this.reservations) {
        // Überprüfen Sie, ob das Reservierungs-Timestamp gleich dem aktuellen Datum ist und größer als der aktuelle Zeitstempel
        var date = new Date(reservation.timestamp);
        var now = new Date();
        if (date.getUTCFullYear()===now.getUTCFullYear() && date.getUTCMonth()===now.getUTCMonth() && date.getUTCDate()===now.getUTCDate()   && date > now) {
         subject.next(true);
         return
        }
      }
      subject.next(false);
    });return subject.asObservable();
  }


 


  
  
}









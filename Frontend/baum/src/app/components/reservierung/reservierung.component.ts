import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/shared/api.service';
import { Form, FormBuilder } from '@angular/forms';
import {FormsModule} from "@angular/forms";
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { data } from 'autoprefixer';
import { GpsService } from 'src/app/shared/gps.service';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { DateAdapter } from '@angular/material/core';
import { LoginService } from 'src/app/shared/login.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-reservierung',
  templateUrl: './reservierung.component.html',
  styleUrls: ['./reservierung.component.scss']
})
export class ReservierungComponent implements OnInit {

  
  constructor(private http:HttpClient, public fb:FormBuilder,private api: ApiService, private gps: GpsService, private dateAdapter: DateAdapter<Date>, private loginService: LoginService, private router: Router) { 
    this.dateAdapter.setLocale('de');
  }
  msgTrue = false;
  dataSource: any;
  map :any;
  getJsonValue:any
  object_id : any
  ngOnInit(): void {
    if (!this.loginService.isLoggedIn()) {
      this.router.navigate(['/green-game/spielwiese']);

    
    }
    
    }
  
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
    
    public addPlayer() {
      if(!this.gps.lat || !this.gps.long){
          this.gps.getUserLocation(this.map);
          return;
      }
      // Benutzer-ID aus Local Storage lesen
      const user_id = localStorage.getItem('user_id');
      // Benutzer-Breitengrad und -Längengrad aus GPS-Dienst lesen
      const user_latitude = this.gps.lat;
      const user_longitude = this.gps.long;
      // HTTP-POST-Anfrage an API senden
      this.http.post(`http://localhost:5000/addPlayer/${user_id}/${user_latitude}/${user_longitude}`,{}).subscribe(response => {
        // Erfolgreiche Antwort vom Server verarbeiten
        console.log(response);
        this.msgTrue = true;
      }, error => {
        // Fehlerbehandlung
        console.log(error);
      });
    }

      public getMethod(){
        this.api.getData('g/1/1').subscribe((score) => {
          console.log(score);
          this.getJsonValue = score;
          this.dataSource['points'] =score['point'];
        });
      }
  
  }

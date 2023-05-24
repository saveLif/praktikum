import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/shared/api.service';
import { HttpClient } from '@angular/common/http';
import { GpsService } from 'src/app/shared/gps.service';
import { FormControl } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { DateAdapter } from 'chart.js';
import { LoginService } from 'src/app/shared/login.service';
export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
  level: number;
}



@Component({
  selector: 'app-weltrangliste',
  templateUrl: './weltrangliste.component.html',
  styleUrls: ['./weltrangliste.component.scss']
})

export class WeltranglisteComponent implements OnInit {
 
  
  displayedColumns: string[] = ['platzierung','first_name', 'points','level','rangstatus'];
  userrang: any;
  dataSource: any;
 
  
  start_time!: any
  end_time!:any



  rankings: any;
  map :any;
  msgTrue: any;
  public getJsonValue:any;
  constructor( private router: Router, private api: ApiService, private http: HttpClient, private gps: GpsService, private loginService: LoginService) {}



  //`http://localhost:5000/getpicture/${user_id}`

  ngOnInit(): void {
    if (!this.loginService.isLoggedIn()) {
      this.router.navigate(['/home/favorites']);
      this.getRankWithTimeRange()
    
    }
  
   
  this.get_ranking_user()
  this.get_ranking()
  }
 
 
 
  get_ranking_user(){
    const user_id = localStorage.getItem('user_id');
  
    this.http.get<any>(`http://localhost:5000/get_ranking/${user_id}`).subscribe(
      res => {
        this.userrang = res;
        console.log(this.userrang);
      },
      err => {
        console.log(err);
      }
    );
  }
 
  get_ranking() {
    this.http.get<any>('http://localhost:5000/get_ranking').subscribe(
      res => {
        this.dataSource = res;
        console.log(this.dataSource);
      },
      err => {
        console.log(err);
      }
    );
  }
 
  getRankWithTimeRange() {
       // Format the selected dates to a string in the format "YYYY-MM-DD"
       let start_time_str = this.start_time.toISOString().slice(0,10);
       let end_time_str = this.end_time.toISOString().slice(0,10);
    
    this.http.get<any>('http://localhost:5000/get_ranking', {
      params: {
        start_time: start_time_str,
        end_time: end_time_str
      }
    }).subscribe(data => {
      this.dataSource = data;
    });
  }

  addEventStart(type: string, event: MatDatepickerInputEvent<Date>) {
    this.start_time = event.value;
    this.start_time.setDate(this.start_time.getDate() + 1);
    
  
  }

  addEventEnd(type: string, event: MatDatepickerInputEvent<Date>) {
    this.end_time = event.value;
    this.end_time.setDate(this.end_time.getDate() + 1);
    this.getRankWithTimeRange()

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
    
    this.router.navigate(['/green-game/weltrangliste']);
  }

 


}

import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/shared/api.service';
import { HttpClient } from '@angular/common/http';
import { GpsService } from 'src/app/shared/gps.service';
import { DatePipe } from '@angular/common';
import { LoginService } from 'src/app/shared/login.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-reminder',
  templateUrl: './reminder.component.html',
  styleUrls: ['./reminder.component.scss']
})
export class ReminderComponent implements OnInit {

  displayedColumns: string[] = ['timestamp'];
  dataSource: any;
  getJsonValue:any
  time: any
  reservation: any;
  map :any;
  msgTrue: any;
  constructor(private http:HttpClient,private api: ApiService, private gps:GpsService, private loginService: LoginService, private router: Router) { }

  ngOnInit(): void {
    if (!this.loginService.isLoggedIn()) {
      this.router.navigate(['/home/favorites']);

    
    }
  this.getReservation()

   
 

    
  }
  public getReservation(){
    
    const user_id = localStorage.getItem('user_id');; // Hier würde normalerweise die user_id aus dem local storage verwendet werden
    this.api.getData(`reminder/${user_id}`).subscribe(res => {
      this.reservation = res;
    });
  }

  public getMethod(){
    this.api.getData('g/1/1').subscribe((score) => {
      console.log(score);
      this.getJsonValue = score;
      this.dataSource['points'] =score['point'];
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


  public getzeit(){
    
    var time = this.dataSource['timestamp'];
    console.log(time);
    const date = new Date(time);
    console.log(date);
    var dateFormat = date.getHours()+":"+date.getMinutes();
    console.log(dateFormat);
    return dateFormat;

  }
  
}

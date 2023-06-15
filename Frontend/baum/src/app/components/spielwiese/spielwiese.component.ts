import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/shared/api.service';
import { GpsService } from 'src/app/shared/gps.service';
import { HttpClient } from '@angular/common/http';
import { LoginService } from 'src/app/shared/login.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-spielwiese',
  templateUrl: './spielwiese.component.html',
  styleUrls: ['./spielwiese.component.scss']
})
export class SpielwieseComponent implements OnInit {

  dataSource:any
  getJsonValue:any
  map :any;
  msgTrue: any;
  constructor(private api: ApiService, private gps: GpsService, private http: HttpClient, private loginService: LoginService, private router: Router) { }

  ngOnInit(): void {

    if (!this.loginService.isLoggedIn()) {
      this.router.navigate(['/home/favorites']);

    
    }

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
  
}

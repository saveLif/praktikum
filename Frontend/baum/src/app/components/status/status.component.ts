import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/shared/api.service';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/shared/login.service';
import { HttpClient } from '@angular/common/http';
import { GpsService } from 'src/app/shared/gps.service';
@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss']
})
export class StatusComponent implements OnInit {
  imageData: any;
  dataSource:any
  getJsonValue:any
  imageFile: any
  msgTrue: any
  map: any
  constructor(private api: ApiService, private router: Router, private login: LoginService, private http: HttpClient, private gps: GpsService ) { }

  ngOnInit(): void {
    
    if (!this.login.isLoggedIn()) {
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
    this.router.navigate(['green-game/spielwiese']);
  }

 
  public getMethod(){
    this.api.getData('g/1/1').subscribe((score) => {
      console.log(score);
      this.getJsonValue = score;
      this.dataSource['points'] =score['point'];
    });
  }
  logout() {
    this.login.logout().subscribe(() => {
      // Lösche den Token aus dem Local Storage
      localStorage.removeItem('token');
      localStorage.removeItem('user_id');
      // Leite den Benutzer auf die Login-Seite um
      this.router.navigate(['/home/favorites']);
    });
  }
 
  
  async onFileSelected(event: any) {
    const file = event.target.files[0];

    // Bilddaten in Base64-kodierten String umwandeln
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const imageData = reader.result;

      // Benutzer-ID aus Local Storage lesen
      const userId = localStorage.getItem('userId');

      // Bilddaten und Benutzer-ID in Anfrage-Body einfügen
      const body = {
        image: imageData,
        user_id: userId,
      };

      // POST-Anfrage an API senden
      this.http.post('/upload', body).subscribe(response => {
        // Erfolgsantwort vom Server verarbeiten
        console.log(response);
      });
    };
  }
  upload() {
    const file = this.imageFile;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const imageData = reader.result;
      const userId = localStorage.getItem('userId');
      const body = {
        image: imageData,
        user_id: userId
      };
      this.http.post('/upload', body).subscribe(response => {
        console.log(response);
      });
    };
  }
  
  
}

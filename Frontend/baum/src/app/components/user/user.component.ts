import { Component, OnInit,  } from '@angular/core';
import { ApiService } from 'src/app/shared/api.service';
import { HttpClient } from '@angular/common/http';
import { data } from 'autoprefixer';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/shared/login.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Input } from '@angular/core';
import { Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { GpsService } from 'src/app/shared/gps.service';

export interface PeriodicElement {
  name: string;
  rang: string;
  upunkte: number;
  ulevel: number;

}

/*const ELEMENT_DATA: PeriodicElement[] = [
  {name: 'Julian Meyer-Veit',rang: 'Grasshüpfer',upunkte: 20, ulevel: 10},



];*/

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
 
})

export class UserComponent implements OnInit {
@Input() profilePictureUrl: any;


  //displayedColumns: string[] = ['name','rang','upunkte','ulevel'];
  //dataSource = ELEMENT_DATA;
displayedColumns: string[] = ['first_name','rangstatus', 'points','level'];

dataSource: any;
imageData: any;
  getJsonValue:any
  imageFile: any
  userId: any;
  user_picture: any;
  map :any
  user: any
  msgTrue: any

public postJsonValue:any;
constructor(private gps: GpsService, private api: ApiService, private router: Router, private login: LoginService, private http: HttpClient, private sanitizer: DomSanitizer) { }



ngOnInit(): void {
  this.loadProfilePicture();
  this.getProfil();
}  

onFileChange(event: any) {
  const file = event.target.files[0];
  const formData = new FormData();
  const user_id = localStorage.getItem('user_id');
  console.log(user_id)
  if (user_id) {
    formData.append('user_id', user_id);
  }
  formData.append('user_picture', file);
  this.http.post('http://localhost:5000/userpictureupload', formData).subscribe(response => {
    console.log(response);
    this.loadProfilePicture();
  }, error => {
    console.error(error);
  });
}




loadProfilePicture(): void {
  const user_id = localStorage.getItem('user_id');
  this.http.get(`http://localhost:5000/getpicture/${user_id}`, { responseType: 'blob' }).subscribe(picture => {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      this.profilePictureUrl = reader.result;
    }, false);

    if (picture) {
      reader.readAsDataURL(picture);
    }
  });
}

getProfil() {
  console.log('profil');
  const user_id = localStorage.getItem('user_id');
  return this.api.getData(`/profil/${user_id}`).subscribe((data) => {
  this.user = data
});
  };
  
  
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
    
    this.router.navigate(['/green-game/status']);
  }



public getMethod(){
  this.api.getData('g/1/1').subscribe((score) => {
    console.log(score);
    this.getJsonValue = score;
    this.dataSource['points'] =score['point'];
  });
}




}













  

/*public getMethod(){
  this.http.get('http://127.0.0.1:5000/profil/1').subscribe((data) => {
    console.log(data);
    this.dataSource=data;
  }

  );
   
}*/
  


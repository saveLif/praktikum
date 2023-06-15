import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/shared/api.service';
import { Form, FormBuilder } from '@angular/forms';
import {FormsModule} from "@angular/forms";
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { data } from 'autoprefixer';
import { Router } from '@angular/router'; // import the router
import { LoginService } from 'src/app/shared/login.service';
import { FormGroup } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit {

   // Formular-Steuerelemente für die Anmeldung
   loginFormControl = new FormControl('');
   passwordFormControl = new FormControl('');
 
   

   loginForm = new FormGroup({
    login_identifier: this.loginFormControl,
     password: this.passwordFormControl
   })
 
   // Flag, um anzuzeigen, ob Benutzer erfolgreich registriert wurde
   userRegistered = false;
 
   

  constructor(private http:HttpClient, public fb:FormBuilder,private api: ApiService, private router: Router, private loginService: LoginService) { 
    
  }
  msgTrue = false;
  dataSource: any;
  ngOnInit(): void {
    if (this.loginService.isLoggedIn()) {
      this.router.navigate(['/green-game/spielwiese']);

    
    }
  }
  login(form: any): void {
    const { login_identifier, password } = form.value;
    this.api.postData('login', { login_identifier, password }).subscribe(response => {
      const token = response['token'];
      const user_id = response['user_id'];
      if (token && user_id) {
        localStorage.setItem('token', token);
        localStorage.setItem('user_id', user_id);
        const userId = localStorage.getItem('user_id');
        console.log(userId);
        this.router.navigate(['green-game/spielwiese']);
      } else {
        // Fehlermeldung anzeigen, wenn Token nicht zurückgegeben wurde
        console.error('Anmeldung fehlgeschlagen: ', response.error);
      }
    });
  }
  
  navigiereZurRegistrierung(){
    console.log('Button Zur Registrierung clicked');
    this.router.navigate(['/home/register'])
  }
  
  
      }


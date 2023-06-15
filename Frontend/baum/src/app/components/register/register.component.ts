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
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

   // Formular-Steuerelemente für die Anmeldung
   loginFormControl = new FormControl('');
   passwordFormControl = new FormControl('');
 
   // Formular-Steuerelemente für die Registrierung
   emailFormControl = new FormControl('');
   pseudonymFormControl = new FormControl('');
   passwordFormControl2 = new FormControl('');

   loginForm = new FormGroup({
    login_identifier: this.loginFormControl,
     password: this.passwordFormControl
   })
 
   // Flag, um anzuzeigen, ob Benutzer erfolgreich registriert wurde
   userRegistered = false;
 
   // FormGroup für die Registrierung
   registerForm = new FormGroup({
     email: this.emailFormControl,
     pseudonym: this.pseudonymFormControl,
     password: this.passwordFormControl2
   });
  
  
 

  

  constructor(private http:HttpClient, public fb:FormBuilder,private api: ApiService, private router: Router, private loginService: LoginService) { 
    
  }
  msgTrue = false;
  dataSource: any;
  ngOnInit(): void {
    if (this.loginService.isLoggedIn()) {
      this.router.navigate(['/green-game/spielwiese']);

    
    }
  }
  
  generatedPseudonym: string = '';

  generatePseudonym(): void {
    const email = this.emailFormControl.value;
    // Extract the part before the "@" symbol from the email
    const username = email?.split('@')[0];
    // Generate a random number between 0 and 99
    const randomNumber = Math.floor(Math.random() * 99) + 0;
    // Combine the username and random number to create the pseudonym
    this.generatedPseudonym = username + randomNumber.toString();
    this.pseudonymFormControl.patchValue(this.generatedPseudonym);
  }
  
  
  register(form: any): void {
    const { email, password, pseudonym } = form.value;
    this.api.postData('register', { email, password, pseudonym }).subscribe(data => {
    console.log(data);
    this.msgTrue = true;
    });
    }
  
  
  
  
  
   

       
      }


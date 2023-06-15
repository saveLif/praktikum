import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ApiService } from 'src/app/shared/api.service';
import { LoginService } from 'src/app/shared/login.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  navLinks: any[];
  activeLinkIndex = -1;
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

  //Die Definition der Reiter
  constructor( private http:HttpClient, public fb:FormBuilder,private api: ApiService, private router: Router, private loginService: LoginService) {
    this.navLinks = [
      {
        label: 'Anmeldung',
        icon: 'star',
        link: './favorites',
        index: 0,
      },
      {
        label: 'Registrierung',
        icon: 'Hat',
        link: './register',
        index: 1,
      },
      {
        label: 'Map',
        icon: 'map',
        link: './map',
        index: 2,
      },
      {
        label: 'Liste',
        icon: 'list',
        link: './list',
        index: 3,
      },
      {
        label: 'Baumkunde',
        icon: 'nature',
        link: './tree-science',
        index: 4,
      },
    ];
  }
 msgTrue = false;
  dataSource: any;
  ngOnInit(): void {
    if (!this.loginService.isLoggedIn()) {
      this.router.navigate(['/home/favorites']);

    
    }
    if (this.loginService.isLoggedIn()) {
      this.router.navigate(['/green-game/spielwiese']);

    
    }
    this.router.events.subscribe((res) => {
      this.activeLinkIndex = this.navLinks.indexOf(
        this.navLinks.find((tab) => tab.link === '.' + this.router.url)
      );
    });

  }


  
  
  
 
}

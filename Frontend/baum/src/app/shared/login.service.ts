import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class LoginService {
  msgTrue: any
  constructor(private api: ApiService, private router: Router, private http: HttpClient) {}

  // Anmelde-Funktion, die den Benutzerdaten an die API sendet und den Token zurückgibt, wenn erfolgreich
  login(form: any): void {
    const { login_indetifier, password } = form.value;
    this.api.postData('login', { login_indetifier, password }).subscribe(response => {
      const token = response['token'];
      if (token) {
        localStorage.setItem('token', token);
        this.router.navigate(['/']);
      } else {
        // Fehlermeldung anzeigen, wenn Token nicht zurückgegeben wurde
        console.error('Anmeldung fehlgeschlagen');
      }
    });
  }

  // Abmelde-Funktion, die den Token aus dem Local Storage entfernt und den Benutzer zur Anmeldeseite weiterleitet
 

  // Registrierungs-Funktion, die den Benutzerdaten an die API sendet

  register(form: any): void {
    const { email, password, pseudonym } = form.value;
    this.api.postData('register', { email, password, pseudonym }).subscribe(data => {
    console.log(data);
    this.msgTrue = true;
    });
    }
  

    isLoggedIn(): boolean {
      // Lese den Token aus dem Local Storage
      const token = localStorage.getItem('token');
      // Überprüfe, ob der Token gesetzt ist
      return token !== null && token !== 'Logout';
    }
  
    // Methode, um den Benutzer zur Anmeldeseite umzuleiten, wenn er nicht angemeldet ist
    ensureLoggedIn(): void {
      if (!this.isLoggedIn()) {
        this.router.navigate(['/login']);
      }
    }
    logout(): Observable<any> {
      const token = localStorage.getItem('token');
      // Auf die logout Funktion im localhost zugreifen
      return this.http.post('http://localhost:5000/logout', {token});
    }

}

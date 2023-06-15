import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { LoginService } from '../shared/login.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent {

  user_id = localStorage.getItem('user_id');
  profilePictureUrl: any;


  // Stellt das Navigationsmenü bereit, das unter der html-Datei definiert wird
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver, private login :LoginService, private router: Router, private http: HttpClient) {}
  logout() {
    this.login.logout().subscribe(() => {
      // Lösche den Token aus dem Local Storage
      localStorage.removeItem('token');
      localStorage.removeItem('user_id');
      localStorage.removeItem('object_id')
      // Leite den Benutzer auf die Login-Seite um
      this.router.navigate(['/home/favorites']);
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
}

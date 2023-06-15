import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/shared/login.service';
@Component({
  selector: 'app-green-game',
  templateUrl: './green-game.component.html',
  styleUrls: ['./green-game.component.scss']
})
export class GreenGameComponent implements OnInit {
  navLinks: any[];
  activeLinkIndex = -1;

   //Die Definition der Reiter
  constructor(private router: Router, private loginService: LoginService) { 
    this.navLinks = [
      {
        label: 'Spielwiese',
        icon: 'local_florist',
        link: './spielwiese',
        index: 0,
      },
      {
        label: 'Reservierung',
        icon: 'date_range',
        link: './reservierung',
        index: 1,
      },
      {
        label: 'Reminder',
        icon: 'date_range',
        link: './reminder',
        index: 2,
      },
      {
        label: 'Status',
        icon: 'stars',
        link: './status',
        index: 3,
      },
      {
        label: 'Weltrangliste',
        icon: 'score',
        link: './weltrangliste',
        index: 4,
      },
      
    ];
  }

  ngOnInit(): void {
    if (!this.loginService.isLoggedIn()) {
      this.router.navigate(['/home/favorites']);

    
    }
    this.router.events.subscribe((res) => {
      this.activeLinkIndex = this.navLinks.indexOf(
        this.navLinks.find((tab) => tab.link === '.' + this.router.url)
      );
    });
  }
  }



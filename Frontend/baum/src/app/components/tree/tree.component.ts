import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/shared/api.service';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss'],
})
export class TreeComponent implements OnInit {
  navLinks!: any[];
  activeLinkIndex = -1;
  treeID: any;

  //Die Definition der Reiter wenn ein einzelner Baum ausgewählt wurde
  constructor(
    private api: ApiService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    
  }

  ngOnInit(): void {
    //liest die ID des Baumes aus
    this.treeID = this.activatedRoute.snapshot.paramMap.get('id');// muss ich noch googeln
    this. treeID = 1;
    //Routing
    this.router.events.subscribe((res) => {
      this.activeLinkIndex = this.navLinks.indexOf(
        this.navLinks.find((tab) => tab.link === '.' + this.router.url)
      );
    });
  }
}

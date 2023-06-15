import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/shared/api.service';

@Component({
  selector: 'app-tree-science',
  templateUrl: './tree-science.component.html',
  styleUrls: ['./tree-science.component.scss']
})
export class TreeScienceComponent implements OnInit {

  alldescriptiondata: any;


  constructor(private api: ApiService) {}


  ngOnInit(): void {
    this.getdata();
  }

  //ruft die Daten der Objecte ab und stellt sie mit allobjectdata der html zur Verfügung
  getdata(): void {
    this.api.getData('description').subscribe((description) => {
      this.alldescriptiondata = description;
    });
  }
}

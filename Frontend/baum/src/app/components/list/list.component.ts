import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../shared/api.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  allobjectdata: any;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.getdata();
  }

  //ruft die Daten der Objecte ab und stellt sie mit allobjectdata der html zur Verfügung
  getdata(): void {
    this.api.getData('object').subscribe((object) => {
      this.allobjectdata = object;
    });
  }
}

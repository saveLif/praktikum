import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/shared/api.service';
import { TreeComponent } from '../tree/tree.component';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss'],
})
export class InfoComponent implements OnInit {
  treeID: any;
  path!: string;
  path1!: string;
  allobjectdata: any;
  alldescriptiontdata: any;

  constructor(private api: ApiService, private tree: TreeComponent) {}

  ngOnInit(): void {
    //liest die Tree ID aus
    this.treeID = this.tree.treeID;

    this.getdata();
  }

  //ruft die Daten der Objecte ab und stellt sie mit allobjectdata der html zur Verfügung
  getdata(): void {

    //generiert den Pfad für den Server
    this.path = 'object?ID=' + this.treeID;
    //Ruft das Object ab
    this.api.getData(this.path).subscribe((object) => {
      this.allobjectdata = object;
      for (const ob of object) {
      //generiert den Pfad für den Server
    this.path1 = 'description?ID=' + ob.sensor_node_ID;
    //ruft die Beschreibung ab
    this.api.getData(this.path1).subscribe((description) => {

      this.alldescriptiontdata = description;

    });}
    });


  }
}

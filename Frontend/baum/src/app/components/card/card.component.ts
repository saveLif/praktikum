import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/shared/api.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  treeID: any;
  path!: string;
  path1!: string;
  allobjectdata: any;
  alldescriptiontdata: any;
  description_id: any
  dataSource: any

  constructor(private api: ApiService,private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.treeID = this.activatedRoute.snapshot.paramMap.get('german_name');
console.log(this.treeID)
    this.api.getData('card?gn='+this.treeID).subscribe((data) => {
      this.dataSource = data;
    });

  }

  //ruft die Daten der Objecte ab und stellt sie mit allobjectdata der html zur Verfügung
  getdata(): void {



      //generiert den Pfad für den Server
    this.path1 = 'card?gn=Winter-Linde'
    //ruft die Beschreibung ab
    this.api.getData(this.path1).subscribe((description) => {

      this.alldescriptiontdata = description;
      console.log(this.alldescriptiontdata)

    });


  }
}

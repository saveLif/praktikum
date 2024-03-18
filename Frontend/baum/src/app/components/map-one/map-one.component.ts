//https://www.digitalocean.com/community/tutorials/angular-angular-and-leaflet

import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { ApiService } from 'src/app/shared/api.service';
import { MarkerService } from '../../shared/marker.service';
import { TreeComponent } from '../tree/tree.component';
import { GpsService } from '../../shared/gps.service'

@Component({
  selector: 'app-map-one',
  templateUrl: './map-one.component.html',
  styleUrls: ['./map-one.component.scss'],
})
export class MapOneComponent implements OnInit {
  private map!: L.Map;
  treeID: any;
  path!: string;

  constructor(
    private markerService: MarkerService,
    private tree: TreeComponent,
    private api: ApiService,
    private userGPS: GpsService
  ) {}

  ngOnInit(): void {
    //liest die Tree ID aus
    this.treeID = this.tree.treeID;
    //generiert den Pfad für den Server
    this.path = 'object?ID=' + this.treeID;
    this.initMap();

  }

  //Initialisiert die Map
  private initMap(): void {
    //ruft das Darszustellende Object ab
    this.api.getData(this.path).subscribe((object: any) => {
      for (const t of object) {
        //Koordinaten und Zoomstufe werden definiert
        this.map = L.map('map', {
          center: [t.geolocation.latitude, t.geolocation.longitude],
          zoom: 17,
        });
        //Maplayout wird von oppenstreetmap abgerufen
        const tiles = L.tileLayer(
          'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          {
            maxZoom: 19,
            minZoom: 3,
            attribution:
              '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          }
        );
        //Layout wird zur Map hinzugefügt
        tiles.addTo(this.map);
        //Markerservice wird aufgerufen
       // this.markerService.makeMarker(this.map, this.path);
        this.userGPS.getUserLocation(this.map);
      }
    });
  }
}

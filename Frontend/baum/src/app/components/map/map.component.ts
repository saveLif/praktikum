//https://www.digitalocean.com/community/tutorials/angular-angular-and-leaflet

import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { MarkerService } from '../../shared/marker.service';
import { GpsService } from '../../shared/gps.service';

const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';
const iconDefault = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = iconDefault;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  private map!: L.Map;

  constructor(
    private markerService: MarkerService,
    private userGPS: GpsService
  ) {}

  ngOnInit(): void {
    //Aufruf zur Initialisierung der Map
    this.initMap();

  }
  //Map wird in der Mitte Braunschweigs zentriert aufgerufen
  private initMap(): void {
    this.map = L.map('map', {
      center: [52.2646577, 10.5236066],
      zoom: 12,
    });

    //Map wird von openstreetmap geladen mit verschiedenen Layers
    // unterschiedliche Layers https://leaflet-extras.github.io/leaflet-providers/preview/
    //standart Layer
    const OSM = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 19,
        minZoom: 3,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }
    );
    //Layer mit weniger Farbe und kaum allgemeinen Infos
    var CartoDB_Voyager = L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19,
        minZoom: 3,
      }
    );

    //Openstreetmap wird dieser Map hinzugefügt
    CartoDB_Voyager.addTo(this.map);

            //Markerservice wird aufgerufen
            this.markerService.makeMaker(this.map, 'object');
            this.userGPS.getUserLocation(this.map);
  }
}

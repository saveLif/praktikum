import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { MarkerService } from '../../shared/marker.service';
import { GpsService } from '../../shared/gps.service';
import 'leaflet.markercluster';
import { ApiService } from 'src/app/shared/api.service';

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
  private markers!: L.MarkerClusterGroup;

  constructor(
    private markerService: MarkerService,
    private api: ApiService,
    private userGPS: GpsService
  ) {}

  ngOnInit(): void {
    this.initMap();
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [52.2646577, 10.5236066],
      zoom: 12,
    });

    const OSM = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 19,
        minZoom: 3,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }
    );

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

    CartoDB_Voyager.addTo(this.map);


    this.markers = L.markerClusterGroup({
      iconCreateFunction: (cluster) => {
        const count = cluster.getChildCount();
        const treeIconUrl = 'assets/arbre-icon.png';

        return L.divIcon({
          html: `<div><span>${count}</span><img src="${treeIconUrl}" /></div>`,
          className: 'custom-cluster-icon',
          iconSize: [20, 20]
        });
      },
    });

    this.map.addLayer(this.markers);
    
    let page = 0; 
    let limit = 1000;

    do {
      this.api.getGeoData('object', page, limit).subscribe((object: any) => {
        for (const t of object) {
          console.log(t.ID + "    in map Component")
          this.markerService.makeMarkers(this.markers, 'object', t);
        }

      });
      page = page + 1;
    } while(page *limit < 92000); 

    this.userGPS.getUserLocation(this.map);
  }
}

import { Component, OnInit } from '@angular/core';

import { MarkerService } from '../../shared/marker.service';
import { GpsService } from '../../shared/gps.service';

import { ApiService } from 'src/app/shared/api.service';

interface Cluster {
  center: [number, number];
  markers: { latitude: number; longitude: number }[];
}


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent {
  //private map!: L.Map;
  //private markers!: L.MarkerClusterGroup;

  constructor(
    private markerService: MarkerService,
    private api: ApiService,
    private userGPS: GpsService
  ) {}

  
  ngOnInit(): void {
    this.initMap();
  }

  private initMap(): void {
      this.api.getMapData('cluster').subscribe((file: any) => {

        console.log(file +  "  Return Map file");

      });
     
   
  //  this.userGPS.getUserLocation(this.map);
  }
}
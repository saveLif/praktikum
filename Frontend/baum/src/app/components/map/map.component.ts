import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { MarkerService } from '../../shared/marker.service';
import { GpsService } from '../../shared/gps.service';
import 'leaflet.markercluster';
import { ApiService } from 'src/app/shared/api.service';
import { Point } from 'leaflet';

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

    let progress = document.getElementById('progress');
		let progressBar = document.getElementById('progress-bar');

    function updateProgressBar(processed: any, total: any, elapsed: any) {
			if (elapsed > 1000) {
				// if it takes more than a second to load, display the progress bar:
        if (progress != null && progressBar != null){
          console.log(  +  "   into updateProgressBar 1 ")
				  progress.style.display = 'block';
				  progressBar.style.width = Math.round(processed/total*100) + '%';
        }
			}

			if (processed === total) {
				// all markers processed - hide the progress bar:
        if (progress != null)
        {
          console.log(  +  "   into updateProgressBar 2 ")
          progress.style.display = 'none';
        }
			
			}
		}
    this.markers = L.markerClusterGroup(
      { chunkedLoading: true,
        chunkProgress: updateProgressBar ,

      iconCreateFunction: (cluster) => {
        const count = cluster.getChildCount();
        const treeIconUrl = 'assets/arbre-icon.png';

        return L.divIcon({
          html: `<div><span>${count}</span><img src="${treeIconUrl}" /></div>`,
          className: 'custom-cluster-icon',
          iconSize: [20, 20]
        });
      },
      }
      
      );

    console.log('start creating markers: ' + window.performance.now());
    this.markerService.makeMarker(this.markers, 'object');
    console.log('end creating markers: ' + window.performance.now());

    this.map.addLayer(this.markers);
    console.log('end clustering: ' + window.performance.now());
    
    this.userGPS.getUserLocation(this.map);
  }
}

import { Injectable } from '@angular/core';
import * as L from 'leaflet';
import { PopUpService } from './popup.service';
import { ApiService } from '../shared/api.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MarkerService {
  constructor(
    private api: ApiService,
    private popUpService: PopUpService,
    private router: Router
  ) {}

  // Setzt für alle Objekte ein Marker in der Karte
  makeMarker(map: L.Map | L.MarkerClusterGroup, path: string): void {
    const user_id = localStorage.getItem('user_id');
    this.api.getData(`reminder/${user_id}`).subscribe((res) => {
      this.api.getGeoData(path, 0, 500).subscribe((object: any) => {
        let now = new Date();

        let timer = 0;
        // sucht Objekte nach Reservierungen falls reserviert ist der Rand rot sonst schwarz
        
        for (let i = 0; i < object.length; i++) {   
          const t = object[i];   
          let lon = t.geolocation.longitude;
          let lat = t.geolocation.latitude;
          timer = timer + 1 ;
          console.log(t.ID);
          let edge = 'black';
            for (const r of res) {
              console.log(t.ID);
              if (r.object_id === t.ID) {
                console.log(t.ID);
                let date = new Date(r.timestamp);
                if (
                  date.getFullYear() === now.getFullYear() &&
                  date.getMonth() === now.getMonth() &&
                  date.getDate() === now.getDate() &&
                  date > now
                ) {
                  edge = 'red';
                  break;
                }
              }
            }
          /*Falls der letzte Feuchtigkeitsmesswert am aktuellen Tag 
          größer gleich 90 grüner Kreis
          kleiner gleich 25 roter Kreis
          ansonsten orangen Kreis
          Bei keinem Messwert am aktuellen Tag grauer Kreis 
          */
            console.log(t.ID);
            this.api
              .getData('latest_measured_value/' + t.ID)
              .subscribe((measurement) => {
                if (measurement.hasOwnProperty('value')) {
                  let color = 'orange';

                  console.log(t.ID);
                  let date = new Date(measurement.timestamp);
                  if (
                    date.getFullYear() !== now.getFullYear() ||
                    date.getMonth() !== now.getMonth() ||
                    date.getDate() !== now.getDate()
                  ) {
                    color = 'grey';
                  } else {
                    if (measurement.value >= 90) {
                      color = 'green';
                    } else if (measurement.value <= 25) {
                      color = 'red';
                    }
                  }
                  let customIcon = L.icon({
                    iconUrl: 'assets/tree-icon.png',
                    iconSize: [20, 20],      // size of the icon
                    iconAnchor: [16, 16],   // point of the icon which will correspond to marker's location
                    popupAnchor: [0, -16], // point from which the popup should open relative to the iconAnchor
                  })
                  let markerCustom = L.marker([lat,lon], {icon:customIcon})

                  let circle = L.circleMarker([lat, lon], {
                    radius: 5,
                  });
                  circle.setStyle({
                    fillColor: color,
                    color: edge,
                    stroke: true,
                    fillOpacity: 0.5,
                  });

                  console.log(t);
                  let popupinfo = this.popUpService.makeObjectPopup(t);

                  console.log(t.ID);
                  //this.addCircle(map, null, popupinfo, t.ID);
                  this.addIconImage(map, markerCustom, popupinfo, t.ID);
                }
              });
              console.log(timer + " Bäume");
            
            
          }
        });
      });
    }




  addIconImage(map: L.Map | L.MarkerClusterGroup, markerCustom: any, popUpInfo: any, ID: any) {
    if (markerCustom !== undefined) {
      markerCustom//marc
        .addTo(map)
        .bindPopup(popUpInfo)
        .on('popupopen', (a: any) => {
          var popUp = a.target.getPopup();
          console.log(popUp.getElement());
          popUp
            .getElement()
            .querySelector('.open-btn')
            .addEventListener('click', (_e: any) => {
              localStorage.setItem('object_id', ID);

              console.log(ID);
              this.router.navigate(['/tree/' + ID + '/green-game/reservierung']);
            });
        });
    }
  }

  // Erzeugt das Reservierungs Popup Fenster
  addCircle(map: L.Map | L.MarkerClusterGroup, circle: any, popUpInfo: any, ID: any) {
    if (circle!==null && circle !== undefined) {
      circle//marc
        .addTo(map)
        .bindPopup(popUpInfo)
        .on('popupopen', (a: any) => {
          var popUp = a.target.getPopup();
          console.log(popUp.getElement());
          popUp
            .getElement()
            .querySelector('.open-btn')
            .addEventListener('click', (_e: any) => {
              localStorage.setItem('object_id', ID);

              console.log(ID);
              this.router.navigate(['/tree/' + ID + '/green-game/reservierung']);
            });
        });
    }
  }
}
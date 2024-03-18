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


  makeMarkers(map: L.Map | L.MarkerClusterGroup, path: string, t: any): void {
    const user_id = localStorage.getItem('user_id');
    console.log(user_id + " User id");
    let lon = t.geolocation.longitude;
    let lat = t.geolocation.latitude;
    let customIcon = L.icon({
      iconUrl: 'assets/tree-icon.png',
      iconSize: [20, 20],      // size of the icon
      iconAnchor: [16, 16],   // point of the icon which will correspond to marker's location
      popupAnchor: [0, -16], // point from which the popup should open relative to the iconAnchor
    })


    let markerCustom = L.marker([lat,lon], {icon:customIcon})

    console.log(t);
    let popupinfo = this.popUpService.makeObjectPopup(t);
    console.log(t.ID);
    this.addIconImage(map, markerCustom, popupinfo, t.ID);
  }
  // Setzt für alle Objekte ein Marker in der Karte
  makeMarker(map: L.MarkerClusterGroup, path: string) {

    const user_id = localStorage.getItem('user_id');
    this.api.getData(`reminder/${user_id}`).subscribe((res) => {
      this.api.getData(path).subscribe((object: any) => {
        
      let markerList: any[] = [];
        let now = new Date();

        let timer = 0;
        // sucht Objekte nach Reservierungen falls reserviert ist der Rand rot sonst schwarz
        for (const t of object) {    
          let lon = t.geolocation.longitude;
          let lat = t.geolocation.latitude;
          let customIcon = L.icon({
            iconUrl: 'assets/tree-icon.png',
            iconSize: [20, 20],      // size of the icon
            iconAnchor: [16, 16],   // point of the icon which will correspond to marker's location
            popupAnchor: [0, -16], // point from which the popup should open relative to the iconAnchor
          })          
          let markerCustom = L.marker([lat,lon], {icon:customIcon})
          let popupinfo = this.popUpService.makeObjectPopup(t);
          this.addIconImage(map, markerCustom, popupinfo, t.ID);
          markerList.push(customIcon);
        }   
        console.log('MarkerList: ' + markerList.length);
        map.addLayers(markerList)    
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
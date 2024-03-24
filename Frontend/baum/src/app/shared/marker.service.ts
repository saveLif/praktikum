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


  makeMarkers(map: L.Map | L.MarkerClusterGroup, objects: any[]): void {
    // Delete existing markers from the map
    if (map instanceof L.MarkerClusterGroup) {
      map.clearLayers();
    } else {
      map.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          map.removeLayer(layer);
        }
      });
    }
  
    // Add new markers using the objects provided
    objects.forEach((obj) => {
      // Create a marker for each object and add it to the map
      const marker = L.marker([obj.geolocation.latitude, obj.geolocation.longitude]);
  
      // Add a popup to the marker with object details
      marker.bindPopup(this.popUpService.makeObjectPopup(obj));
  
      // Add the marker directly to the cluster or map
      if (map instanceof L.MarkerClusterGroup) {
        map.addLayer(marker);
      } else {
        marker.addTo(map);
      }
    });
  }
  
   // Setzt für alle Objekte ein Marker in der Karte
   makeMarkerForObjects(map: L.MarkerClusterGroup, objects: any[]) {

    map.clearLayers();
    const customIcon = L.icon({
      iconUrl: 'assets/arbre-icon.png',
      iconSize: [20, 20],
      iconAnchor: [16, 16],
      popupAnchor: [0, -16],
    });
    const user_id = localStorage.getItem('user_id');
        
      let markerList: any[] = [];
        let now = new Date();

        let timer = 0;
        // sucht Objekte nach Reservierungen falls reserviert ist der Rand rot sonst schwarz
        for (const t of objects) {    
          let lon = t.geolocation.longitude;
          let lat = t.geolocation.latitude;      
          let markerCustom = L.marker([lat,lon], {icon:customIcon})
          let popupinfo = this.popUpService.makeObjectPopup(t);
          this.addIconImage(map, markerCustom, popupinfo, t.ID);
          markerList.push(markerCustom);
        }   
        console.log('MarkerList: ' + markerList.length);
        map.addLayers(markerList)    
      
}
 
  
  // Setzt für alle Objekte ein Marker in der Karte
  makeMarker(map: L.MarkerClusterGroup, path: string) {

    map.clearLayers();

    
    const customIcon = L.icon({
      iconUrl: 'assets/arbre-icon.png',
      iconSize: [20, 20],
      iconAnchor: [16, 16],
      popupAnchor: [0, -16],
    });
    
    const user_id = localStorage.getItem('user_id');
    this.api.getData(`reminder/${user_id}`).subscribe((res) => {
      this.api.getData(path).subscribe((object: any) => {
        
      let markerList: any[] = [];
        // sucht Objekte nach Reservierungen falls reserviert ist der Rand rot sonst schwarz
        for (const t of object) {    
          let lon = t.geolocation.longitude;
          let lat = t.geolocation.latitude;         
          let markerCustom = L.marker([lat,lon], {icon:customIcon})
          let popupinfo = this.popUpService.makeObjectPopup(t);
          this.addIconImage(map, markerCustom, popupinfo, t.ID);
          markerList.push(markerCustom);
        }   
        map.addLayers(markerList)    
      });
    });
}
 



  addIconImage(map: L.Map | L.MarkerClusterGroup, markerCustom: any, popUpInfo: any, ID: any) {
    if (markerCustom !== undefined) {
      markerCustom
        .addTo(map)
        .bindPopup(popUpInfo)
        .on('popupopen', (a: any) => {
          var popUp = a.target.getPopup();
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
  // addCircle(map: L.Map | L.MarkerClusterGroup, circle: any, popUpInfo: any, ID: any) {
  //   if (circle!==null && circle !== undefined) {
  //     circle
  //       .addTo(map)
  //       .bindPopup(popUpInfo)
  //       .on('popupopen', (a: any) => {
  //         var popUp = a.target.getPopup();
  //         console.log(popUp.getElement());
  //         popUp
  //           .getElement()
  //           .querySelector('.open-btn')
  //           .addEventListener('click', (_e: any) => {
  //             localStorage.setItem('object_id', ID);

  //             console.log(ID);
  //             this.router.navigate(['/tree/' + ID + '/green-game/reservierung']);
  //           });
  //       });
  //   }
  // }
}
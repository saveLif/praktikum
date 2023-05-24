import { Injectable } from '@angular/core';
import * as L from 'leaflet';

@Injectable({
  providedIn: 'root',
})
export class GpsService {
  g: any[] = [];
  public lat!: number; // wird in die komponeten importerit wo der gießen button verwendet um die die kordinatden des users im http post zu übergeben
  public long!: number; // wird in die komponeten importerit wo der gießen button verwendet um die die kordinatden des users im http post zu übergeben
  constructor() {}

  getUserLocation(map: L.Map): any {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.lat = position.coords.latitude;
        this.long = position.coords.longitude;
        this.showPosition(this.lat, this.long, map);
      });
      this.watchPosition(map);
    } else {
      console.log('Geolocation wird von diesem Browser nicht unterstützt.');
    }
  }

  watchPosition(map: L.Map) {
    navigator.geolocation.watchPosition(
      (position) => {
         this.lat = position.coords.latitude;
         this.long = position.coords.longitude;
        this.showPosition(this.lat, this.long, map);
        console.log('Was ist mit carsten los in ostanien')
        console.log('lat '+this.lat+'    long '+this.long)
      },
      (err) => {
        this.showError(err);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  }
  //show Error einfügen unten wird nicht verwendet Und follow mit einfügen  https://www.youtube.com/watch?v=orjkt0VHt1c

  showPosition(lat: any, long: any, map: L.Map) {
    let circleGPS = L.circleMarker([lat, long], {
      radius: 6,
    });
    circleGPS.setStyle({
      fillColor: 'blue',
      color: 'blue',
      stroke: true,
      fillOpacity: 0.2,
    });

    if (circleGPS != undefined) {
      circleGPS.addTo(map);
      console.log('lat '+lat+'    long '+long)
    }else{console.log("Kein Poistionscircle übergeben.")}
  }

  showError(error: any) {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        console.log('Der Benutzer hat die Anfrage zur Geolokalisierung abgelehnt.');
        break;
      case error.POSITION_UNAVAILABLE:
        console.log('Standortinformationen sind nicht verfügbar.');
        break;
      case error.TIMEOUT:
        console.log('Zeitüberschreitung bei der Anforderung des Standorts.');
        break;
    }
  }
}

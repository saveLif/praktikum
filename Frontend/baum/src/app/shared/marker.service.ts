/*import { Injectable } from '@angular/core';
import * as L from 'leaflet';
import { PopUpService } from './popup.service';
import { ApiService } from '../shared/api.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ReservationService } from './reservation.service';


@Injectable({
  providedIn: 'root',
})
export class MarkerService {
  circle: any;
  popUpInfo: any;
  color!: string;

  reservation: any

  constructor(
    private api: ApiService,
    private popUpService: PopUpService,
    private router: Router,
    private reservationService: ReservationService

  ) { }

  ngOnInit(): void { }

  makeMarker(map: L.Map, path: string) {
    const user_id = localStorage.getItem('user_id');
    this.api.getData(`reminder/${user_id}`).subscribe(res => {
      console.log('hallo sea breaze');
      console.log(res);
      // Die Objecte aus dem übergebenen Pfad werden abgerufen
      this.api.getData(path).subscribe((object: any) => {


        var now = new Date();

        for (const t of object) {
          //Die Geodaten wereden zwischengespeichert
          let lon = t.geolocation.longitude;
          let lat = t.geolocation.latitude;

          //Variablen für die nächste Abfrage werden definiert
          let i = 0;
          let id: any[] = [];

          //Das heutige Datum wird abgefragt und in ein eigenes Format gebracht

          var edge = 'black';
          for (const r of res) {

            if (r.object_id === t.ID) {
              var date = new Date(r.timestamp);

              if (date.getUTCFullYear() === now.getUTCFullYear() && date.getUTCMonth() === now.getUTCMonth() && date.getUTCDate() === now.getUTCDate() && date > now) {
                edge = 'red';
                console.log(date);
                break;
              }

            }
          }
          console.log('asd')
          console.log(edge)
          //Definition des Markers
          let circle: any;
          let popUpInfo: any;
          let data: any[] = [];

          if (t.ID == null) {
            circle = L.circleMarker([lat, lon], {
              radius: 10,
            });
            circle.setStyle({
              fillColor: 'green',
              color: edge,
              stroke: false,
              fillOpacity: 0.9,
            });
            this.addCircle(map, circle, popUpInfo, t.ID);
          } else {
            console.log('msg ');
            console.log(t);
            //Die Sensoren des zugehörigen Sensorknotens werden ermittelt
            this.api
              .getData('sensor?ID=' + t.ID)
              .subscribe((sensor_node) => {

                //Die Ids werden in einem Array gespeichert
                id.push(sensor_node.ID);
                console.log(sensor_node);
                //Messwerte zu jedem Sensor werden abgefragt
                this.api
                  .getData(
                    '/latest_measured_value/' + t.ID
                  )
                  .subscribe((measure) => {

                   
                    console.log(measure);
                    console.log(data);
                    //Abfrage ob einer der Sensoren ein humidity-Sensor ist
                    if (sensor_node.messured_variable == 'humidity') {

                      //Ermittlung der Arraylänge und das Auslesen des letzten Wertes
                      //var today = new Date().setHours(0,0,0,0);


                      var today = new Date('2022-09-17').setHours(0, 0, 0, 0);
                      var day = new Date(measure.timestamp).setHours(0, 0, 0, 0);
                     
                      console.log(day);


                      //Sind keine heutigen Daten bekannt, wird der Marker grau hinterlegt. Ansonsten wird der letzte Wert in drei Stufen unterteilt.
                      if (day === today) {
                        this.color = 'grey';
                      } else {
                        if (measure.value >= 90) {
                          this.color = 'green';
                        } else if (measure.value <= 25) {
                          this.color = 'red';
                        } else {
                          this.color = 'orange';
                        }
                      }

                      console.log(t.ID + 'bla')
                      //Die Daten werden dem Marker übergeben
                      circle = L.circleMarker([lat, lon], {
                        radius: 10,
                      });
                      circle.setStyle({
                        fillColor: this.color,
                        color: edge,
                        stroke: true,
                        fillOpacity: 0.5,
                      });
                    } else {
                      //Wenn der Sensor kein humidity-Sensor ist
                      console.log(lat);
                      //Jeder andere Sensor wird gezählt
                      i++;
                      //Wenn kein Sensor aus dem Array ein humidity-Sensor ist, wird das Objekt anders dargestellt.
                      if (i == id.length) {
                        circle = L.circleMarker([lat, lon], {
                          radius: 10,
                        });
                        circle.setStyle({
                          fillColor: 'green',
                          color: edge,
                          stroke: false,
                          fillOpacity: 0.9,
                        });
                      } else {
                        console.log('Noch nicht alle Sensoren durchgegangen');
                      }
                    }
                    //PopUp und Marker werden zu der Map hinzugefügt und mit einem Link hinterlegt
                    popUpInfo = this.popUpService.makeObjectPopup(t);
                    console.log('Fussian mole');
                    this.addCircle(map, circle, popUpInfo, t.ID);
                  });

              });
          }
        }
      });
    })



  }






  addCircle(map: L.Map, circle: any, popUpInfo: any, ID: any) {
    if (circle != undefined) {
      circle
        .addTo(map)
        .bindPopup(popUpInfo)
        .on('popupopen', (a: any) => {
          var popUp = a.target.getPopup();
          console.log(popUp.getElement());
          popUp
            .getElement()
            .querySelector('.open-btn')
            .addEventListener('click', (_e: any) => {
              this.router.navigate(['/tree/' + ID + '/info']);
            });
        });
    }
  }
}*/

import { Injectable } from '@angular/core';
import * as L from 'leaflet';
import { PopUpService } from './popup.service';
import { ApiService } from '../shared/api.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

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
      this.api.getData(path).subscribe((object: any) => {
        let now = new Date();
        // sucht Objekte nach Reservierungen falls reserviert ist der Rand rot sonst schwarz
        for (const t of object) {
          let lon = t.geolocation.longitude;
          let lat = t.geolocation.latitude;

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

                let circle = L.circleMarker([lat, lon], {
                  radius: 10,
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
                this.addCircle(map, circle, popupinfo, t.ID);
              }
            });
        }
      });
    });
  }

  // Erzeugt das Reservierungs Popup Fenster
  addCircle(map: L.Map | L.MarkerClusterGroup, circle: any, popUpInfo: any, ID: any) {
    if (circle !== undefined) {
      circle
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



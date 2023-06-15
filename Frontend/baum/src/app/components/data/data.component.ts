import { DatePipe } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { Chart, ChartConfiguration } from 'chart.js';
import { ConnectableObservable } from 'rxjs';

import { ApiService } from 'src/app/shared/api.service';
import { ChartService } from 'src/app/shared/chart.service';
import { TreeComponent } from '../tree/tree.component';
import { OData } from './dataObject';
import { Measured } from './measured';
import { Sensor } from './sensor';

//Deiniert die Darstellung und Abrufung der Datum-Daten
export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'YYYY-MM-DD', // this is how your date will be parsed from Input
  },
  display: {
    dateInput: 'YYYY-MM-DD', // this is how your date will get displayed on the Input
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
  ],
})
export class DataComponent {
  @ViewChild('chart')
  private Canvas!: ElementRef;
  chart!: Chart;

  sensorNodeID: any = [];
  sensorData: any;
  measured: Measured[] = [];

  d!: FormGroup;
  lineChartData: any;
  lineChartOptions: any;
  pipe: DatePipe;
  edate: number;
  start: any;
  end: any;

    //Initialisierung der BaumID
    treeID: any;

  constructor(private api: ApiService, private tree: TreeComponent, private chartS: ChartService) {
    // this.treeID = this.tree.treeID;

    //bestimmt das heutige Datum und formatiert es in die gebrauchte Form um
    let today = new Date();
    this.pipe = new DatePipe('en-US');
    let echangedDate = this.pipe.transform(today, 'YYYY-MM-dd');
    //bestimmt das Datum vor 7 Tagen und formatiert es in die gebrauchte Form um
    this.edate = today.setDate(today.getDate() - 7);
    let changedDate = this.pipe.transform(this.edate, 'YYYY-MM-dd');

    //schreibt die Daten in die Variablen
    this.d = new FormGroup({
      s: new FormControl(changedDate),
      e: new FormControl(echangedDate),
    });

    //Start und Ende des darzustellenden Bereiches
    this.start = changedDate;
    this.end = echangedDate;
    //ruft die BaumID ab
    
    this.treeID = 1;
    console.log(this.treeID)
    this.getSensorNodeID();
  }

  //wird nach der Zeitauswahl aufgerufen und aktualisiert den Graphen auf die ausgewählte Zeit
  dateRangeChange(
    dateRangeStart: HTMLInputElement,
    dateRangeEnd: HTMLInputElement
  ) {
    this.start = dateRangeStart.value;
    this.end = dateRangeEnd.value;

    if (this.end != '') {
      this.chart.destroy();
      this.getMessured();
    }else{'Warten auf Ende'}
  }

  getSensorNodeID() {
    this.api.getData('located?sensor_ID=' + this.treeID).subscribe((sensor_node) => {
  
        this.sensorNodeID = sensor_node.sensor_id;
      
      this.getSensorID();
    });
  }

  getSensorID() {
   
      //liest die Sensoren des Sensorknoten aus
      console.log(this.sensorNodeID)
      this.api
        .getData('sensor?ID=' + this.sensorNodeID)
        .subscribe((sensor) => {
          console.log(sensor)
          
            //liest die Messwerte der Sensoren aus
            this.sensorData ={
              ID: sensor.id,
              messured_variable: sensor.messured_variable,
            };
          
          
          this.getMessured();
          

        });

    


  }

  getMessured() {
    console.log('und?')
    this.measured = [];

    let z = new Date(this.start);
    let zplus = z.setDate(z.getDate());

    let ze = new Date(this.end);
    let zeplus = ze.setDate(ze.getDate());

    let zze = zeplus + 86400000;
    let zea = this.pipe.transform(zze, 'YYYY-MM-dd');

    let dayDif = (zze - zplus) / 1000 / 60 / 60 / 24;
    let dayCount = 0;

    
      for (
        let i = zplus;
        this.pipe.transform(i, 'YYYY-MM-dd') != zea;
        i = i + 86400000
      ) {
        let zeit = this.pipe.transform(i, 'YYYY-MM-dd');

        //nach datum abfragen und ID

        this.api
          .getData(
            'measured_values?q=' + zeit + '&sensor_ID=' + this.sensorData.ID
          )
          .subscribe((messure) => {
            for (const m of messure) {
              this.measured.push({
                value: m.value,
                timestamp: m.timestamp,
                sensor_ID: m.sensor_ID,
              });

              //fügt dem Array die Werte in abhängigkeit der Zeit ein
            }

            dayCount = dayCount + 1;

            
              this.makeChartObject();
              console.log('hier')
            
          });
      }
      console.log('ende1')
    
    console.log('ende2')
  }

  makeChartObject() {
    let chartObject: OData[] = [];
    for (let c = 0; c < this.sensorData.length; c = c + 1) {
      let array: Array<{ x: any; y: any }> = [];
      for (let d = 0; d < this.measured.length; d = d + 1) {
        let sID = this.measured[d].sensor_ID;

        if (sID == this.sensorData[c].ID) {
          array.push({
            x: this.measured[d].timestamp,
            y: this.measured[d].value,
          });
        }else{console.log('Weitere Sensordaten folgen')}
      }

      chartObject.push({
        data: array,
        label: this.sensorData[c].messured_variable,
        yAxisID: this.sensorData[c].messured_variable,
      });
    }

    //hier Chart erzeugen

    let ch = this.chartS.makeChart(chartObject, this.Canvas.nativeElement);
    this.chart = ch;
  }

 }

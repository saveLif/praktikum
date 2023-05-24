import { Injectable } from '@angular/core';
import { Chart } from 'chart.js';
import 'chartjs-adapter-date-fns';
import zoomPlugin from 'chartjs-plugin-zoom';

@Injectable({
  providedIn: 'root',
})
export class ChartService {
  ch: any;
  constructor() {}

  //Optionen des Linechart
  public lineChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true,
  };

  makeChart(data: any, canvas: any): any {
  //Die Zoomfunktion wird dem Chart hinzugefügt
  Chart.register(zoomPlugin);

    //Die Anzeige der y-Achsen wird auf false vordefiniert
    let huLable = false;
    let liLable = false;
    let teLable = false;

    //Abfrage, welche Datensätze übermittelt wurden. Die enstprechenden y-Achsen werden auf true gesetzt
   for (var i = 0; i < data.length; i++) {
      switch (data[i].yAxisID) {
        case 'humidity':
          huLable = true;
          break;
        case 'light':
          liLable = true;
          break;
        case 'temperature':
          teLable = true;
          break;
        default:
          console.log(
            'Es wurde kein Label mit humidity, light oder temperature gefunden!'
          );
          break;
      }
    }



    //Das Diagramm wird erstellt
    this.ch = new Chart(canvas, {
      type: 'line',
      data: {
        datasets: data,
      },
      options: {
        scales: {
          // Quelle: https://www.chartjs.org/docs/latest/axes/cartesian/time.html
          xAxis: {
            type: 'time',
            ticks: {
              autoSkip: true,
              autoSkipPadding: 50,
              maxRotation: 0
            },
            time: {
              displayFormats: {
                hour: 'dd-MM  HH:mm',
                minute: 'dd-MM HH:mm',
                second: 'dd-MM HH:mm:ss'
              }
            },
            title: {
              display: true,
              text: 'Zeit',
              align: 'end',
            },
          },
          //Die y-Achsen werden definiert
          humidity: {
            display: huLable,
            min:0,
            max:100,
            title: {
              display: huLable,
              text: 'humidity [%]',
              align: 'end',
            },
            position: 'left',
          },
          temperature: {
            display: teLable,
            min:0,
            max:100,
            title: {
              display: teLable,
              text: 'temperature [°C]',
              align: 'end',
            },
            position: 'right',
          },
          light: {
            display: liLable,
            min:0,
            max:100,
            title: {
              display: liLable,
              text: 'light [cd]',
              align: 'end',
            },
            position: 'right',
          },
        },
        //gemeinsame x-Achse
        parsing: {
          xAxisKey: 'x',
        },
        //Zoom-Optionen
        plugins: {
          legend: { display: true },
          zoom: {
            zoom: {
              wheel: {
                enabled: true,
              },
              pinch: {
                enabled: true,
              },
              drag: {
                enabled: true,
              },
              mode: 'x',
            },
          },
        },
      },
    });

    //Das Diagramm wird zurückgegeben
    return this.ch;
  }
}

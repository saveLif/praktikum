import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PopUpService {
  constructor() {}

  //Hier wird der Inhalt des PopUp definiert
  makeObjectPopup(data: any): string {
    return (
      `` +
      `<div>ID: ${data.ID}</div>` +
      `<div>Ort: ${data.description}</div>` +
      `<br/><button class="open-btn"></button>`
    );
  }
}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//import die Seiten
import { HomeComponent } from './components/home/home.component';
import { UserComponent } from './components/user/user.component';
import { FavoritesComponent } from './components/favorites/favorites.component';
import { RegisterComponent } from './components/register/register.component';
import { TreeScienceComponent } from './components/tree-science/tree-science.component';
import { DataComponent } from './components/data/data.component';
import { InfoComponent } from './components/info/info.component';
import { ListComponent } from './components/list/list.component';
import { MapComponent } from './components/map/map.component';
import { PictureComponent } from './components/picture/picture.component';
import { RemarksComponent } from './components/remarks/remarks.component';
import { TreeComponent } from './components/tree/tree.component';
import { MapOneComponent } from './components/map-one/map-one.component';
import { CardComponent } from './components/card/card.component';
import { GreenGameComponent } from './components/green-game/green-game.component';
import { ReservierungComponent } from './components/reservierung/reservierung.component';
import { ReminderComponent } from './components/reminder/reminder.component';
import { StatusComponent } from './components/status/status.component';
import { WeltranglisteComponent } from './components/weltrangliste/weltrangliste.component';
import { SpielwieseComponent } from './components/spielwiese/spielwiese.component';

//Routen angeben
const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'home',
    component: HomeComponent,
    children: [
      { path: 'register', component: RegisterComponent },
      { path: 'favorites', component: FavoritesComponent },
      { path: 'map', component: MapComponent },
      { path: 'list', component: ListComponent },
      { path: 'tree-science', component: TreeScienceComponent },
    ],
  },

  { path: 'user', component: UserComponent },
  { path: 'tree-science', component: TreeScienceComponent },
  { path: 'card/:german_name', component: CardComponent },
  { path: 'tree-science', component: TreeScienceComponent },
  { path: 'list', component: ListComponent },
  { path: 'map', component: MapComponent },
  {
    path: 'tree/:id',
    component: TreeComponent,
    children: [
      {
        path: 'green-game',
        component: GreenGameComponent,
        children: [
          { path: 'spielwiese', component: SpielwieseComponent },
          { path: 'reservierung', component: ReservierungComponent },
          { path: 'reminder', component: ReminderComponent },
          { path: 'status', component: StatusComponent },
          { path: 'weltrangliste', component: WeltranglisteComponent },
    
        ]
      },
    ],
  },

  {
    path: 'green-game',
    component: GreenGameComponent,
    children: [
      { path: 'spielwiese', component: SpielwieseComponent },
      { path: 'reservierung', component: ReservierungComponent },
      { path: 'reminder', component: ReminderComponent },
      { path: 'status', component: StatusComponent },
      { path: 'weltrangliste', component: WeltranglisteComponent },

    ]
  },
];

export const appRouting = RouterModule.forRoot(routes);
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }

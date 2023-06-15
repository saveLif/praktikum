import { NgModule } from '@angular/core';
import{MatTableModule} from '@angular/material/table';
import { BrowserModule } from '@angular/platform-browser';



import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavComponent } from './nav/nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { NgChartsModule } from 'ng2-charts';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { ApiService } from './shared/api.service';
import { MarkerService } from './shared/marker.service';
import { PopUpService } from './shared/popup.service';
import { ChartService } from './shared/chart.service';
import { GpsService } from './shared/gps.service';

import { UserComponent } from './components/user/user.component';
import { HomeComponent } from './components/home/home.component';
import { HeaderComponent } from './components/header/header.component';
import { FavoritesComponent } from './components/favorites/favorites.component';
import { RegisterComponent } from './components/register/register.component';
import { TreeScienceComponent } from './components/tree-science/tree-science.component';
import { TreeComponent } from './components/tree/tree.component';
import { ListComponent } from './components/list/list.component';
import { MapComponent } from './components/map/map.component';
import { InfoComponent } from './components/info/info.component';
import { PictureComponent } from './components/picture/picture.component';
import { DataComponent } from './components/data/data.component';
import { RemarksComponent } from './components/remarks/remarks.component';
import { TreeHeaderComponent } from './components/tree-header/tree-header.component';
import { MapOneComponent } from './components/map-one/map-one.component';
import { CardComponent } from './components/card/card.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { GreenGameComponent } from './components/green-game/green-game.component';
import { ReservierungComponent } from './components/reservierung/reservierung.component';
import { StatusComponent } from './components/status/status.component';
import { WeltranglisteComponent } from './components/weltrangliste/weltrangliste.component';
import { SpielwieseComponent } from './components/spielwiese/spielwiese.component';
import { MaterialModule } from './material/material.module';
import { ReminderComponent } from './components/reminder/reminder.component';
import { LOCALE_ID } from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import {CdkStepperModule} from '@angular/cdk/stepper';
@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    UserComponent,
    HomeComponent,
    HeaderComponent,
    RegisterComponent,
    FavoritesComponent,
    TreeScienceComponent,
    TreeComponent,
    ListComponent,
    MapComponent,
    InfoComponent,
    PictureComponent,
    DataComponent,
    RemarksComponent,
    TreeHeaderComponent,
    MapOneComponent,
    CardComponent,
    GreenGameComponent,
    ReservierungComponent,
    ReminderComponent,
    StatusComponent,
    WeltranglisteComponent,
    SpielwieseComponent,
    ReminderComponent
  ],
  imports: [
    BrowserModule,
    MaterialModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatTabsModule,
    MatButtonToggleModule,
    HttpClientModule,
    MatCardModule,
    LeafletModule,
    NgChartsModule,
    FormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatInputModule,
    ReactiveFormsModule,
    CdkStepperModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerImmediately'
    }),
    NgxChartsModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'de-DE' },
    {provide: MAT_DATE_LOCALE, useValue: 'de-DE'},
    ApiService,
    MarkerService,
    PopUpService,
    ChartService,
    GpsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

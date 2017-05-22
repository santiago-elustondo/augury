import {HashLocationStrategy, Location, LocationStrategy} from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { AuguryWrapperModule } from '../../src/wrapper-module';
import { AuguryWrapper } from '../../src/augury-wrapper';
import { AuguryModule } from '../../src/module';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ParksComponent } from './parks/parks.component';
import { ParkOneComponent } from './park-one/park-one.component';
import { ParkTwoComponent } from './park-two/park-two.component';
import { ParkThreeComponent } from './park-three/park-three.component';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ParksComponent,
    ParkOneComponent,
    ParkTwoComponent,
    ParkThreeComponent
  ],
  imports: [
    AuguryWrapperModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot([
      {
        path: 'home',
        component: HomeComponent
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'parks',
        component: ParksComponent,
        children: [
          {
            path: 'cities',
            loadChildren: './city-module/city.module#CityModule'
          },
          {
            path: 'park1',
            component: ParkOneComponent,
            outlet: 'parkit'
          },
          {
            path: 'park2',
            component: ParkTwoComponent,
            outlet: 'parkit'
          },
          {
            path: 'park3',
            component: ParkThreeComponent,
            outlet: 'parkit'
          }
        ]
      },
      {
        path: 'cities',
        loadChildren: './city-module/city.module#CityModule'
      }
    ])
  ],
  providers: [Location, {provide: LocationStrategy, useClass: HashLocationStrategy}],
  // bootstrap: [AppComponent],
  bootstrap: [AppComponent, AuguryWrapper],
})
export class AppModule { }

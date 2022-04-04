import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import {NgbActiveModal, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {NgbPaginationModule, NgbAlertModule} from '@ng-bootstrap/ng-bootstrap';
import { WatchlistComponent } from './watchlist/watchlist.component';
import { SearchComponent } from './search/search.component';
import { RouterModule } from '@angular/router';
import { PortfolioComponent } from './portfolio/portfolio.component';
import {TickerComponent} from "./search/ticker/ticker.component";

import { HttpClientModule } from '@angular/common/http';

import { HttpModule } from '@angular/http';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import { MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {MatCardModule} from '@angular/material/card';
import { TestComponent } from './search/test/test.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatTabsModule} from '@angular/material/tabs';
import { HighchartsChartModule } from 'highcharts-angular';
import {MatTableModule} from '@angular/material/table';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';


import * as Highcharts from "highcharts";
import * as Highstocks from "highcharts/highstock";
import * as vbp from 'highcharts/indicators/volume-by-price';
import HC_exporting from 'highcharts/modules/exporting';
HC_exporting(Highstocks);
import IndicatorsCore from 'highcharts/indicators/indicators';
IndicatorsCore(Highstocks);
@NgModule({
  declarations: [
    AppComponent,
    WatchlistComponent,
    SearchComponent,
    PortfolioComponent,
    TickerComponent,
    TestComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatTableModule,
    HighchartsChartModule,
    NgbModule,
    FormsModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    MatInputModule,
    MatTabsModule,
    MatCardModule,
    MatFormFieldModule,
    MatButtonModule,
    MatAutocompleteModule,
    NgbPaginationModule,
    NgbAlertModule,
    HttpClientModule,
    RouterModule.forRoot([
      {
        path: 'search',
        component: SearchComponent
      },{
        path: 'search/home',
        component: SearchComponent
      },{
        path: 'search/:ticker',
        component: SearchComponent
      },{
        path: 'watchlist',
        component: WatchlistComponent
      },{
        path: 'portfolio',
        component: PortfolioComponent
      }
    ]),
    BrowserAnimationsModule
  ],
  providers: [NgbActiveModal],
  bootstrap: [AppComponent]
})
export class AppModule {}

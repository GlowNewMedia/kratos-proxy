import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '@angular/material';

import { ServerModule } from './server.module';
import { ClientModule } from './client.module';
import { SharedModule } from './shared.module';

import { AppRoutingModule } from '../routes/app.routes';

import { AppComponent } from '../components/app/app.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    RouterModule,
    MaterialModule,
    BrowserAnimationsModule,
    ServerModule,
    ClientModule,
    SharedModule,

    AppRoutingModule
  ],
  providers: [],
  declarations: [
    AppComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

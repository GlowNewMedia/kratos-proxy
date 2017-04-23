import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { BrowserModule, Title } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CookieService } from 'ng2-cookies';

import { HttpClient } from '../services/http.client';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    HttpModule,
    RouterModule
  ],
  providers: [
    CookieService,
    HttpClient,
    Title
  ],
  declarations: []
})
export class SharedModule { }

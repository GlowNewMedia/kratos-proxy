import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@angular/material';

import { ServerService } from '../services/server.service';

import { ServerListComponent } from '../components/server/server-list/server-list.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule
  ],
  providers: [
    ServerService
  ],
  declarations: [
    ServerListComponent
  ],
  exports: [
    ServerListComponent
  ]
})
export class ServerModule { }
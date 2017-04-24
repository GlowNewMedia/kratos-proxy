import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@angular/material';

import { ClientService } from '../services/client.service';

import { ClientListComponent } from '../components/client/client-list/client-list.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule
  ],
  providers: [
    ClientService
  ],
  declarations: [
    ClientListComponent
  ],
  exports: [
    ClientListComponent
  ]
})
export class ClientModule { }

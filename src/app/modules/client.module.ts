import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ClientService } from '../services/client.service';

import { ClientListComponent } from '../components/client/client-list/client-list.component';
import { ClientAddDialog } from '../components/client/client-add-dialog/client-add-dialog.component';
import { ClientEditDialog } from '../components/client/client-edit-dialog/client-edit-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    ClientService
  ],
  declarations: [
    ClientListComponent,
    ClientAddDialog,
    ClientEditDialog
  ],
  entryComponents: [
    ClientAddDialog,
    ClientEditDialog
  ],
  exports: [
    ClientListComponent
  ]
})
export class ClientModule { }

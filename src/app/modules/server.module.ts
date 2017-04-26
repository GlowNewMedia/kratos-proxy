import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@angular/material';
import { FormsModule } from '@angular/forms';

import { ServerService } from '../services/server.service';

import { ServerListComponent } from '../components/server/server-list/server-list.component';
import { ServerAddDialog } from '../components/server/server-add-dialog/server-add-dialog.component';
import { ServerEditDialog } from '../components/server/server-edit-dialog/server-edit-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule
  ],
  providers: [
    ServerService
  ],
  declarations: [
    ServerListComponent,
    ServerEditDialog,
    ServerAddDialog
  ],
  entryComponents: [
    ServerEditDialog,
    ServerAddDialog
  ],
  exports: [
    ServerListComponent
  ]
})
export class ServerModule { }

import { Component, OnInit, Input } from '@angular/core';
import {MdDialogRef} from '@angular/material';

import { Server } from '../../../../shared/models/server';

@Component({
  selector: 'app-server-edit',
  templateUrl: './server-edit-dialog.component.html',
  styleUrls: ['./server-edit-dialog.component.css']
})
export class ServerEditDialog {
  server: Server;

  constructor(public dialogRef: MdDialogRef<ServerEditDialog>) { }

  save() {
    this.dialogRef.close(this.server);
  }
}

import { Component, OnInit, Input } from '@angular/core';
import {MdDialogRef} from '@angular/material';

import { ServerService } from '../../../services/server.service';

import { Server } from '../../../../shared/models/server';

@Component({
  selector: 'app-server-add',
  templateUrl: './server-add-dialog.component.html',
  styleUrls: ['./server-add-dialog.component.css']
})
export class ServerAddDialog {
  @Input() private server: Server;

  constructor(public dialogRef: MdDialogRef<ServerAddDialog>) { }
}

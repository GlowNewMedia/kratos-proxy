import { Component, OnInit, Input } from '@angular/core';
import { MdDialogRef } from '@angular/material';

import { ClientService } from '../../../services/client.service';

import { Client } from '../../../../shared/models/client';

@Component({
  selector: 'app-client-add',
  templateUrl: './client-add-dialog.component.html',
  styleUrls: ['./client-add-dialog.component.css']
})
export class ClientAddDialog {
  @Input() private client: Client;

  constructor(public dialogRef: MdDialogRef<ClientAddDialog>) { }
}

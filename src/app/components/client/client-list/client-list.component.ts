import { Component, OnInit } from '@angular/core';
import { MdSnackBar, MdDialog } from '@angular/material';
import * as _ from 'underscore';

import { ClientEditDialog } from '../client-edit-dialog/client-edit-dialog.component';

import { ClientService } from '../../../services/client.service';
import { ServerService } from '../../../services/server.service';

import { Client } from '../../../../shared/models/client';

@Component({
    selector: 'client-client-list',
    templateUrl: './client-list.component.html',
    styleUrls: ['./client-list.component.css']
})
export class ClientListComponent implements OnInit {
    loading = true;

    constructor(private clientService: ClientService, private serverService: ServerService, 
    private snackBar: MdSnackBar, private dialog: MdDialog) { }

    async ngOnInit() {
      this.loading = false;
    }

    async delete(client: Client) {
      const deleted = await this.clientService.deleteClient(client);
      if (deleted) {
          const snackbar = this.snackBar.open(client.name + ' deleted', 'Undo', { duration: 5000 });
          snackbar.onAction().subscribe(async () => {
              await this.clientService.addClient(client);
          });
      }
    }

    edit(client: Client) {
      const dialogRef = this.dialog.open(ClientEditDialog);
      dialogRef.componentInstance.client = client;
      dialogRef.componentInstance.servers = this.serverService.servers;
      dialogRef.afterClosed().subscribe(async result => {
        if (result != null) {
          const remoteClient = await this.clientService.editClient(result);

          this.snackBar.open(remoteClient.name + ' updated', 'Dismiss', { duration: 5000 });
        }
      });
    }
}

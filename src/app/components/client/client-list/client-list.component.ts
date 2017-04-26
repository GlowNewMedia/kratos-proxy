import { Component, OnInit } from '@angular/core';
import { MdSnackBar, MdDialog } from '@angular/material';
import * as _ from 'underscore';

import { ClientEditDialog } from '../client-edit-dialog/client-edit-dialog.component';

import { ClientService } from '../../../services/client.service';

import { Client } from '../../../../shared/models/client';

@Component({
    selector: 'client-client-list',
    templateUrl: './client-list.component.html',
    styleUrls: ['./client-list.component.css']
})
export class ClientListComponent implements OnInit {
    loading = true;
    clients: Client[] = [];

    constructor(private clientService: ClientService, private snackBar: MdSnackBar, private dialog: MdDialog) { }

    async ngOnInit() {
      this.clients = await this.clientService.getClients();
      this.loading = false;
    }

    async delete(client: Client) {
      const deleted = await this.clientService.deleteClient(client);
      if (deleted) {
        const index = _.findIndex(this.clients, (listClient) => { return listClient.id === client.id; });
        if (index !== -1) {
          this.clients.splice(index, 1);

          const snackbar = this.snackBar.open(client.name + ' deleted', 'Undo', { duration: 5000 });
          snackbar.onAction().subscribe(async () => {
            this.clientService.addClient(client).then((server) => {
              this.clients.push(server);
            });
          });
        }
      }
    }

  edit(client: Client) {
    const dialogRef = this.dialog.open(ClientEditDialog);
    dialogRef.componentInstance.client = client;
    dialogRef.afterClosed().subscribe(async result => {
      if (result != null) {
        const remoteClient = await this.clientService.editClient(result);
        const index = _.findIndex(this.clients, (listClient) => { return listClient.id === remoteClient.id; });
        if (index !== -1) {
          this.clients[index] = remoteClient;
          this.snackBar.open(client.name + ' updated', 'Dismiss', { duration: 5000 });
        }
      }
    });
  }
}

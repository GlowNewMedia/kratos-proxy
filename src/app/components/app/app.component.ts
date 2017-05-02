import { Component, OnInit } from '@angular/core';
import { MdDialog, MdSnackBar } from '@angular/material';
import * as _ from 'underscore';

import { ClientEditDialog } from '../client/client-edit-dialog/client-edit-dialog.component';
import { ServerEditDialog } from '../server/server-edit-dialog/server-edit-dialog.component';

import { ClientService } from '../../services/client.service';
import { ServerService } from '../../services/server.service';

import { Client } from '../../../shared/models/client';
import { Server } from '../../../shared/models/server';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Kratos Proxy';
  clients: Client[];

  /**
   *
   */
  constructor(private clientService: ClientService, private serverService: ServerService,
  private dialog: MdDialog, private snackBar: MdSnackBar) {}

  async ngOnInit() {
      await this.serverService.ensureIntialised();
      await this.clientService.ensureIntialised();
  }

  addClient() {
    const dialogRef = this.dialog.open(ClientEditDialog);
    dialogRef.componentInstance.client = new Client();
    dialogRef.componentInstance.servers = this.serverService.servers;
    dialogRef.afterClosed().subscribe(async (result: Client) => {
      if (result != null) {
        const remoteClient = await this.clientService.addClient(result);

        const snackbar = this.snackBar.open(remoteClient.name + ' added', 'Dismiss', { duration: 5000 });
      }
    });
  }

  addServer() {
    const dialogRef = this.dialog.open(ServerEditDialog);
    dialogRef.componentInstance.server = new Server();
    dialogRef.afterClosed().subscribe(async (result: Server) => {
      if (result != null) {
        const remoteServer = await this.serverService.addServer(result);

        const snackbar = this.snackBar.open(remoteServer.name + ' added', 'Dismiss', { duration: 5000 });
      }
    });
  }
}

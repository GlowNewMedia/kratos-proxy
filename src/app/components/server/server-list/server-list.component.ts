import { Component, OnInit } from '@angular/core';
import { MdSnackBar, MdDialog } from '@angular/material';
import * as _ from 'underscore';

import { ServerEditDialog } from '../server-edit-dialog/server-edit-dialog.component';

import { ServerService } from '../../../services/server.service';

import { Server } from '../../../../shared/models/server';
import { Availability } from '../../../../shared/models/availability';

@Component({
  selector: 'app-server-list',
  templateUrl: './server-list.component.html',
  styleUrls: ['./server-list.component.css']
})
export class ServerListComponent implements OnInit {
  loading = true;
  // serverStatus: { id: string, available: Availability }[] = [];

  constructor(private serverService: ServerService, private snackBar: MdSnackBar, private dialog: MdDialog) { }

  async ngOnInit() {
    await this.serverService.ensureIntialised();

    this.loading = false;
  }

  async delete(server: Server) {
    const deleted = await this.serverService.deleteServer(server);
    if (deleted) {
      const snackbar = this.snackBar.open(server.name + ' deleted', 'Undo', { duration: 5000 });
      snackbar.onAction().subscribe(async () => {
        await this.serverService.addServer(server);
      });
    }
  }

  edit(server: Server) {
    const dialogRef = this.dialog.open(ServerEditDialog);
    dialogRef.componentInstance.server = server;
    dialogRef.afterClosed().subscribe(async result => {
      if (result != null) {
        const remoteServer = await this.serverService.editServer(result);

        const snackbar = this.snackBar.open(server.name + ' updated', 'Dismiss', { duration: 5000 });
      }
    });
  }
}

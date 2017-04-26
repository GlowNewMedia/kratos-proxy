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
  servers: Server[] = [];
  // serverStatus: { id: string, available: Availability }[] = [];

  constructor(private serverService: ServerService, private snackBar: MdSnackBar, private dialog: MdDialog) { }

  async ngOnInit() {
    this.servers = await this.serverService.getServers();
    // for (const server of this.servers){
    //   const available = await this.serverService.isOnline(server.id);
    //   this.serverStatus.push({ id: server.id, available: available});
    // }

    this.loading = false;
  }

  async delete(server: Server) {
    const deleted = await this.serverService.deleteServer(server);
    if (deleted) {
      const index = _.findIndex(this.servers, (listServer) => { return listServer.id === server.id; });
      if (index !== -1) {
        this.servers.splice(index, 1);

        const snackbar = this.snackBar.open(server.name + ' deleted', 'Undo', { duration: 5000 });
        snackbar.onAction().subscribe(async () => {
          this.serverService.addServer(server).then((newServer) => {
            this.servers.push(newServer);
          });
        });
      }
    }
  }

  edit(server: Server) {
    const dialogRef = this.dialog.open(ServerEditDialog);
    dialogRef.componentInstance.server = server;
    dialogRef.afterClosed().subscribe(async result => {
      if (result != null) {
        const remoteServer = await this.serverService.editServer(result);
        const index = _.findIndex(this.servers, (listServer) => { return listServer.id === remoteServer.id; });
        if (index !== -1) {
          this.servers[index] = remoteServer;
          const snackbar = this.snackBar.open(server.name + ' updated', 'Dismiss', { duration: 5000 });
        }
      }
    });
  }

  // async getServerStatus(server: Server) {
  //   const status = _.findWhere(this.serverStatus, { id: server.id });
  //   if (status == null) {
  //     return 'No Result!';
  //   } else {
  //     return status.available.available ?
  //     'Online at ' + status.available.date.toString()
  //     : 'Offline at ' + status.available.date.toString();
  //   }
  // }
}

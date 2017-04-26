import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MdDialogRef } from '@angular/material';
import 'rxjs/add/operator/startWith';
import * as _ from 'underscore';

import { ServerService } from '../../../services/server.service';

import { Client } from '../../../../shared/models/client';
import { Server } from '../../../../shared/models/server';

@Component({
  selector: 'app-client-edit',
  templateUrl: './client-edit-dialog.component.html',
  styleUrls: ['./client-edit-dialog.component.css']
})
export class ClientEditDialog implements OnInit {
  client: Client;
  serverCtrl: FormControl;
  servers: Server[];
  filteredServers: any;

  constructor(public dialogRef: MdDialogRef<ClientEditDialog>, public serverService: ServerService) {
    this.serverCtrl = new FormControl();
    this.filteredServers = this.serverCtrl.valueChanges
        .startWith(null)
        .map(name => this.filterServers(name));
   }

  async ngOnInit() {
    this.servers = await this.serverService.getServers();

    const server = _.findWhere(this.servers, { id: this.client.serverId });
    if (server != null) {
      this.serverCtrl.setValue(server.name);
    } else {
      this.serverCtrl.setValue('');
    }
  }

  save() {
    const server = _.findWhere(this.servers, { name: this.serverCtrl.value });
    if (server != null) {
      this.client.serverId = server.id;
    } else {
      this.client.serverId = '';
    }

    this.dialogRef.close(this.client);
  }

  filterServers(val: string) {
    return val ? this.servers.filter(s => new RegExp(`^${val}`, 'gi').test(s.name))
               : this.servers;
  }
}

import { Component, OnInit } from '@angular/core';
import { ServerService } from '../../../services/server.service';

import { Server } from '../../../../shared/models/server';

@Component({
  selector: 'server-server-list',
  templateUrl: './server-list.component.html',
  styleUrls: ['./server-list.component.css']
})
export class ServerListComponent implements OnInit {
  color = "primary";
  mode = "indeterminate";
  loading = true;
  servers: Server[] = [];

  constructor(private serverService: ServerService) { }

  async ngOnInit() {
    this.servers = await this.serverService.getServers();
    this.loading = false;
  }
}
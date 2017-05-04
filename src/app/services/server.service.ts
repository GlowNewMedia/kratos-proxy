import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from './http.client';
import * as _ from 'underscore';

import { Server } from '../../shared/models/server';
import { Availability } from '../../shared/models/availability';

@Injectable()
export class ServerService implements OnInit {
    public servers: Server[];

    /**
     *
     */
    constructor(private http: HttpClient) { }

    async ngOnInit() {
        this.servers = await this.getServers();
    }

    public async ensureIntialised() {
        if (this.servers == null) {
            this.servers = await this.getServers();
        }

        return;
    }

    private getServers(): Promise<Server[]> {
        return this.http.get<Server[]>('/api/servers');
    }

    public async addServer(server: Server): Promise<Server> {
        const remoteServer = await this.http.post<Server>('/api/servers/add', server);
        this.servers.push(remoteServer);

        return remoteServer;
    }

    public async editServer(server: Server): Promise<Server> {
        const remoteServer = await this.http.post<Server>('/api/servers/edit', server);
        const index = _.findIndex(this.servers, (listServer) => { return listServer.id === remoteServer.id; });
        if (index !== -1) {
          this.servers[index] = remoteServer;
        }

        return remoteServer;
    }

    public async deleteServer(server: Server): Promise<boolean> {
        const deleted = await this.http.post<boolean>('/api/servers/remove', server);
        const index = _.findIndex(this.servers, (listServer) => { return listServer.id === server.id; });
        if (index !== -1 && deleted) {
          this.servers.splice(index, 1);

          return true;
        }

        return false;
    }

    public isOnline(id: string): Promise<Availability> {
        return this.http.get<Availability>('/api/servers/online/' + id);
    }
}

import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from './http.client';
import * as _ from 'underscore';

import { Client } from '../../shared/models/client';

@Injectable()
export class ClientService implements OnInit {
    public clients: Client[];

    /**
     *
     */
    constructor(private http: HttpClient) { }

    async ngOnInit() {
        this.clients = await this.getClients();
    }

    public async ensureIntialised() {
        if (this.clients == null) {
            this.clients = await this.getClients();
        }

        return;
    }

    private getClients(): Promise<Client[]> {
        return this.http.get<Client[]>('/api/clients');
    }

    public async addClient(client: Client): Promise<Client> {
        const remoteClient = await this.http.post<Client>('/api/clients/add', client);
        this.clients.push(remoteClient);

        return remoteClient;
    }

    public async editClient(client: Client): Promise<Client> {
        const remoteClient = await this.http.post<Client>('/api/clients/edit', client);
        const index = _.findIndex(this.clients, (listClient) => { return listClient.id === remoteClient.id; });
        if (index !== -1) {
          this.clients[index] = remoteClient;
        }

        return remoteClient;
    }

    public async deleteClient(client: Client): Promise<boolean> {
        const deleted = this.http.post<boolean>('/api/clients/remove', client);
        const index = _.findIndex(this.clients, (listClient) => { return listClient.id === client.id; });
        if (index !== -1 && deleted) {
          this.clients.splice(index, 1);

          return true;
        }

        return false;
    }
}

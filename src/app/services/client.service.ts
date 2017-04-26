import { Injectable } from '@angular/core';
import { HttpClient } from './http.client';

import { Client } from '../../shared/models/client';

@Injectable()
export class ClientService {
    /**
     *
     */
    constructor(private http: HttpClient) { }

    public getClients(): Promise<Client[]> {
        return this.http.get<Client[]>('/api/clients');
    }

    public addClient(client: Client): Promise<Client> {
        return this.http.post<Client>('/api/clients/add', client);
    }

    public editClient(client: Client): Promise<Client> {
        return this.http.post<Client>('/api/clients/edit', client);
    }

    public deleteClient(client: Client): Promise<boolean> {
        return this.http.post<boolean>('/api/clients/remove', client);
    }
}

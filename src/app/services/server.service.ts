import { Injectable } from '@angular/core';
import { HttpClient } from './http.client';

import { Server } from '../../shared/models/server';
import { Availability } from '../../shared/models/availability';

@Injectable()
export class ServerService {
    /**
     *
     */
    constructor(private http: HttpClient) { }

    public getServers(): Promise<Server[]> {
        return this.http.get<Server[]>('/api/servers');
    }

    public addServer(server: Server): Promise<Server> {
        return this.http.post<Server>('/api/servers/add', server);
    }

    public editServer(server: Server): Promise<Server> {
        return this.http.post<Server>('/api/servers/edit', server);
    }

    public deleteServer(server: Server): Promise<boolean> {
        return this.http.post<boolean>('/api/servers/remove', server);
    }

    public isOnline(id: string): Promise<Availability> {
        return this.http.get<Availability>('/api/servers/online/' + id);
    }
}

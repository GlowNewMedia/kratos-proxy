import { Injectable } from '@angular/core';
import { HttpClient } from './http.client';

import { Server } from '../models/server';

@Injectable()
export class ServerService {
    /**
     *
     */
    constructor(private http: HttpClient) {
        
    }

    public getServers(): Promise<Server[]> {
        return this.http.get<Server[]>('/api/servers');
    }
}
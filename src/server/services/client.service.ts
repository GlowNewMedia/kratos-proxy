import { ConfigService } from './config.service';

import { Client } from '../../shared/models/client';

import * as _ from 'underscore';

export class ClientService {
    private configService: ConfigService<Client[]>;

    /**
     *
     */
    constructor() {
        this.configService = new ConfigService<Client[]>("../config/client.config");
    }

    public async addClient(client: Client): Promise<Client> {
        throw "Not Implemented";
    }

    public async removeClient(client: Client): Promise<boolean> {
        throw "Not Implemented";
    }

    public async editClient(client: Client): Promise<Client> {
        throw "Not Implemented";
    }

    /**
     * getResponsibleServer
     */
    public async getResponsibleServerId(ip: string): Promise<string> {
        console.log("[ClientService::getResponsibleServerId] Finding server id responsible for that ip");
        
        return "";
    }
}
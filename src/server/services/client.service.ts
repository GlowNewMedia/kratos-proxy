import { ConfigService } from './config.service';

import { Client } from '../../shared/models/client';

import * as _ from 'underscore';
import * as uuidV4 from 'uuid/v4';

export class ClientService {
    private configService: ConfigService<Client[]>;

    /**
     *
     */
    constructor() {
        this.configService = new ConfigService<Client[]>("./config/client.json");
    }

    /**
     * Gets the list of clients
     */
    public async getClients(): Promise<Client[]> {
        console.log("[ClientService::getClients] Getting list of clients");

        return await this.configService.getConfig();
    }

    /**
     * Gets the client by id
     * @param id 
     */
    public async getClient(id: string): Promise<Client> {
        let clients = await this.getClients();

        return _.findWhere(clients, { id: id });
    }

    /**
     * Adds a client
     * @param client 
     */
    public async addClient(client: Client): Promise<Client> {
        let clients = await this.getClients();

        if(client == null) {
            throw "Client can not be null";
        }

        client.id = uuidV4();

        clients.push(client);

        await this.configService.saveConfig(clients);

        return client;
    }

    /**
     * Removes a client
     * @param client 
     */
    public async removeClient(client: Client): Promise<boolean> {
        let clients = await this.getClients();
        let index = _.findIndex(clients, { id: client.id });

        if(index == -1){
            throw "Client not found";
        }

        clients.splice(index, 1);

        await this.configService.saveConfig(clients);

        return true;
    }

    /**
     * Edits a client
     * @param client 
     */
    public async editClient(client: Client): Promise<Client> {
        let clients = await this.getClients();
        let index = _.findIndex(clients, { id: client.id });

        if(index == -1){
            throw "Client not found";
        }

        clients[index] = client;

        await this.configService.saveConfig(clients);

        return client;
    }

    /**
     * Gets the server id from the ip
     * @param ip
     */
    public async getResponsibleServerId(ip: string): Promise<string> {
        console.log("[ClientService::getResponsibleServerId] Finding server id responsible for that ip");
        
        let clients = await this.getClients();

        let client = _.findWhere(clients, { ip: ip });

        if (client == null) {
            return "";
        }
        else {
            return client.serverId;
        }
    }
}
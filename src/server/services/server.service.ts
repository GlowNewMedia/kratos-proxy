import { ConfigService } from './config.service';

import { Server } from '../../shared/models/server';
import { AvailabilityResult } from '../models/availabilityResult';

import * as net from 'net';
import * as _ from 'underscore';
import * as uuidV4 from 'uuid/v4';

export class ServerService {
    public static availableServerCache: AvailabilityResult[];
    private configService: ConfigService<Server[]>;

    /**
     *
     */
    constructor() {
        this.configService = new ConfigService<Server[]>("./config/server.json");
    }

    /**
     * getServers
     */
    public async getServers(): Promise<Server[]> {
        console.log("[ServerService::getServers] Getting list of servers.");
        
        return await this.configService.getConfig();
    }

    /**
     * getServerById
     */
    public async getServerById(id: string): Promise<Server> {
        let servers = await this.getServers();

        return _.findWhere(servers, { id: id});
    }

    /**
     * Adds a client
     * @param client 
     */
    public async addServer(server: Server): Promise<Server> {
        let servers = await this.getServers();

        if(servers == null) {
            throw "Client can not be null";
        }

        server.id = uuidV4();

        servers.push(server);

        await this.configService.saveConfig(servers);

        return server;
    }

    /**
     * Removes a server
     * @param server
     */
    public async removeServer(server: Server): Promise<boolean> {
        let servers = await this.getServers();
        let index = _.findIndex(servers, { id: server.id });

        if(index == -1){
            throw "Server not found";
        }

        servers.splice(index, 1);

        await this.configService.saveConfig(servers);

        return true;
    }

    /**
     * Edits a server
     * @param server 
     */
    public async editServer(server: Server): Promise<Server> {
        let servers = await this.getServers();
        let index = _.findIndex(servers, { id: server.id });

        if(index == -1){
            throw "Server not found";
        }

        servers[index] = server;

        await this.configService.saveConfig(servers);

        return server;
    }

    /**
     * Checks if a server is available
     * @param server 
     * @returns available
     */
    public async checkAvailable(server: Server): Promise<boolean> {
        if(ServerService.availableServerCache == null) {
            console.log("[ServerService::checkAvailable] Cache not initialised");
            ServerService.availableServerCache = [];
        }
        let index = _.findIndex(ServerService.availableServerCache, (item) => { return item.serverId == server.id; });

        if(index > -1) {
            let item = ServerService.availableServerCache[index];
            if(item.date.getTime() >= new Date().getTime()) {
                console.log("[ServerService::checkAvailable] Server in cache");
                return item.available;
            }
            else{
                console.log("[ServerService::checkAvailable] Server outdated in cache");
                item.available = await this.pingServer(server);
                item.date = new Date(new Date().getTime() + 120000);
                item.serverId = server.id;

                ServerService.availableServerCache[index] = item;

                return item.available;
            }
        }
        else{
            console.log("[ServerService::checkAvailable] Server not in cache");

            let item = new AvailabilityResult();
            item.serverId = server.id;
            item.available = await this.pingServer(server);
            item.date = new Date(new Date().getTime() + 120000);

            ServerService.availableServerCache.push(item);

            return item.available;
        }
    }

    private async pingServer(server: Server): Promise<boolean> {
        console.log("[ServerService::pingServer] Testing server availability for: ", server);
        return new Promise<boolean>((resolve, reject) => {
                net.createConnection(server.port, server.ip).on("connect", function(e) {
                    console.log("[ServerService::pingServer] Successful connection to server");
                    resolve(true);
                }).on("error", function(e) {
                    console.log("[ServerService::pingServer] Unable to connect to server: ", e.message);
                    resolve(false);
                });
            });
    }
}
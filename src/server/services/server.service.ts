import { ConfigService } from './config.service';

import { Server } from '../../shared/models/server';
import { AvailabilityResult } from '../models/availabilityResult';

import * as _ from 'underscore';

const filename = "../config/server.config";

export class ServerService {
    private static availableServerCache: AvailabilityResult[] = [];
    private configService: ConfigService<Server[]>;

    /**
     *
     */
    constructor() {
        this.configService = new ConfigService<Server[]>(filename);
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
     * Checks if a server is available
     * @param server 
     * @returns available
     */
    public async checkAvailable(server: Server): Promise<boolean> {
        return Promise.resolve(false);
    }
}
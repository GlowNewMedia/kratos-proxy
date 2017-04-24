import { Server } from '../../shared/models/server';

export class ServerService {
    /**
     *
     */
    constructor() {
        
    }

    public getServers(): Server[] {
        console.log("[ServerService::getServers] Getting list of servers.");
        let temp = new Server();
        temp.id = "00000-0000000-00000000-000000";
        temp.name = "Pluto";
        temp.ip = "192.168.1.142";
        temp.port = 8888;
        temp.clients = [];

        let temp2 = new Server();
        temp2.id = "00000-0000000-00000000-000000";
        temp2.name = "The Moon";
        temp2.ip = "192.168.1.10";
        temp2.port = 8888;
        temp2.clients = [];

        return [temp, temp2];
    }
}
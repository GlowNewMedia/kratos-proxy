import { ClientService } from './client.service';
import { ServerService } from './server.service';

import * as http from 'http';
import * as _ from 'underscore';
import httpProxy = require('http-proxy');

export class ProxyService {
    private clientService: ClientService;
    private serverService: ServerService;
    private proxy: any;
    private server: http.Server;
    private port: number;
    

    /**
     *
     */
    constructor() {
        this.clientService = new ClientService();
        this.serverService = new ServerService();
    }

    /**
     * setupProxy
     */
    public setupProxy(port: number) {
        console.log("[ProxyService::setupProxy] Setup proxy on port: " + port);

        this.port = port;

        this.proxy = httpProxy.createServer();

        this.server = http.createServer(async (req, res) => { await this.onRequest(req, res) });

        this.server.listen(this.port);

        this.server.on('error', this.httpListenError);

        this.server.on('listening', () => { console.log("[ProxyService::setupProxy] Now listening on port: " + this.port); })
    }

    /**
     * Handles a server listen error
     * @param error 
     */
    public httpListenError(error: any) {
        if (error.syscall !== "listen") {
            throw error;
        }

        let bind = "Port " + this.port;

        // handle specific listen errors with friendly messages
        switch (error.code) {
            case "EACCES":
                console.error(bind + " requires elevated privileges");
                process.exit(1);
            break;
            case "EADDRINUSE":
                console.error(bind + " is already in use");
                process.exit(1);
            break;
            default:
                throw error;
        }
    }

    /**
     * Handles a proxy request
     * @param req 
     * @param res 
     */
    public async onRequest(req: http.IncomingMessage, res: http.ServerResponse) {
        console.log("[ProxyService::onRequest] New Request");
    
        let target = await this.getProxy(req, res);

        if(target == null){
            this.proxy.web(req, res);
        }
        else{
            this.proxy.web(req, res, {
                target: target, toProxy: true
            });
        }
    }

    /**
     * Gets the proxy for that request
     * @param req
     * @param res
     * @returns target
     */
    public async getProxy(req: http.IncomingMessage, res: http.ServerResponse): Promise<{ host: string, port: number }> {
        console.log("[ProxyService::getProxy] Finding the proxy for that request");

        let ip = this.getIpFromRequest(req);

        let serverId = await this.clientService.getResponsibleServerId(ip);

        let server = await this.serverService.getServerById(serverId);

        let serverAvailable = await this.serverService.checkAvailable(server);

        if(serverAvailable){
            return { host: server.ip, port: server.port };
        }
        else{
            return null;
        }
    }

    /**
     * Gets the ip from the incoming request
     * @param req
     * @return ip
     */
    public getIpFromRequest(req: http.IncomingMessage): string {
        console.log("[ProxyService::getIpFromRequest] Finding ip from the request");

        return "127.0.0.1";
    }
}
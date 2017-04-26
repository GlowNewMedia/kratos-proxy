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
     * Setup the proxy
     */
    public setupProxy(port: number) {
        console.log('[ProxyService::setupProxy] Setup proxy on port: ' + port);

        this.port = port;

        this.proxy = httpProxy.createServer();

        this.proxy.on('error', async (error, req, res) => { this.proxyError(error, req, res); });

        this.server = http.createServer(async (req, res) => { await this.onRequest(req, res); });

        this.server.listen(this.port);

        this.server.on('error', this.httpListenError);

        this.server.on('listening', () => { console.log('[ProxyService::setupProxy] Now listening on port: ' + this.port); });
    }

    /**
     * Handles a server listen error
     * @param error
     */
    public httpListenError(error: any) {
        if (error.syscall !== 'listen') {
            throw error;
        }

        const bind = 'Port ' + this.port;

        // handle specific listen errors with friendly messages
        switch (error.code) {
            case 'EACCES':
                throw new Error(bind + ' requires elevated privileges');
            case 'EADDRINUSE':
                throw new Error(bind + ' is already in use');
            default:
                throw error;
        }
    }

    /**
     * Handles a proxy error
     * @param error
     */
    public async proxyError(error: any, req: http.IncomingMessage, res: http.ServerResponse) {
        console.log('[ProxyService::onRequest] Request failed.');

        if (res.getHeader('X-Proxied') === 'false') {
            console.log('[ProxyService::onRequest] Non proxied request failed. Sending error message.');
            res.writeHead(500, {
                'Content-Type': 'text/plain'
            });

            switch (error.code) {
                case 'ECONNREFUSED':
                    res.end('Unable to connect. ECONNREFUSED');
                    break;
                default:
                    res.end('Something went wrong. Error is: ' + JSON.stringify(error));
                    break;
            }
        } else {
            console.log('[ProxyService::onRequest] Sending non proxied request.');
            res.setHeader('X-Proxied', 'false');
            this.proxy.web(req, res, {
                target: { host: req.headers.host, port: 80 }
            });
        }
    }

    /**
     * Handles a proxy request
     * @param req
     * @param res
     */
    public async onRequest(req: http.IncomingMessage, res: http.ServerResponse) {
        console.log('[ProxyService::onRequest] New Request');
        // tslint:disable-next-line:no-console
        console.time('[ProxyService::onRequest] Request Took');

        const target = await this.getProxy(req, res);

        if (target == null) {
            res.setHeader('X-Proxied', 'false');
            this.proxy.web(req, res, {
                target: { host: req.headers.host, port: 80 }
            });
        } else {
            res.setHeader('X-Proxied', 'true');
            this.proxy.web(req, res, {
                target: target, toProxy: true
            });
        }

        // tslint:disable-next-line:no-console
        console.timeEnd('[ProxyService::onRequest] Request Took');
    }

    /**
     * Gets the proxy for that request
     * @param req
     * @param res
     * @returns target
     */
    public async getProxy(req: http.IncomingMessage, res: http.ServerResponse): Promise<{ host: string, port: number }> {
        console.log('[ProxyService::getProxy] Finding the proxy for that request');

        const ip = this.getIpFromRequest(req);

        const serverId = await this.clientService.getResponsibleServerId(ip);

        if (serverId.trim() === '') {
            console.warn('[ProxyService::getProxy] No client found for ip: ', ip);
            return null;
        } else {
            const server = await this.serverService.getServerById(serverId);

            const serverAvailable = await this.serverService.checkAvailable(server);

            if (serverAvailable) {
                console.log('[ProxyService::getProxy] Proxy server available');
                return { host: server.ip, port: server.port };
            } else {
                console.log('[ProxyService::getProxy] Proxy server unavailable');
                return null;
            }
        }
    }

    /**
     * Gets the ip from the incoming request
     * @param req
     * @return ip
     */
    public getIpFromRequest(req: http.IncomingMessage): string {
        console.log('[ProxyService::getIpFromRequest] Finding ip from the request');

        let ip = req.connection.remoteAddress;

        if (ip.includes('::ffff:')) {
            ip = ip.slice(7);
        }

        return ip;
    }
}

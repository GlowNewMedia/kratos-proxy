import { Router, Request, Response } from 'express';

import { BaseRoute, Method } from './base';

import { ServerService } from '../../services/server.service';

export class ServerRoute extends BaseRoute {
    private serverService: ServerService;
    
    /**
     *  Setup the route
     */
    constructor() {
        super();
        this.serverService = new ServerService();
        this.section = "servers";
    }

    /**
     * Set the routes
     */
    create() {
        console.log("[ServerRoute::create] Creating server routes.");

        this.registerRoute('/', Method.GET, (req, res) => { new ServerRoute().get(req, res); });

        this.registerRoute('/add', Method.POST, (req, res) => { new ServerRoute().add(req, res); });

        this.registerRoute('/edit', Method.POST, (req, res) => { new ServerRoute().edit(req, res); });

        this.registerRoute('/remove', Method.POST, (req, res) => { new ServerRoute().remove(req, res); });

        this.registerRoute('/online/:id', Method.GET, (req, res) => { new ServerRoute().isOnline(req, res); });
    }

    /**
     * Gets all the servers
     * @param req 
     * @param res 
     */
    public async get(req: Request, res: Response) {
        let servers = await this.serverService.getServers();

        this.render(req, res, servers);
    }

    /**
     * add
     * @param req
     * @param res
     */
    public async add(req: Request, res: Response) {
        let server = await this.serverService.addServer(req.body);

        return server;
    }

    /**
     * edit
     * @param req
     * @param res
     */
    public async edit(req: Request, res: Response) {
        let server = await this.serverService.editServer(req.body);

        return server;
    }

    /**
     * 
     * @param req 
     * @param res 
     */
    public async remove(req: Request, res: Response) {
        let success = await this.serverService.removeServer(req.body);

        return success;
    }

    /**
     * Checks if the server is online
     * @param req 
     * @param res 
     */
    public isOnline(req: Request, res: Response) {
        this.render(req, res, {});
    }
}
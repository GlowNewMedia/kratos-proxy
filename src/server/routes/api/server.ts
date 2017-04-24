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

        this.registerRoute('/online/:id', Method.GET, (req, res) => { new ServerRoute().isOnline(req, res); });
    }

    /**
     * Gets all the servers
     * @param req 
     * @param res 
     */
    public get(req: Request, res: Response) {
        this.render(req, res, this.serverService.getServers());
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
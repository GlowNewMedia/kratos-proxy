import { Router, Request, Response } from 'express';

import { BaseRoute, Method } from './base';

import { ClientService } from '../../services/client.service';

export class ClientRoute extends BaseRoute {
    private clientService: ClientService;
    
    /**
     * Setup the route
     */
    constructor() {
        super();
        this.clientService = new ClientService();
        this.section = "clients";
    }

    create() {
        console.log("[ClientRoute::create] Creating client routes.");

        this.registerRoute('/', Method.GET, (req, res) => { new ClientRoute().get(req, res); });
    }

    public get(req: Request, res: Response) {
        this.render(req, res, []);
    }
}
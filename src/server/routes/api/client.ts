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

        this.registerRoute('/add', Method.POST, (req, res) => { new ClientRoute().add(req, res); });

        this.registerRoute('/edit', Method.POST, (req, res) => { new ClientRoute().edit(req, res); });

        this.registerRoute('/remove', Method.POST, (req, res) => { new ClientRoute().remove(req, res); });
    }

    public get(req: Request, res: Response) {
        this.render(req, res, this.clientService.getClients());
    }

    /**
     * add
     * @param req
     * @param res
     */
    public async add(req: Request, res: Response) {
        let client = await this.clientService.addClient(req.body);

        return client;
    }

    /**
     * edit
     * @param req
     * @param res
     */
    public async edit(req: Request, res: Response) {
        let client = await this.clientService.editClient(req.body);

        return client;
    }

    /**
     * 
     * @param req 
     * @param res 
     */
    public async remove(req: Request, res: Response) {
        let success = await this.clientService.removeClient(req.body);

        return success;
    }
}
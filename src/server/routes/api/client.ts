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
        this.section = 'clients';
    }

    create() {
        console.log('[ClientRoute::create] Creating client routes.');

        this.registerRoute('/', Method.GET, (req, res) => { new ClientRoute().get(req, res); });

        this.registerRoute('/add', Method.POST, (req, res) => { new ClientRoute().add(req, res); });

        this.registerRoute('/edit', Method.POST, (req, res) => { new ClientRoute().edit(req, res); });

        this.registerRoute('/remove', Method.POST, (req, res) => { new ClientRoute().remove(req, res); });
    }

    public async get(req: Request, res: Response) {
        const clients = await this.clientService.getClients();

        this.render(req, res, clients);
    }

    /**
     * Adds the client
     * @param req
     * @param res
     */
    public async add(req: Request, res: Response) {
        const client = await this.clientService.addClient(req.body);

        this.render(req, res, client);
    }

    /**
     * Edits the client
     * @param req
     * @param res
     */
    public async edit(req: Request, res: Response) {
        const client = await this.clientService.editClient(req.body);

        this.render(req, res, client);
    }

    /**
     * Removes the client
     * @param req
     * @param res
     */
    public async remove(req: Request, res: Response) {
        const success = await this.clientService.removeClient(req.body);

        this.render(req, res, success);
    }
}

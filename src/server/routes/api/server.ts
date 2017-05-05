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
        this.section = 'servers';
    }

    /**
     * Set the routes
     */
    create() {
        console.log('[ServerRoute::create] Creating server routes.');

        this.registerRoute('/', Method.GET, (req, res) => { this.get(req, res); });

        this.registerRoute('/add', Method.POST, (req, res) => { this.add(req, res); });

        this.registerRoute('/edit', Method.POST, (req, res) => { this.edit(req, res); });

        this.registerRoute('/remove', Method.POST, (req, res) => { this.remove(req, res); });

        this.registerRoute('/online/:id', Method.GET, (req, res) => { this.isOnline(req, res); });
    }

    /**
     * Gets all the servers
     * @param req
     * @param res
     */
    public async get(req: Request, res: Response) {
        const servers = await this.serverService.getServers();

        this.render(req, res, servers);
    }

    /**
     * Adds the server
     * @param req
     * @param res
     */
    public async add(req: Request, res: Response) {
        const server = await this.serverService.addServer(req.body);

        this.render(req, res, server);
    }

    /**
     * Edits the server
     * @param req
     * @param res
     */
    public async edit(req: Request, res: Response) {
        const server = await this.serverService.editServer(req.body);

        this.render(req, res, server);
    }

    /**
     * Removes the server
     * @param req
     * @param res
     */
    public async remove(req: Request, res: Response) {
        const success = await this.serverService.removeServer(req.body);

        this.render(req, res, success);
    }

    /**
     * Checks if the server is online
     * @param req
     * @param res
     */
    public async isOnline(req: Request, res: Response) {
        const id = req.params['id'];
        const server = await this.serverService.getServerById(id);
        const available = await this.serverService.checkAvailable(server);

        this.render(req, res, { date: new Date(), available: available });
    }
}

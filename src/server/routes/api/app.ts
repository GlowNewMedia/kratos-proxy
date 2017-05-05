import { Router, Request, Response } from 'express';

import { BaseRoute, Method } from './base';

import { AppConfigService } from '../../services/appConfig.service';

export class AppRoute extends BaseRoute {
    private appService: AppConfigService;

    /**
     * Setup the route
     */
    constructor() {
        super();
        this.appService = new AppConfigService();
        this.section = 'config';
    }

    create() {
        console.log('[AppRoute::create] Creating app routes.');

        this.registerRoute('/', Method.GET, (req, res) => { this.get(req, res); });

        this.registerRoute('/save', Method.POST, (req, res) => { this.update(req, res); });

        // this.registerRoute('/edit', Method.POST, (req, res) => { this.edit(req, res); });

        // this.registerRoute('/remove', Method.POST, (req, res) => { this.remove(req, res); });
    }

    public async get(req: Request, res: Response) {
        const config = await this.appService.getServerConfig();

        this.render(req, res, config);
    }

    /**
     * Updates the config
     * @param req
     * @param res
     */
    public async update(req: Request, res: Response) {
        const client = await this.appService.updateConfig(req.body);

        this.render(req, res, client);
    }

    // /**
    //  * Edits the client
    //  * @param req
    //  * @param res
    //  */
    // public async edit(req: Request, res: Response) {
    //     const client = await this.clientService.editClient(req.body);

    //     this.render(req, res, client);
    // }

    // /**
    //  * Removes the client
    //  * @param req
    //  * @param res
    //  */
    // public async remove(req: Request, res: Response) {
    //     const success = await this.clientService.removeClient(req.body);

    //     this.render(req, res, success);
    // }
}

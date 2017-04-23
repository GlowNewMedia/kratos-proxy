import { Request, Response, Router } from 'express';

export class BaseRoute {
    private router: Router;
    public section: string;

    /**
     * The public bootstrap method
     * @param router 
     */
    public static bootstrap(router: Router) {
        new this().internalCreate(router);
    }

    /**
     * Sets up the interal to a route 
     * @param router 
     */
    private internalCreate(router: Router) {
        this.router = router;
        this.create();
    }

    /**
     * The create method on the extended class
     */
    public create() {
        throw "Not Implemented";
    };

    /**
     * Registers a route
     * @param route 
     * @param method 
     * @param callback 
     */
    public registerRoute(route: string, method: Method, callback: (req: Request, res: Response) => any) {
        switch(method) {
            case Method.GET:
                this.router.get(this.getRoute(route), (req, res) => { callback(req, res); });
            break;
            case Method.PUT:
                this.router.put(this.getRoute(route), (req, res) => { callback(req, res); });
            break;
            case Method.POST:
                this.router.post(this.getRoute(route), (req, res) => { callback(req, res); });
            break;
            case Method.DELETE:
                this.router.delete(this.getRoute(route), (req, res) => { callback(req, res); });
            break;
        }
    }

    /**
     * Gets the route from the parameter + api + section
     * @param route 
     */
    public getRoute(route: string) {
        if(this.section == null || this.section.trim() == ""){
            throw "Please set the section";
        }

        return '/api/' + this.section + route;
    }

    /**
     * Renders a json result
     * @param req 
     * @param res 
     * @param data 
     */
    public render(req: Request, res: Response, data: any) {
        res.json(data);
    }
}

/**
 * The supported method types
 */
export enum Method {
    GET,
    PUT,
    POST,
    DELETE
}
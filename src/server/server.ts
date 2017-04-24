import * as bodyParser from "body-parser";
import * as express from "express";
import * as logger from "morgan";
import * as path from "path";
import errorHandler = require("errorhandler");
import methodOverride = require("method-override");

import { ProxyService } from './services/proxy.service';

import { ServerRoute } from './routes/api/server';
import { ClientRoute } from './routes/api/client';

/**
 * The server.
 *
 * @class Server
 */
export class Server {

  public app: express.Application;
  public proxy: ProxyService;

  /**
   * Bootstrap the application.
   *
   * @class Server
   * @method bootstrap
   * @static
   * @return {ng.auto.IInjectorService} Returns the newly created injector for this app.
   */
  public static bootstrap(): Server {
    return new Server();
  }

  /**
   * Constructor.
   *
   * @class Server
   * @constructor
   */
  constructor() {
    //create expressjs application
    this.app = express();

    //configure application
    this.config();

    //add api
    this.api();

    //add routes
    this.routes();

    // setup proxy
    this.setupProxy();
  }

  /**
   * Create REST API routes
   *
   * @class Server
   * @method api
   */
  public api() {
    let router: express.Router;
    router = express.Router();

    ServerRoute.bootstrap(router);

    ClientRoute.bootstrap(router);

    this.app.use(router);
  }

  /**
   * Configure application
   *
   * @class Server
   * @method config
   */
  public config() {
    this.app.use(express.static(path.join(__dirname, '../../app')));

    this.app.use(logger("dev"));

    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
  }

  /**
   * Create router
   *
   * @class Server
   * @method api
   */
  public routes() {
    this.app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../../app/index.html'));
    });
  }

  /**
   * Create proxy
   */
  public setupProxy() {
    this.proxy = new ProxyService();
    this.proxy.setupProxy(8080);
  }
}
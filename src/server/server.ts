import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as logger from 'morgan';
import * as path from 'path';
import * as http from 'http';
import errorHandler = require('errorhandler');
import methodOverride = require('method-override');

import { ProxyService } from './services/proxy.service';
import { ConfigService } from './services/config.service';

import { ServerRoute } from './routes/api/server';
import { ClientRoute } from './routes/api/client';

import { Config } from './models/config';

/**
 * The server.
 *
 * @class Server
 */
export class Server {

  public app: express.Application;
  public proxy: ProxyService;
  public httpServer: http.Server;
  public httpPort: string | number;
  public configService: ConfigService<Config>;

  /**
   * Bootstrap the application.
   *
   * @class Server
   * @method bootstrap
   * @static
   * @return {ng.auto.IInjectorService} Returns the newly created injector for this app.
   */
  public static bootstrap(): Server {
    console.log('[Server:bootstrap] Booting Kratos Proxy');
    return new Server();
  }

  /**
   * Constructor.
   *
   * @class Server
   * @constructor
   */
  constructor() {
    // create expressjs application
    this.app = express();

    // configure application
    this.config();

    // add api
    this.api();

    // add routes
    this.routes();

    // setup proxy
    this.setupProxy();

    // listen on http
    this.listen();
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
    // create config service
    this.configService = new ConfigService<Config>('./config/app.json');

    // present the app folder
    this.app.use(express.static(path.join(__dirname, '../../app')));

    // log http requests
    this.app.use(logger('dev'));

    // parse json body
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
    this.configService.getConfig().then((config: Config) => {
      this.proxy = new ProxyService();
      this.proxy.setupProxy(config.proxy.port);
    });
  }

  /**
   * Listen on http
   */
  public listen() {
    this.configService.getConfig().then((config: Config) => {
      if (config != null) {
        this.httpPort = this.normalizePort(process.env.PORT || config.port);

        this.app.set('port', this.httpPort);
        this.httpServer = http.createServer(this.app);

        // add error handler
        this.httpServer.on('error', (error: any) => { this.onListenError(error); });

        // start listening on port
        this.httpServer.on('listening', () => { this.onListening(); });

        // listen on provided ports
        this.httpServer.listen(this.httpPort);
      }
    });
  }

  /**
   * Stop listening on http
   */
  public stopListening() {
    return this.httpServer.close();
  }

  /**
   * Http listen error handler
   * @param error
   */
  private onListenError(error: any) {
    if (error.syscall !== 'listen') {
      throw error;
    }

    const bind = this.getBind();

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        console.error('[Server::onListenError] ' + bind + ' requires elevated privileges');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error('[Server::onListenError] ' + bind + ' is already in use');
        process.exit(1);
        break;
      default:
        throw error;
    }
  }

  /**
   * Http listen handler
   */
  private onListening() {
    const addr = this.httpServer.address();
    const bind = this.getBind();
    console.log('[Server::onListening] Listening on ' + bind);
  }

  /**
   * Gets string for pipe or port
   */
  private getBind() {
    const bind = typeof this.httpPort === 'string'
    ? 'Pipe ' + this.httpPort
    : 'Port ' + this.httpPort;

    return bind;
  }

  /**
   * Gets the port number or pipe
   * @param val
   */
  private normalizePort(val: string) {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
      // named pipe
      return val;
    }

    if (port >= 0) {
      // port number
      return port;
    }

    throw new Error('Incorrect port type');
  }
}

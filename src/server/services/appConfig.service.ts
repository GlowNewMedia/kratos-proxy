import * as events from 'events';

import { ConfigService } from './config.service';

import { Config, ProxyConfig } from '../models/config';

export class AppConfigService extends ConfigService<Config> {
    public static events: AppEventEmitter;
    private configService: ConfigService<Config>;

    constructor() {
        super('./config/app.json');
        if (AppConfigService.events == null) {
            AppConfigService.events = new AppEventEmitter();
        }
    }

    async getProxyConfig(): Promise<ProxyConfig> {
        const config = await this.getConfig();

        return config.proxy;
    }

    getServerConfig(): Promise<Config> {
        return this.getConfig();
    }

    async updateConfig(config: Config) {
        const oldConfig = await this.getServerConfig();
        await this.saveConfig(config);

        if (oldConfig.port !== config.port) {
            AppConfigService.events.sendPort(config.port);
        }

        if (oldConfig.proxy.port !== config.proxy.port) {
            AppConfigService.events.sendProxyPort(config.proxy.port);
        }
    }

    protected getDefaultConfig(): Config {
        return {
            'port': 3000,
            'proxy': {
                'port': 2020,
                'addUknownDevices': false,
                'fallback': true
            }
        };
    }
}

export class AppEventEmitter extends events.EventEmitter {
    PORT_EVENT = 'portChange';
    PROXY_PORT_EVENT = 'proxyPortChange';

    public emitter: any;

    constructor() {
        super();
        this.emit('ready');
    }

    public sendPort(port: number | string) {
        this.emit(this.PORT_EVENT, port);
    }

    public onPortChange(callback: (port: number | string) => any) {
        this.on(this.PORT_EVENT, callback);
    }

    public sendProxyPort(port: number) {
        this.emit(this.PROXY_PORT_EVENT, port);
    }

    public onProxyPortChange(callback: (port: number) => any) {
        this.on(this.PROXY_PORT_EVENT, callback);
    }
}

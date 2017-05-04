export class Config {
    port: string | number;
    proxy: ProxyConfig;
}

export class ProxyConfig {
    port: number;
    addUknownDevices: boolean;
}
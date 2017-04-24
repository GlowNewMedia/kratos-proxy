import * as fs from 'async-file';

export class ConfigService<T> {
    /**
     *  Wraps a filename in a handy helper class
     */
    constructor(private fileName: string) {
        
    }

    public async getConfig(): Promise<T> {
        let config = await fs.readFile(this.fileName);

        return JSON.parse(config) as T;
    }

    public async saveConfig(config: T): Promise<void> {
        await fs.writeFile(this.fileName, JSON.stringify(config));
    }
}
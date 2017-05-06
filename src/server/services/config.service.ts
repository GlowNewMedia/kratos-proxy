import * as fs from 'async-file';

export abstract class ConfigService<T> {
    /**
     *  Wraps a filename in a handy helper class
     */
    constructor(private fileName: string) {
        fs.exists(this.fileName).then(async (exists: boolean) => {
            if (!exists) {
                const config = this.getDefaultConfig();
                await this.saveConfig(config);
            }
        });
    }

    protected async getConfig(): Promise<T> {
        const config = await fs.readFile(this.fileName);

        return JSON.parse(config) as T;
    }

    protected async saveConfig(config: T): Promise<void> {
        await fs.writeFile(this.fileName, JSON.stringify(config));
    }

    protected abstract getDefaultConfig(): T;
}

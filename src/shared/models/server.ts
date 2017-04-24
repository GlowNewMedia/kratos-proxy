import { Client } from './client';

export class Server {
    id: string;

    ip: string;
    port: number;
    name: string;
    
    clients: Client[];
}
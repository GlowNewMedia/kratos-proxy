import { Client } from './client';

export class Server {
    id: string;

    ip: string;
    name: string;
    
    clients: Client[];
}
export interface BaseController {
    name: string;
}

export interface Module {
    name: string;
    server: Server;
    init: () => Promise<void>;
}

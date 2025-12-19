import { PrismaClient } from '@prisma/client';

class Database {
    private static _instance: PrismaClient | null = null;
    private constructor() {}

    static getInstance() {
        if (!this._instance) {
            this._instance = new PrismaClient();
        }
        return this._instance;
    }

    static async disconnect() {
        if (this._instance) {
            await this._instance.$disconnect();
        }
    }
}

export default Database;

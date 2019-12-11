import {Connection, ConnectionOptions, createConnection, Like, Repository} from "typeorm";
import {Sessions} from "./Entity/Sessions";
import path from 'path';

/**
 * Data store service
 */
export class DataStoreService {
    /**
     * DB Connection
     */
    private static connection: Connection;

    /**
     * Get Connection Instance
     */
    private static async getConnection() {
        if (!DataStoreService.connection) {
            DataStoreService.connection = await createConnection({
                type: "sqlite",
                database: `${path.resolve(__dirname, "../../data")}/data.sqlite`,
                entities: [Sessions],
                synchronize: true,
                //logging: true
            })
        }
        return DataStoreService.connection;
    }

    /**
     * List credentials by name
     *
     * @param name
     */
    public async listSessions(name: string): Promise<Sessions[]> {
        const connection: Connection = await DataStoreService.getConnection();
        const repository = await connection.getRepository(Sessions);
        return repository.find({name: Like(`%${name}%`)});
    }

    public async getSession(name: string): Promise<Sessions[]> {
        const connection: Connection = await DataStoreService.getConnection();
        const repository = await connection.getRepository(Sessions);
        return repository.find({name: name});
    }

    public async createSession(session:Sessions): Promise<Sessions> {
        const connection: Connection = await DataStoreService.getConnection();
        const repository = await connection.getRepository(Sessions);
        return repository.save(session);
    }

    public async updateSession(session: Sessions): Promise<Sessions> {
        const connection: Connection = await DataStoreService.getConnection();
        const repository = await connection.getRepository(Sessions);
        return repository.save(session);
    }

    public async deleteSession(session: Sessions): Promise<any> {
        const connection: Connection = await DataStoreService.getConnection();
        const repository = await connection.getRepository(Sessions);
        return repository.remove(session);
    }
}

import path from "path";
import {Connection, createConnection, Like, Raw} from "typeorm";
import {Session} from "./Entity/Session";

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
                database: `${path.resolve(__dirname, "../../data")}/data-1.0.0.sqlite`,
                entities: [Session],
                synchronize: true,
                type: "sqlite",
                // logging: true,
            });
        }
        return DataStoreService.connection;
    }

    /**
     * List credentials by name
     *
     * @param name
     */
    public async listSessions(name: string): Promise<Session[]> {
        const connection: Connection = await DataStoreService.getConnection();
        const repository = await connection.getRepository(Session);
        // @ts-ignore
        return repository.createQueryBuilder<Session>()
            .where(`LOWER(NAME) LIKE '%${name.toLowerCase()}%' OR IP LIKE '%${name.toLowerCase()}%'
                          OR LOWER(USER) LIKE '%${name.toLowerCase()}%' `).getMany();
    }

    /**
     * Get sessions from SQLite
     *
     * @param name
     */
    public async getSession(name: string): Promise<Session[]> {
        const connection: Connection = await DataStoreService.getConnection();
        const repository = await connection.getRepository(Session);
        return repository.find({name});
    }

    /**
     * Create session on SQLite
     *
     * @param session
     */
    public async createSession(session: Session): Promise<Session> {
        const connection: Connection = await DataStoreService.getConnection();
        const repository = await connection.getRepository(Session);
        return repository.save(session);
    }

    // [TODO] implement update functionality
    public async updateSession(session: Session): Promise<Session> {
        const connection: Connection = await DataStoreService.getConnection();
        const repository = await connection.getRepository(Session);
        return repository.save(session);
    }

    /**
     * Delete session from SQLite
     *
     * @param session
     */
    public async deleteSession(session: Session): Promise<any> {
        const connection: Connection = await DataStoreService.getConnection();
        const repository = await connection.getRepository(Session);
        return repository.remove(session);
    }
}

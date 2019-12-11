import { Sessions } from "./Entity/Sessions";
/**
 * Data store service
 */
export declare class DataStoreService {
    /**
     * DB Connection
     */
    private static connection;
    /**
     * Get Connection Instance
     */
    private static getConnection;
    /**
     * List credentials by name
     *
     * @param name
     */
    listSessions(name: string): Promise<Sessions[]>;
    getSession(name: string): Promise<Sessions[]>;
    createSession(session: Sessions): Promise<Sessions>;
    updateSession(session: Sessions): Promise<Sessions>;
    deleteSession(session: Sessions): Promise<any>;
}

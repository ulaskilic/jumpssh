import { Session } from "./Entity/Session";
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
    listSessions(name: string): Promise<Session[]>;
    getSession(name: string): Promise<Session[]>;
    createSession(session: Session): Promise<Session>;
    updateSession(session: Session): Promise<Session>;
    deleteSession(session: Session): Promise<any>;
}

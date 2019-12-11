import { DataStoreService } from "./Services/DataStoreService";
/**
 * Main application context
 */
export declare class Application {
    program: any;
    store: DataStoreService | null;
    /**
     * Constructor
     */
    constructor();
    /**
     * Startup of CLI
     */
    execute(): Promise<void>;
    /**
     * Create SSH Session and save to DB
     */
    private createSession;
    /**
     * Update exists session
     *
     * @param name
     */
    private updateSession;
    /**
     * Delete session
     *
     * @param name
     */
    private deleteSession;
    private findSession;
    private startSession;
    private initArgs;
    private log;
    private prepareChoices;
}

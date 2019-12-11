import { DataStoreService } from "./Services/DataStoreService";
/**
 * Main application context
 */
export declare class Application {
    program: any;
    store: DataStoreService | null;
    constructor();
    execute(): Promise<void>;
    private createSession;
    private updateSession;
    private deleteSession;
    private findSession;
    private startSession;
    private initArgs;
    private log;
}

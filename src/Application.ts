import program from "commander";

// tslint:disable-next-line:no-var-requires
const appJson = require("../package.json");
import chalk from "chalk";
import {spawn} from "child_process";
import clear from "clear";
import figlet from "figlet";
import prompt, {Choice} from "prompts";
import validator from "validator";
import {DataStoreService} from "./Services/DataStoreService";
import {Session} from "./Services/Entity/Session";

/**
 * Main application context
 */
export class Application {
    private program: any;
    private store: DataStoreService | null = null;

    /**
     * Constructor
     */
    constructor() {
        this.initArgs();
    }

    /**
     * Startup of CLI
     */
    public async execute() {
        this.store = new DataStoreService();
        if (program.create) {
            this.createSession();
        // [TODO] implement update functionality
        // } else if (program.update) {
        //     this.updateSession(program.update);
        } else if (program.delete) {
            this.deleteSession(program.delete);
        } else if (program.args.length > 0) {
            this.findSession(this.program.args[0]);
        } else {
            clear();
            this.log(chalk.green(figlet.textSync(appJson.name, {horizontalLayout: "full"})), Colors.GREEN, true);
            program.outputHelp();
            this.listSession();
        }
    }

    /**
     * Create SSH Session and save to DB
     */
    private async createSession() {
        const response = await prompt([
            {
                type: "text",
                name: "sessionName",
                message: "Session name for using later",
                validate: (sessionName) => {
                    if (!sessionName) {
                        return false;
                    }
                    return sessionName;
                },
            },
            {
                type: "text",
                name: "ipAddress",
                message: "IP address of remote",
                validate: (ipAddress) => {
                    if (!ipAddress) {
                        return false;
                    }
                    return validator.isIP(ipAddress);
                },
            },
            {
                type: "text",
                name: "user",
                message: "User information (Optional)",
                initial: "",
                validate: (user) => {
                    return validator.isAlphanumeric(user);
                },
            },
            // [TODO] implement password field
            // {
            //     type: "password",
            //     name: "pass",
            //     message: "Pass information (Optional)",
            //     initial: "",
            //     validate: (pass) => {
            //         return true;
            //     },
            // },
        ]);

        const session = new Session(response.sessionName, response.ipAddress, response.user, "");
        try {
            if (!this.store) {
                throw new Error("Unknown error occured");
            }
            await this.store.createSession(session);
            this.log("Session added!", Colors.GREEN);
        } catch (e) {
            this.log("Failed! Error: " + e.message, Colors.RED);
        }
    }

    /**
     * Update exists session
     *
     * @param name
     */
    private async updateSession(name: string) {

    }

    /**
     * Delete session
     *
     * @param name
     */
    private async deleteSession(name: string) {
        let sessions: Session[] = [];
        if (!this.store) {
            throw new Error("Unknown error occurred");
        }
        try {
            sessions = await this.store.listSessions(name);
            if (sessions.length === 0) {
                this.log("No session found.", Colors.RED);
                process.exit();
            }
        } catch (e) {
            this.log("Failed! Error: " + e.message, Colors.RED);
        }

        const response = await prompt({
            type: "select",
            name: "session",
            message: "Pick session for remove",
            choices: this.prepareChoices(sessions),
        });
        if (response.session) {
            await this.store.deleteSession(response.session);
            this.log("Session deleted!", Colors.GREEN);
        } else {
            this.log("Process terminated!", Colors.RED);
            process.exit();
        }
    }

    /**
     * List all sessions
     */
    private async listSession() {
        let sessions: Session[] = [];
        try {
            if (!this.store) {
                throw new Error("Unknown error occurred");
            }
            sessions = await this.store.listSessions("");
            if (sessions.length === 0) {
                this.log("No session found.", Colors.RED);
                process.exit();
            }
        } catch (e) {
            this.log("Failed! Error: " + e.message, Colors.RED);
        }

        const response = await prompt({
            type: "autocomplete",
            name: "session",
            message: "Type for searching session list",
            choices: this.prepareChoices(sessions),
            suggest: (query, choices) => {
                return new Promise<any>((resolve, reject) => {
                    resolve(choices.filter((choice) => {
                        return choice.title.toLowerCase().includes(query.toLowerCase());
                    }));
                });
            },
        });
        if (response.session) {
            this.startSession(response.session);
        } else {
            this.log("Process terminated!", Colors.RED);
            process.exit();
        }
    }

    /**
     * Find session by session name
     */
    private async findSession(name: string) {
        let sessions: Session[] = [];
        try {
            if (!this.store) {
                throw new Error("Unknown error occurred");
            }
            sessions = await this.store.listSessions(name);
            if (sessions.length === 0) {
                this.log("No session found.", Colors.RED);
                process.exit();
            } else if (sessions.length === 1) {
                return this.startSession(sessions[0]);
            }
        } catch (e) {
            this.log("Failed! Error: " + e.message, Colors.RED);
        }

        const response = await prompt({
            type: "select",
            name: "session",
            message: "Pick session",
            choices: this.prepareChoices(sessions),
        });
        if (response.session) {
            this.startSession(response.session);
        } else {
            this.log("Process terminated!", Colors.RED);
            process.exit();
        }
    }

    /**
     * Execute SSH Shell
     *
     * @param session
     */
    private async startSession(session: Session) {
        this.log(`Trying to connect : ${session.name}(${session.ip})`, Colors.GREEN);
        try {
            this.log(`ssh -qtt ${session.user ? session.user + "@" : ""}${session.ip}`, Colors.GREEN);
            const sshSession = spawn(`ssh`, [`-qtt`, `${session.user ? session.user + "@" : ""}${session.ip}`],
                {stdio: "inherit", shell: true});

            sshSession.on("error", (e) => {
                this.log(e.message, Colors.RED);
            });

            sshSession.on("exit", () => {
                this.log("Session ended, thanks for using!", Colors.GREEN);
            });
        } catch (e) {
            this.log(e.message, Colors.RED);
        }
    }

    /**
     * [TODO]
     * Start Chain SSH
     *
     * @param sessions
     */
    private async startChainSession(sessions: Session[]) {
    }

    /**
     * Init args
     */
    private initArgs() {
        this.program = program
            .version(appJson.version)
            .option("-c, --create", "create new session")
            // [TODO] implement update functionality
            // .option("-u, --update <SESSION_NAME>", "update exists session")
            .option("-d, --delete <SESSION_NAME>", "delete session")
            .arguments("<SESSION_NAME>")
            .description(appJson.description)
            .parse(process.argv);
    }

    /**
     * Log
     *
     * @param msg
     * @param color
     * @param hidePrefix
     */
    private log(msg: string, color: Colors, hidePrefix: boolean = false) {
        switch (color) {
            case Colors.GREEN:
                // tslint:disable-next-line:no-console
                console.log(chalk.green(`${hidePrefix ? "" : "[JumpSSH]:"} ${msg}`));
                break;
            case Colors.RED:
                // tslint:disable-next-line:no-console
                console.log(chalk.red(`${hidePrefix ? "" : "[JumpSSH]:"} ${msg}`));
                break;
        }
    }

    /**
     * Prepare session choices
     *
     * @param sessions
     */
    private prepareChoices(sessions: Session[]): Choice[] {
        const choices: Choice[] = [];
        for (const session of sessions) {
            choices.push({
                title: `${session.name}(${session.user ? session.user + "@" : ""}${session.ip})`,
                value: session,
            });
        }
        return choices;
    }

}

/**
 * Console colors
 */
enum Colors {
    RED = "red",
    GREEN = "green",
}

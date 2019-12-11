import program from "commander";

const appJson = require("../package.json");
import chalk from 'chalk'
import clear from 'clear';
import figlet from 'figlet';
import {DataStoreService} from "./Services/DataStoreService";
import prompt, {Choice} from 'prompts';
import {Session} from "./Services/Entity/Session";
import validator from 'validator';
import {spawn, execSync} from 'child_process';

/**
 * Main application context
 */
export class Application {
    program: any;
    store: DataStoreService | null = null;

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
            this.createSession()
        } else if (program.update) {
            this.updateSession(program.update)
        } else if (program.delete) {
            this.deleteSession(program.delete)
        } else if (program.args.length > 0) {
            this.findSession()
        } else {
            clear();
            console.log(chalk.green(figlet.textSync(appJson.name, {horizontalLayout: "full"})));
            program.outputHelp();
        }
    }

    /**
     * Create SSH Session and save to DB
     */
    private async createSession() {
        const response = await prompt([
            {
                type: 'text',
                name: 'sessionName',
                message: 'Session name for using later',
                validate: (sessionName) => {
                    if (!sessionName) {
                        return false
                    }
                    return validator.isAlphanumeric(sessionName);
                }
            },
            {
                type: 'text',
                name: 'ipAddress',
                message: 'IP address of remote',
                validate: (ipAddress) => {
                    if (!ipAddress) {
                        return false
                    }
                    return validator.isIP(ipAddress);
                }
            },
            {
                type: 'text',
                name: 'user',
                message: 'User information (Optional)',
                initial: '',
                validate: (user) => {
                    if(user){
                        return validator.isAlphanumeric(user)
                    }
                    return true
                }
            },
            {
                type: 'password',
                name: 'pass',
                message: 'Pass information (Optional)',
                initial: '',
                validate: (pass) => {
                    return true
                }
            },
        ]);

        const session = new Session(response.sessionName, response.ipAddress, response.user, response.pass);
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

    }

    private async findSession() {
        let _sessions: Session[] = [];
        try {
            if (!this.store) {
                throw new Error("Unknown error occurred");
            }
            _sessions = await this.store.listSessions(this.program.args[0]);
            if (_sessions.length == 0) {
                this.log("No session found.", Colors.RED);
            } else if (_sessions.length == 1) {
                return this.startSession(_sessions[0])
            }
        } catch (e) {
            this.log("Failed! Error: " + e.message, Colors.RED);
        }

        const response = await prompt({
            type: 'select',
            name: 'session',
            message: 'Pick session',
            choices: this.prepareChoices(_sessions)
        });
        if (response.session) {
            this.startSession(response.session);
        } else {
            this.log("Process terminated!", Colors.RED)
        }

    }

    private async startSession(session: Session) {
        this.log(`Trying to connect : ${session.name}(${session.ip})`, Colors.GREEN);
        spawn('ssh', ['-T',`${session.user ? session.user + '@' : null}${session.ip}`])
    }

    private initArgs() {
        this.program = program
            .version(appJson.version)
            .option("-c, --create", "create new session")
            .option("-u, --update <SESSION_NAME>", "update exists session")
            .option("-d, --delete <SESSION_NAME>", "delete session")
            .arguments("<SESSION_NAME>")
            .description(appJson.description)
            .parse(process.argv);
    }

    private log(msg: string, color: Colors) {
        switch (color) {
            case Colors.GREEN:
                console.log(chalk.green(msg));
                break;
            case Colors.RED:
                console.log(chalk.red(msg));
                break
        }
    }

    private prepareChoices(sessions:Session[]): Choice[] {
        const choices: Choice[] = [];
        for (let session of sessions) {
            choices.push({
                title: `${session.name}(${session.ip})`,
                value: session
            })
        }
        return choices;
    }

}

enum Colors {
    RED = 'red',
    GREEN = 'green'
}


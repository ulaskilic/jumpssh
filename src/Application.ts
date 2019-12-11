import program from "commander";

const appJson = require("../package.json");
import chalk from 'chalk'
import clear from 'clear';
import figlet from 'figlet';
import {DataStoreService} from "./Services/DataStoreService";
import prompt, {Choice} from 'prompts';
import {Sessions} from "./Services/Entity/Sessions";
import validator from 'validator';


/**
 * Main application context
 */
export class Application {
    program: any;
    store: DataStoreService | null = null;

    constructor() {
        this.initArgs();
    }

    public async execute() {
        this.store = new DataStoreService();
        if (program.create) {
            this.createSession()
        } else if (program.update) {
            this.updateSession()
        } else if (program.delete) {
            this.deleteSession()
        } else if (program.args.length > 0) {
            this.findSession()
        } else {
            clear();
            console.log(chalk.green(figlet.textSync(appJson.name, {horizontalLayout: "full"})));
            program.outputHelp();
        }
    }

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
                type: 'text',
                name: 'pass',
                message: 'Pass information (Optional)',
                initial: '',
                validate: (pass) => {
                    return true
                }
            },
        ]);

        const session = new Sessions(response.sessionName, response.ipAddress, response.user, response.pass);
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

    private async updateSession() {

    }

    private async deleteSession() {

    }

    private async findSession() {
        let _sessions: Sessions[] = [];
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

        const optionList = (): Choice[] => {
            const choices: Choice[] = [];
            for (let session of _sessions) {
                choices.push({
                    title: `${session.name}(${session.ip})`,
                    value: session
                })
            }
            return choices;
        };

        const response = await prompt({
            type: 'select',
            name: 'session',
            message: 'Pick session',
            choices: optionList()
        });
        if (response.session) {
            this.startSession(response.session);
        } else {
            this.log("Process terminated!", Colors.RED)
        }

    }

    private async startSession(session: Sessions) {
        this.log(`Trying to connect : ${session.name}(${session.ip})`, Colors.GREEN);
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

}

enum Colors {
    RED = 'red',
    GREEN = 'green'
}


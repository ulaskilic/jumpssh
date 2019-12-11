#!/usr/bin/env node
import {Application} from "./Application";

const app = new Application();

app.execute();

/*
import chalk from 'chalk'
import clear from 'clear';
import figlet from 'figlet';

import {Command} from 'commander';
import {DataStoreService} from "./Services/DataStoreService";

// Clear everything
clear();


program
    .version("1.0.0")
    .arguments("<SESSIONNAME>")
    .description("SSH credentials storage for making easy jumps")
    .parse(process.argv);


async function test(){
    const service = new DataStoreService();

    const results = await service.listCredentials("");
}

test();
//program.outputHelp();
*/

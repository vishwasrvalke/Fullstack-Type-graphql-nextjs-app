#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('yargonaut')
    .style('blue')
    .style('yellow', 'required')
    .helpStyle('green')
    .errorsStyle('red');
const yargs_1 = __importDefault(require("yargs"));
const CLIConfigurator_1 = require("./CLIConfigurator");
(async () => {
    const args = (await CLIConfigurator_1.CLIConfigurator.configure()).parse(process.argv.slice(2));
    if (args._.length === 0) {
        yargs_1.default.showHelp();
    }
})();

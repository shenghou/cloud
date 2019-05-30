#!/usr/bin/env node
process.env.NODE_PATH = __dirname + "/../node_modules/";
const { resolve } = require("path");

const res = command => resolve(__dirname, "../lib/", command);

const program = require("commander");

//declar program variable
program.version(require("../package").version);

program.usage("<command>");

program
  .command("init")
  .option("-f, --foo", "enable some foo") //option
  .description("Generate a new project")
  .alias("i")
  .action(() => {
    require(res("init"));
  });
if (!program.args || !program.args.length) {
  program.help();
}



// example 
// https://github.com/tj/commander.js/tree/master/examples
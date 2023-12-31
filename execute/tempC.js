// executeCommand.js
const express = require('express');
const { spawn } = require('child_process');

const executeCommandRouter = express.Router();

executeCommandRouter.post('/execute', (req, res) => {
    const command = req.body.commandInput;
    const commandArgs = command.split(' ');

    const childProcess = spawn(commandArgs[0], commandArgs.slice(1));

    let output = '';

    childProcess.stdout.on('data', (data) => {
        output += data.toString();
    });

    childProcess.stderr.on('data', (data) => {
        output += data.toString();
    });

    childProcess.on('close', (code) => {
        console.log(`Child process exited with code ${code}`);
        res.send(output);
    });
});

module.exports = executeCommandRouter;

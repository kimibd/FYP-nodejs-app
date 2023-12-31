// nmapCommand.js
const express = require('express');
const { spawn } = require('child_process');

const nmapCommandRouter = express.Router();

nmapCommandRouter.post('/nmap', (req, res) => {
    const { target } = req.body;

    // Validate inputs to prevent security issues.

    // Example command without specific flags
    const command = `nmap ${target}`;
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

module.exports = nmapCommandRouter;

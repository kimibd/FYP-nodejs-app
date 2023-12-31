// gobusterCommand.js
const express = require('express');
const { spawn } = require('child_process');

const gobusterCommandRouter = express.Router();

gobusterCommandRouter.post('/gobuster', (req, res) => {
    const { url, wordlist } = req.body;

    // Validate inputs to prevent security issues.

    const command = `gobuster dir -u ${url} -w ${wordlist}`;
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

module.exports = gobusterCommandRouter;

/*jshint esversion:8*/
const Kix = require('kamiloid_cli_node');
const { CLI_Relast, ARGS, DIR } = Kix; 

const Global = require('./src/core/global');
const Git_Hook = require('./src/hooks/git');
const { Nav_Manifest } = require('./src/config');
const App = require('./src/main');

Global.setup( 
    { 
        dir: ( ARGS || [] ).length === 0 ? DIR : ARGS[0],
        pwd: DIR, 
        args: ARGS
    } );

CLI_Relast.run({
    name: 'git_manager',
    title: 'Git Manager',
    api: Git_Hook,
    manifest: Nav_Manifest,
    debug: true
}, App, (fw, app) =>
{
});


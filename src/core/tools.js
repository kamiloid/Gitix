/*jshint esversion:8*/
const Kix = require('kamiloid_cli_node');
const { Print } = Kix.CLI_Relast;

const Tools =
{
     text_format: (txt) =>
     {
         let new_txt = txt || '';
         new_txt = new_txt.replace(/\n/g, Print.end_of_line() );
         return new_txt;
     }
}

module.exports = Tools;

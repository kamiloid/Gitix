/*jshint esversion:8*/
const Kix = require('kamiloid_cli_node');

class Navigation extends Kix.CLI_Relast.Nav_System
{
    constructor(props)
    {
        super(props);
        this.read_manifest();
    }
    actions = () =>
    {
        this.action(`start`, () =>
        {
        });
        this.action(`key_motion`, key =>
            {
                this.navigate_menu(key);
            });
        this.action(`onEnter`, args =>
            {
                if(typeof args.tree !== 'undefined')
                    this.decode_tree_level(args);
            });
        this.action(`onOver`, args =>
            {
            });
    }
}

module.exports = Navigation;

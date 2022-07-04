/*jshint esversion:8*/
const Kix = require('kamiloid_cli_node');

class Interaction_mode extends Kix.CLI_Relast.Nav_System
{
    constructor(props)
    {
        super(props);
    }
    actions = () =>
    {
        this.action(`create_menu`, buffer =>
            {
                let manifest = { main: { tree: buffer } };
                manifest = this._props.config.api_in_manifest(manifest);
                this.read_manifest(manifest);
            });
        this.action(`navigate`, key =>
            {
                this.navigate_menu(key);
            });
        this.action(`clear_menu`, () =>
            {
                this._path = [];
                this._menu = null;
            });
        this.action(`onEnter`, args =>
            {
                if(typeof args.tree !== 'undefined')
                    this.decode_tree_level(args);
            });
        this.action(`onOver`, args =>
            {
            });
        this.action(`clear_path`, () =>
            {
                this.clear_path();
            });
    }
}


module.exports = Interaction_mode;

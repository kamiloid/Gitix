/*jshint esversion:8*/
const Kix = require('kamiloid_cli_node');
const { Engine, Comp } = Kix.CLI_Relast;

const Insert_mode = require('./insert_mode');
const Interaction_mode = require('./interaction_mode');
const { View_Config } = require('../config');
const Git_model = require('../models/git');
const { Nav_Manifest } = require('../config');

class Mode_control extends Comp
{
    constructor(props)
    {
        super(props);
    }
    components = () =>
    {
        this.create_comp(`insert_mode`, Insert_mode, { title: `Write your value: ` });
        this.create_comp(`interaction_mode`, Interaction_mode, { icos: View_Config});
    }
    states = () =>
    {
        this.state(`mode`, '');
    }
    actions = () =>
    {
        this.action(`start`, () =>
        {
        });
        this.action(`key_motion`, key =>
            {
                if(this.state(`mode`).trim() === 'interaction_mode')
                    this.get_comp(`interaction_mode`).call_action(`navigate`, key);
            });
        this.action(`set_mode`, ( v = '' ) =>
            {
                this.state(`mode`, v);
            });
        this.action(`start_interaction`, data =>
            {
                let interact_mode = this.get_comp(`interaction_mode`);
                interact_mode._props.title = data.title || undefined;
                ( data.menu || [] ).push({
                    name: 'exit_menu',
                    label: 'Exit menu',
                    onEnter: () => {
                        this.call_action(`finish_interaction`);
                    }
                });
                interact_mode.call_action(`create_menu`, data.menu);
                this._main.call_action(`change_tab`, `mode_control`)
                Engine.update(); 
            });
        this.action(`finish_interaction`, () => 
            {
                this.get_comp(`interaction_mode`).call_action(`clear_menu`);
                this._parent.call_action(`toggle_preview`, true);
                this._parent.call_action(`change_tab`, `navigation`);
                this.state(`mode`, '');
                Engine.update();
            });
    }
    app_logic = () =>
    {
        this.action(`resp:git_status`, res =>
            {
                let stages = Git_model.Status.str2buffer(res);
                let buffer = Git_model.Status.bind_ui_status({ data: stages, text: res });
                this.call_action(`set_mode`, `interaction_mode`);
                this.call_action(`start_interaction`, { title: `Git status - Add files`, menu: buffer });
            });
        this.action(`resp:git_add_file`, data => 
            {
                if(Nav_Manifest.uix_rules.git_status_actions === 'group')
                    this.get_comp(`interaction_mode`).call_action(`clear_path`);
            });
        this.action(`resp:git_add_all`, data => 
            {
                if(Nav_Manifest.uix_rules.git_status_actions === 'group')
                    this.get_comp(`interaction_mode`).call_action(`clear_path`);
            });
        this.action(`resp:git_reset_file`, data => 
            {
                if(Nav_Manifest.uix_rules.git_status_actions === 'group')
                    this.get_comp(`interaction_mode`).call_action(`clear_path`);
            });
        this.action(`resp:git_reset_all`, data => 
            {
                if(Nav_Manifest.uix_rules.git_status_actions === 'group')
                    this.get_comp(`interaction_mode`).call_action(`clear_path`);
            });
    }
    draw = () =>
    {
        return this.state(`mode`).trim() !== '' ? `[comp:${ this.state(`mode`) }]` : '';
    }
}

module.exports = Mode_control;

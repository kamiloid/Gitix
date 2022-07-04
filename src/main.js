/*jshint esversion: 8*/
const Kix = require('kamiloid_cli_node');
const { CLI_Relast } = Kix; 
const { Interact, Comp, Print } = CLI_Relast;

const Global = require('./core/global');
const { Navigation, Preview, Mode_control } = require('./comps/index');
const { View_Config } = require('./config');

class App extends Comp
{
    _comps_tabs = [`navigation`, `mode_control`];
    constructor(props)
    {
        super(props);
    }
    components = () =>
    {
        this.create_comp(`navigation`, Navigation, { title: `Navigation`, manifest: this._props.manifest, main_nav: true, icos: View_Config, control: { } });
        this.create_comp(`preview`, Preview, { title: `Actions viewer` });
        this.create_comp(`mode_control`, Mode_control);
    }
    states = () =>
    {
        this.state(`main_pointer`, 0);
        this.state(`key`, '');
        this.state(`tab_focus`, 0);
        this.state(`show_preview`, true);
    }
    actions = () =>
    {
        this.action(`start`, () =>
        {
        });
        this.action(`key_input`, (key) =>
        {
            this.state(`key`, key);
            if(key === Interact.DIR.TAB)
            {
                this.state(`tab_focus`, this.state(`tab_focus`) + 1);
                if(this.state(`tab_focus`) >= this._comps_tabs.length)
                    this.state(`tab_focus`, 0);
            }
            let comp = this.get_comp(this._comps_tabs[this.state(`tab_focus`)]);
            if(comp)
                comp.call_action(`key_motion`, key);
        });
        this.action(`change_tab`, v =>
            {
                for(let c in this._comps_tabs)
                {
                    if(this._comps_tabs[c] === v.trim())
                    {
                        this.state(`tab_focus`, c);
                        return;
                    }
                }
            });
        this.action(`insert_mode`, cback =>
        {
            let mode_control = this.get_comp(`mode_control`);
            mode_control.call_action(`set_mode`, `insert_mode`);

            Interact.set_state(Interact.STATE.INSERT);
            Interact.on(Interact.DISPATCHERS.INSERT, data =>
                {
                    mode_control.call_action(`set_mode`, '');
                    if(cback) cback( data );
                });
        });
        this.action(`toggle_preview`, v => 
            {
                this.state(`show_preview`, v);
            });
    };
    nav = (data) =>
    {
        if(data.input)
        {
            let mode_control = this.get_comp(`mode_control`);
            if(mode_control.state(`mode`) === 'insert_mode')
                mode_control.call_action(`set_mode`, '');
            return;
        }
        this.call_action(`key_input`, data.direction);
        this.state(`main_pointer`, data.pointer);
    };
    draw = () =>
    {
        return `${ Print.subtitle( Global.get_global_dir(), false ) }
        [comp:navigation]
        ${ this.state(`show_preview`) ? `[comp:preview]` : `` }
        [comp:mode_control]`;
    };
}

module.exports = App;

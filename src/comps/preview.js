/*jshint esversion:8*/
const Kix = require('kamiloid_cli_node');

class Preview extends Kix.CLI_Relast.Viewer
{
    constructor(props)
    {
        super(props);
    }
    states = () =>
    {
        this.state(`content`, ``);
    }
    actions = () =>
    {
        this.action(`start`, () =>
        {
        });
        this.action(`key_motion`, key =>
        {
            this.scrolling(key);
        });
        this.action(`change_content`, data =>
            {
                this.state(`section`, data.title);
                this.state(`content`, data.content);
                this.call_action(`update`);
            });
    }
}

module.exports = Preview;

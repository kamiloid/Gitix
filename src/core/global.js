/*jshint esversion:8*/
const Global =
    {
        _pwd: process.cwd(),
        _dir: process.cwd(),
        _args: [],

        setup: function( args = {} )
        {
            this._pwd = args.pwd || process.cwd();
            this._dir = args.dir || process.cwd();
            this._args = args.args || process.argv.slice(2);
        },
        set_global_dir: function( dir )
        {
            this._dir = dir || this._dir;
        },
        get_global_dir: function() 
        { 
            return this._dir;
        }
    }

module.exports = Global;

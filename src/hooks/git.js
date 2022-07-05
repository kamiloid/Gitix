/*jshint esversion:8*/
const Global = require('../core/global');
const Tools = require('../core/tools');
const { _pwd } = Global;
const Git = require('../api/git');

const Git_Hook =
{
    Global:
    {
        clear_preview: (args) =>
        {
            if(!args.app) return;
            args.app.call_action(`toggle_preview`, true);
            let preview = args.app.get_comp(`preview`);
            if(!preview) return;
            preview.call_action(`change_content`, { title: args.item.label, content: `` });
        },
    },
    Start:
    {
        check_local_repo: ( args ) =>
        {
            if(!args.app) return;
            let preview = args.app.get_comp(`preview`);
            Git.check_local_repo( res =>
            {
                preview.call_action(`change_content`, { title: args.item.label, content: res.text });
            });
           
        },
        init_local_repo: ( args ) =>
        {
            if(!args.app) return;
            let preview = args.app.get_comp(`preview`);
            Git.check_local_repo( res =>
            {
                if(res.exist)
                {
                    preview.call_action(`change_content`, { title: args.item.label, content: res.text });
                    return;
                }
                Git.init( res2 =>
                {
                    preview.call_action(`change_content`, { title: args.item.label, content: res2.text });
                });

            });
        },
        clone_remote_repo: ( args ) =>
        {
            if(!args.app) return;
            let preview = args.app.get_comp(`preview`);
            args.app.call_action(`insert_mode`, input =>
                {
                    if(!input) return;
                    if(!input.data) return;
                    let remote_repo = input.data;
                    Git.check_local_repo( res => {
                        if(res.exist)
                        {
                            preview.call_action(`change_content`, { title: `Error:`, content: `It is impossible clone repository from existed another one.` })
                            return;
                        }

                        Git.clone_repo( remote_repo, ( res ) => {
                            if(res.cloned)
                            {
                                Global.set_global_dir(`${_pwd}/${res.repo}/`);
                            }
                            preview.call_action(`change_content`, { title: args.item.label, content: Tools.text_format(res.text) });
                        });
                    });
                });
        },
    },
    Branches: {
        show_local_list: ( args ) =>
        {
            if(!args.app) return;
            let preview = args.app.get_comp(`preview`);
            let nav = args.app.get_comp(`navigation`);
            Git.branch(res => {
                preview.call_action(`change_content`, { title: args.item.label, content: Tools.text_format(res.text) });
            });
        }
    },
    Status:
    {
        check_status: ( args ) =>
        {
            if(!args.app) return;
            let preview = args.app.get_comp(`preview`);
            let nav = args.app.get_comp(`navigation`);
            Git.status(res => {
                preview.call_action(`change_content`, { title: args.item.label, content: Tools.text_format(res.text) });
            });

        },
        load_status_files: ( args ) =>
        {
            if(!args.app) return;
            args.app.call_action(`toggle_preview`, false);
            let control = args.app.get_comp(`mode_control`);
            Git.status(res =>
                {
                    control.call_action(`resp:git_status`, res);
                });
        },
        add_file: ( args ) =>
        {
            if(!args.app) return;
            let control = args.app.get_comp(`mode_control`);
            Git.add_file(args.item.ref ? args.item.ref.name : args.item.name, res => 
                {
                    control.call_action(`resp:git_add_file`, args);
                    Git_Hook.Status.load_status_files( args );
                });
        },
        add_all: ( args ) =>
        {
            if(!args.app) return;
            let control = args.app.get_comp(`mode_control`);
            Git.add_all( res =>
                {
                    control.call_action(`resp:git_add_all`, args);
                    Git_Hook.Status.load_status_files( args );
                });
        },
        unstage_file: ( args ) =>
        {
            if(!args.app) return;
            let control = args.app.get_comp(`mode_control`);
            Git.reset_file(args.item.ref ? args.item.ref.name : args.item.name, res => 
                {
                    control.call_action(`resp:git_reset_file`, args);
                    Git_Hook.Status.load_status_files( args );
                });
        },
        unstage_all: ( args ) =>
        {
            if(!args.app) return;
            let control = args.app.get_comp(`mode_control`);
            Git.reset_all( res =>
                {
                    control.call_action(`resp:git_reset_all`, args);
                    Git_Hook.Status.load_status_files( args );
                });
        }
    },
    Commit:{
        new_commit: ( args ) =>
        {
            if(!args.app) return;
            let preview = args.app.get_comp(`preview`);
            args.app.call_action(`toggle_preview`, true);
            preview.call_action(`change_content`, { title: 'Commit', content: 'Insert commit message...' });
            args.app.call_action(`insert_mode`, input =>
                {
                    preview.call_action(`change_content`, { title: `Commit`, content: `Commiting changes...` });
                    if(!input) return;
                    if(!input.data) return;
                    let message = input.data;
                    Git.commit(message, res =>
                        {
                            preview.call_action(`change_content`, { title: `Commit`, content: Tools.text_format(res.text) });
                        });
                });
        }
    }
};

module.exports = Git_Hook;

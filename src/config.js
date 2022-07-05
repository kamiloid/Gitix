/*jshint esversion:8*/

const View_Config = {
    menu:{
        index: ' ',
        space: '  ',
        group:{
            open: '',
            close: '',
            item: '﬌'
        }
    },
};
const Nav_Manifest = {
    uix_rules: {
        git_status_actions: 'group'
    },
    main:{
        tree: [
            {
                name: 'start',
                label: 'Starting Git',
                action: 'enter',
                onOver: 'Api/Global/clear_preview',
                tree: [
                    { 
                        name: 'init', 
                        label: 'Git Init',
                        onOver: `Api/Start/check_local_repo`,
                        onEnter: `Api/Start/init_local_repo`
                    },
                    { 
                        name: 'clone', 
                        label: 'Git Clone',
                        onOver: `Api/Start/clone_remote_repo_preview`,
                        onEnter: `Api/Start/clone_remote_repo`
                    },
                ]
            },
            { 
                name: 'branches', 
                label: 'Git Branches',
                action: 'enter',
                onOver: 'Api/Branches/show_local_list',
                tree: [ 
                    { name: 'local_list', label: 'Local branches', onOver: 'Api/Branches/show_local_list', onEnter: 'Api/Branches/load_local_branches' },
                    { name: 'checkout', label: 'Checkout' },
                    { name: 'create_new_from', label: 'Create new from this branch' },
                    { name: 'delete', label: 'Delete' },
                ]
            },
            {
                name: 'status',
                label: 'Git Status',
                action: 'enter',
                onOver: 'Api/Status/check_status',
                tree: [
                    { name: 'manage_file', label: 'Manage file', onOver: `Api/Status/check_status`, onEnter: `Api/Status/load_status_files` },
                    { name: 'add_all', label: 'Add all', onEnter: 'Api/Status/add_all' },
                    { name: 'unstage_all', label: 'Unstage all', onEnter: 'Api/Status/unstage_all' }
                ]
            },
            {
                name: 'commits',
                label: 'Commits manager',
                action: 'enter',
                onOver: 'Api/Global/clear_preview',
                tree: [
                    { name: 'new_commit', label: 'New commit', onOver: 'Api/Commit/is_commitable', onEnter: 'Api/Commit/new_commit' },
                    { name: 'commit_list', label: 'Commits', onEnter: 'Api/Commit/show_commit_list' }
                ]
            },
            {
                name: 'transfering',
                label: 'Transfer manager',
                action: 'enter',
                onOver: 'Api/Global/clear_preview',
                tree: [
                    { name: 'fetch_all', label: 'Fetch all', onEnter: 'Api/Transaction/fetch_all' },
                    { name: 'pull_branch', label: 'Pull branch', onEnter: 'Api/Transaction/pull_current_branch' },
                    { name: 'push_branch', label: 'Push branch', onEnter: 'Api/Transaction/push_branch' }
                ]
            }
        ]
    },
    adds:{
        file_stages: [
            { name: 'untracked', label: 'Untracked files', actions: [
                { name: 'to_staged', label: 'Stage this file', onEnter: 'Api/Status/add_file' }
            ] },
            { name: 'unstaged', label: 'Unstaged files', actions:[
                { name: 'to_clear', label: 'Remove this file', onEnter: 'Api/Status/clear_file' },
                { name: 'to_staged', label: 'Stage this file', onEnter: 'Api/Status/add_file' }
            ]},
            { name: 'staged', label: 'Staged files', actions: [
                { name: 'to_clear', label: 'Remove this file', onEnter: 'Api/Status/clear_file' },
                { name: 'to_unstage', label: 'Unstage this file', onEnter: 'Api/Status/unstage_file' }
            ] }
        ]
    }
};

module.exports = {
    View_Config: View_Config,
    Nav_Manifest: Nav_Manifest
};

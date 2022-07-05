/*jshint esversion: 8*/
const Kix = require('kamiloid_cli_node');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const { _pwd, _dir } = require('../core/global');

const Git =
{
    check_local_repo: ( cback, dir = undefined ) =>
    {
        let cd = `cd ${ dir || _dir } && `;
        let cmd = `${ cd }[ -d ".git" ] && echo "true"`;
        exec( cmd, ( err, resp ) =>
        {
            let exist = Boolean(resp.replace(/\s/g, ''));
            if(cback)
                cback( { exist: exist, text: exist ? `Local repo exists!!` : `Local repo does not exist.` } );
        });
    },
    init: ( cback ) =>
    {
        let cd = `cd ${ _dir } && `;
        let cmd = `${ cd }git init`;
        exec( cmd, ( err, resp ) =>
        {
            if(cback)
                cback( { text: resp } );
        });
    },
    clone_repo: ( repo, cback ) =>
    {
        let cd = `cd ${ _dir } && `;
        let cmd = `${ cd }git clone ${ repo }`;
        exec( cmd, ( err, resp ) => {
            let cloned = false;
            let split = repo.split('/');
            if(Array.isArray(split) && split.length > 0)
            {
                let repo_name = split[split.length - 1].replace('.git', '');
                Git.check_local_repo( resp =>
                    {
                        cloned = resp.exist;
                        if(cback)
                            cback( { text: resp.text, cloned: cloned, repo: repo_name });
                    }, `${ _pwd }/${ repo_name }`);
                return;
            }
            if(cback)
                cback( { text: resp, cloned: cloned } );
        });
    },
    current_branch: ( cback ) =>
    {
        let cd = `cd ${ _dir } && `;
        let cmd = `${ cd }git branch --show-current`;
        exec(cmd, ( err, res ) =>
            {
                if(cback)
                    cback({ text: res });
            });
    },
    branch: ( cback ) =>
    {
        let cd = `cd ${ _dir } && `;
        let cmd = `${ cd }git branch`;
        exec( cmd, ( err, resp ) =>
        {
            let buffer = [];
            if(err) return;
            let split = resp.split(`\n`);
            for(let i of split)
            {
                if(i.trim() === '') continue;
                let branch = i.trim();
                let data = { name: branch, selected: false };
                if(branch.includes(`*`))
                    data = { name: branch.replace(`* `, ''), selected: true };
                buffer.push(data);
            }
            if(cback) cback({ data: buffer, text: resp });
        } );
    },
    status: ( cback ) =>
    {
        let cd = `cd ${ _dir } && `;
        let cmd = `${ cd }git status -s`;
        exec( cmd, ( err, resp ) =>
        {
            if(cback)
                cback(resp);
        } );
    },
    add_file: ( file, cback ) =>
    {
        let cd = `cd ${ _dir } && `;
        let cmd = `${ cd }git add ${ file }`;
        exec( cmd, ( err, resp ) =>
            {
                if(cback) cback({ text: resp });
            });
    },
    add_all: ( cback ) =>
    {
        let cd = `cd ${ _dir } && `;
        let cmd = `${ cd }git add .`;
        exec( cmd, ( err, resp ) =>
            {
                if(cback) cback({ text: resp });
            });
    },
    reset_file: ( file, cback ) =>
    {
        let cd = `cd ${ _dir } && `;
        let cmd = `${ cd }git reset ${ file }`;
        exec( cmd, ( err, resp ) =>
            {
                if(cback) cback({ text: resp });
            })
    },
    reset_all: ( cback ) =>
    {
        let cd = `cd ${ _dir } && `;
        let cmd = `${ cd }git reset`;
        exec( cmd, ( err, resp ) =>
            {
                if(cback) cback({ text: resp });
            });
    },
    commit: ( message, cback ) =>
    {
        let cd = `cd ${ _dir } && `;
        let cmd = `${ cd }git commit -m "${ message }"`;
        exec( cmd, ( err, resp ) => 
            {
                if(cback) cback({ text: resp });
            });
    },
    commits: ( cback ) =>
    {
        let cd = `cd ${ _dir } && `;
        let cmd = `${ cd }git log --pretty=format:"%h %s" --graph`;
        exec( cmd, ( err, res ) =>
            {
                if(cback) cback({ text: res });
            });
    },
    pull_current_branch: ( cback ) =>
    {
        let cd = `cd ${ _dir } && `;
        Git.current_branch( res =>
            {
                let cmd = `${ cd }git pull origin ${ res.text }`;
                exec( cmd, ( err, res2 ) =>
                    {
                        if(cback)
                            cback({ text: res2 });
                    });
            });
    },
    push_current_branch: ( cback ) =>
    {
        let cd = `cd ${ _dir } && `;
        Git.current_branch( res =>
            {
                let cmd = `${ cd }git push origin ${ res.text }`;
                exec( cmd, ( err, res2 ) =>
                    {
                        if(cback)
                            cback({ text: res2 });
                    });
            });
    }
};

module.exports = Git;

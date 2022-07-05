/*jshint esversion: 8*/
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
            let buffer = [];
            buffer.staged = [];
            buffer.untracked = [];
            buffer.unstaged = [];

            let split = resp.split(`\n`);
            for(let i of split)
            {
                if(i.trim() === '') continue;
                let file = i.trim();
                let type_match = file.match(/[A\s|A\s\s\|M\s|M\s\s|MM\s|\?\?\s|D\s|D\s\s|DD\s]+/gm);
                if(type_match.length <= 0) continue;
                let type = type_match[0];
                file = file.replace(type_match[0], '');
                if( ([' m', 'mm ', ' d', 'dd ']).includes(type.toLowerCase()) )
                    buffer.unstaged.push( { name: file, type: type.trim() } );
                else if( (['m ', 'd ', 'a ', 'a  ', 'd  ', 'm  ', 'am ']).includes(type.toLowerCase()) )
                    buffer.staged.push( { name: file, type: type.trim() } );
                else if( (['?? ', '??']).includes(type.toLowerCase()) )
                    buffer.untracked.push( { name: file, type: type.trim() } );
            }
            if(cback) cback({ data: buffer, text: resp });
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
    }
};

module.exports = Git;

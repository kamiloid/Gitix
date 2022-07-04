/*jshint esversion:8*/
const { Nav_Manifest } = require('../config');

const Git_model =
{
    Status:{
        bind_ui_status: ( res ) =>
        {
            let buffer = [];
            let stages = Nav_Manifest.adds.file_stages;
            for(let s of stages)
            {
                if(!res.data[s.name]) continue;
                let group = { name: s.name, label: s.label, caption: true, group: true, tree: [] };

                for(let f of res.data[s.name])
                {
                    let file = {
                        name: `${ f.name }`,
                        label: `${ f.name }`,
                    };
                    if(Nav_Manifest.uix_rules.git_status_actions === 'group')
                    {
                        file.caption = true;
                        file.group = true;
                    }else if(Nav_Manifest.uix_rules.git_status_actions === 'depth')
                    {
                        file.action = 'enter';
                    }
                    if(s.actions && Array.isArray(s.actions))
                    {
                        let actions = [];
                        for(let a of s.actions)
                        {
                            actions.push({
                                name: a.name,
                                label: a.label,
                                onEnter: a.onEnter,
                                ref: f,
                                refname: f.name
                            });
                        }
                        file.tree = actions;
                    }
                    group.tree.push(file);
                }
                buffer.push(group);
            }
            return buffer;
        }
    }
};

module.exports = Git_model;

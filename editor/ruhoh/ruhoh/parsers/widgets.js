Ruhoh.Parsers.Widgets = {
    // Process available widgets into widget dictionary.
    //
    // Returns Dictionary of widget data.
    generate: function () {
        var widgets = {};
        var list = this.widgets();
        for (var i=0;i<list.length;i++) {
            var name = list[i];
            var config = this.process_config(name);
            
            widgets[name] = {
                name: name,
                config: config,
                javascripts: this.process_javascripts(config,name),
                layout: this.process_layout(config,name)
            }
        }
        Ruhoh.Utils.report('Widgets', widgets, []);
        return widgets;
    },
    
    // Find the widgets.
    //
    // Returns Array of widget names.
    widgets: function () {
        var names = [];
        if (FileUtils.is_directory(Ruhoh.paths.widgets)) {
            FileUtils.cd(Ruhoh.paths.widgets,function(){
                names = names.concat( FileUtils.select("*") );
            });
        }
        if (FileUtils.is_directory(Ruhoh.paths.system_widgets)) {
            FileUtils.cd(Ruhoh.paths.system_widgets,function(){
                names = names.concat( FileUtils.select("*") );
            });
        }
        
        var hash = {};
        for (var i=0;i<names.length;i++) {
            if (FileUtils.is_directory(names[i])) {
                hash[FileUtils.basename(names[i])] = true;
            }
        }
        var unique = [];
        for (var key in hash) unique.push(key);
        return unique;
    },
    
    // Process the widget configuration params.
    //
    // Returns Hash of configuration params.
    process_config: function(widget_name) {
        var system_config = Ruhoh.Utils.parse_yaml_file(Ruhoh.paths.system_widgets, widget_name, Ruhoh.names.config_data) || {};
        var user_config = Ruhoh.Utils.parse_yaml_file(Ruhoh.paths.widgets, widget_name, Ruhoh.names.config_data) || {};
        var config = Ruhoh.Utils.deep_merge(system_config, user_config);
        config['layout'] = config['layout'] || widget_name;
        config['stylesheet'] = config['stylesheet'] || widget_name;
        return config;
    },
    
    // Process widget script dependencies.
    // Script dependencies may be set in the config.
    // Look for default script at: scripts/{widget_name}.js if no config.
    // If found, we include it, else no javascripts will load.
    //
    // Returns Array of script filenames to load.
    process_javascripts: function (config, widget_name) {
        var scripts = config[Ruhoh.names.javascripts] ? hashToArray(config[Ruhoh.names.javascripts]) : [];
        
        //  Try for the default script if no config.
        if (scripts.length==0) {
            var script_file = FileUtils.join(Ruhoh.paths.widgets, widget_name, Ruhoh.names.javascripts, widget_name+".js");
            if (FileUtils.exist(script_file)) {
                scripts.push(widget_name+".js");
            } else {
                script_file = FileUtils.join(Ruhoh.paths.system_widgets, widget_name, Ruhoh.names.javascripts, widget_name+".js");
                if (FileUtils.exist(script_file)) scripts.push(widget_name+".js");
            }
        }
        return scripts;
    },
    
    // Determine and process the correct widget layout.
    // The layout may be manually configured by the user,
    // else system defaults will be used.
    // Layouts cascade from: theme -> blog -> system
    //
    // Returns String of rendered layout content.
    process_layout: function(config, widget_name) {
        var layout;
        var layout_path = FileUtils.join(widget_name, 'layouts', config['layout']+".html");
        var paths = [
            FileUtils.join(Ruhoh.paths.theme_widgets, layout_path),
            FileUtils.join(Ruhoh.paths.widgets, layout_path),
            FileUtils.join(Ruhoh.paths.system_widgets, layout_path)
        ];
        
        for (var i=0;i<paths.length;i++) {
            var path = paths[i];
            layout = path;
            if (FileUtils.exist(path)) break; 
        }
        if (!layout) return '';
        var content = FileUtils.open(layout);
        return Mustache.render(content, {'config' : config});
   }
}


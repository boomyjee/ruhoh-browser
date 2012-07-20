// Collect all the javascripts.
// Themes explicitly define which javascripts to load via theme.yml.
// Additionally, widgets may register javascript dependencies, which are resolved here.
Ruhoh.Parsers.Javascripts = {
    // Generates mappings to all registered javascripts.
    // Returns Hash with layout names as keys and Array of asset Objects as values
    generate: function () {
        var theme_config = this.theme_config();
        var assets = this.theme_javascripts(theme_config);
        assets[Ruhoh.names.widgets] = this.widget_javascripts(theme_config);
        return assets;
    },
    
    theme_javascripts: function (theme_config) {
        if (!theme_config[Ruhoh.names.javascripts]) return {};
        var assets = {};
        
        for (var key in theme_config[Ruhoh.names.javascripts]) {
            var value = theme_config[Ruhoh.names.javascripts][key];
            if (key == Ruhoh.names.widgets) continue; // Widgets are handled separately.
            
            assets[key] = hashToArray(value).map(function(v) {
                return {
                    "url" : Ruhoh.urls.theme_javascripts+"/"+v,
                    "id" : FileUtils.join(Ruhoh.paths.theme_javascripts, v)
                }
            });
        }
        return assets;
    },    
    
    // Notes:
    //   The automatic script inclusion is currently handled within the widget parser.
    //   This differs from the auto-stylesheet inclusion relative to themes, 
    //   which is handled in the stylesheet parser.
    //   Make sure there are some standards with this.
    widget_javascripts: function (theme_config) {
        var assets = [];
        for (var key in Ruhoh.DB.widgets) {
            var widget = Ruhoh.DB.widgets;
            if (!widget[Ruhoh.names.javascripts]) continue;
            assets += hastToArray(widget[Ruhoh.names.javascripts]).map(function (path) {
                return {
                    "url" : [Ruhoh.urls.widgets, widget['name'], Ruhoh.names.javascripts, path].join('/'),
                    "id"  : File.join(Ruhoh.paths.widgets, widget['name'], Ruhoh.names.javascripts, path)
                } 
            });
        }
        return assets;
    },
    
    theme_config: function () {
        var theme_config = Ruhoh.Utils.parse_yaml_file(Ruhoh.paths.theme_config_data);
        if (!theme_config) {
            Ruhoh.Friend.yellow("WARNING: theme.yml config file not found:");
            Ruhoh.Friend.yellow("  #{Ruhoh.paths.theme_config_data}");
            return {}
        }
        if (!theme_config) return {};
        return theme_config;
    }
}
      

// Collect all registered stylesheets.
// Themes explicitly define which stylesheets to load via theme.yml.
// All styling is managed by the theme, including widget styles.
// If the theme provides widget stylesheets they will load automatically.
// theme.yml may also specify an explicit widget stylesheet to load.
Ruhoh.Parsers.Stylesheets = {
    
    // Generates mappings to all registered stylesheets.
    // Returns Hash with layout names as keys and Array of asset Objects as values
    generate:function () {
        var theme_config = this.theme_config();
        var assets = this.theme_stylesheets(theme_config);
        assets[Ruhoh.names.widgets] = this.widget_stylesheets(theme_config);
        return assets;
    },
    
    // Create mappings for stylesheets registered to the theme layouts.
    // Themes register stylesheets relative to their layouts.
    // Returns Hash with layout names as keys and Array of asset Objects as values.
    theme_stylesheets: function (theme_config) {
        if (!theme_config[Ruhoh.names.stylesheets]) return {};
        var assets = {};
        
        for (var key in theme_config[Ruhoh.names.stylesheets]) {
            var value = theme_config[Ruhoh.names.stylesheets][key];
            if (key == Ruhoh.names.widgets) continue; // Widgets are handled separately.
            
            assets[key] = hashToArray(value).map(function(v) {
                return {
                    "url" : Ruhoh.urls.theme_stylesheets+"/"+v,
                    "id" : FileUtils.join(Ruhoh.paths.theme_stylesheets, v)
                }
            });
        }
        return assets;
    },
    
    // Create mappings for stylesheets registered to a given widget.
    // A theme may provide widget stylesheets which will load automatically,
    // provided they adhere to the default naming rules.
    // Themes may also specify an explicit widget stylesheet to load.
    // 
    // Returns Array of asset objects.
    widget_stylesheets: function(theme_config) {
        var assets = [];
        for (var name in Ruhoh.DB.widgets) {
            var default_name = name+".css";
            try {
                var stylesheet = theme_config[Ruhoh.names.stylesheets][Ruhoh.names.widgets][name];
            } catch (e) {
                stylesheet = default_name;
            }
            stylesheet =  stylesheet || default_name;
            var file = FileUtils.join(Ruhoh.paths.theme_widgets, name, Ruhoh.names.stylesheets, stylesheet);
            if (!FileUtils.exist(file)) continue;
            assets.push({
                "url" : [Ruhoh.urls.theme_widgets, name, Ruhoh.names.stylesheets, stylesheet].join('/'),
                "id" : file
            });
        }
        return assets;
    },
    
    theme_config: function () {
        var theme_config = Ruhoh.Utils.parse_yaml_file(Ruhoh.paths.theme_config_data);
        if (!theme_config) {
            Ruhoh.Friend.yellow("WARNING: theme.yml config file not found:");
            Ruhoh.Friend.yellow("  #{Ruhoh.paths.theme_config_data}");
            return {};
        }
        if (!theme_config) return {};
        return theme_config;
    }
}
      

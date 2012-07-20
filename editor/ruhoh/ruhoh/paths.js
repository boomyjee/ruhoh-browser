// Structured container for all paths to relevant directories and files in the system.
// Paths are based on the ruhohspec for the Universal Blog API.
// Additionally we store some system (gem) level paths for cascading to default functionality,
// such as default widgets, default dashboard view, etc.
Ruhoh.Paths = {
    generate: function (config,base) {
        var paths = {};
        paths.base                = base;
        paths.config_data         = FileUtils.join(base, Ruhoh.names.config_data)
        paths.pages               = FileUtils.join(base, Ruhoh.names.pages)
        paths.posts               = FileUtils.join(base, Ruhoh.names.posts)
        paths.partials            = FileUtils.join(base, Ruhoh.names.partials)
        paths.media               = FileUtils.join(base, Ruhoh.names.media)
        paths.widgets             = FileUtils.join(base, Ruhoh.names.widgets)
        paths.compiled            = FileUtils.join(base, Ruhoh.names.compiled)
        paths.dashboard_file      = FileUtils.join(base, Ruhoh.names.dashboard_file)
        paths.site_data           = FileUtils.join(base, Ruhoh.names.site_data)
        paths.themes              = FileUtils.join(base, Ruhoh.names.themes)
        paths.plugins             = FileUtils.join(base, Ruhoh.names.plugins)
        
        paths.theme               = FileUtils.join(base, Ruhoh.names.themes, config.theme)
        paths.theme_dashboard_file= FileUtils.join(paths.theme, Ruhoh.names.dashboard_file)
        paths.theme_config_data   = FileUtils.join(paths.theme, Ruhoh.names.theme_config)
        paths.theme_layouts       = FileUtils.join(paths.theme, Ruhoh.names.layouts)
        paths.theme_stylesheets   = FileUtils.join(paths.theme, Ruhoh.names.stylesheets)
        paths.theme_javascripts   = FileUtils.join(paths.theme, Ruhoh.names.javascripts)
        paths.theme_media         = FileUtils.join(paths.theme, Ruhoh.names.media)
        paths.theme_widgets       = FileUtils.join(paths.theme, Ruhoh.names.widgets)
        paths.theme_partials      = FileUtils.join(paths.theme, Ruhoh.names.partials)
        
        if (!this.theme_is_valid(paths)) return false;
        
        paths.system_dashboard_file = FileUtils.join(Ruhoh.Root, Ruhoh.names.dashboard_file)
        paths.system_widgets        = FileUtils.join(Ruhoh.Root, Ruhoh.names.widgets)
        
        return paths;
    },
    
    theme_is_valid: function (paths) {
        if (FileUtils.is_directory(paths.theme)) return true;
        Ruhoh.log.error("Theme directory does not exist: "+paths.theme)
        return false;
    }
}
    

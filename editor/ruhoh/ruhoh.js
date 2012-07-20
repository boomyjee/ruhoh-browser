var Ruhoh_core = {
    
    Root: FileApi.root,
    
    names: {
        assets : 'assets',
        config_data : 'config.yml',
        compiled : 'compiled',
        dashboard_file : 'dash.html',
        layouts : 'layouts',
        media : 'media',
        pages : 'pages',
        partials : 'partials',
        plugins : 'plugins',
        posts : 'posts',
        javascripts : 'javascripts',
        site_data : 'site.yml',
        stylesheets : 'stylesheets',
        themes : 'themes',
        theme_config : 'theme.yml',
        widgets : 'widgets',
        widget_config : 'config.yml'
    },
    log: new Ruhoh.Logger(),
    
    setup: function (opts) {
        opts = opts || {};
        
        this.reset();
        this.log.log_file = opts.log_file || undefined;
        this.base = opts.source || this.base;
        
        this.config = Ruhoh.Config.generate(this.names.config_data);
        this.paths  = Ruhoh.Paths.generate(this.config,this.base);
        this.urls   = Ruhoh.Urls.generate(this.config);
        
        if (!this.config || !this.paths || !this.urls) return false;
        
        if (opts.enable_plugins) this.setup_plugins();
        return true;
    },
    
    reset: function () {
        this.base = FileUtils.getwd();
        this.Root = this.base.split("/");
        this.Root.pop();
        this.Root = this.Root.join("/")+"/editor/ruhoh";
    },
    
    setup_plugins: function () {
        // TODO: write method
    },
    
    ensure_setup: function () {
        if (!this.config || !this.paths) throw 'Ruhoh has not been setup. Please call: Ruhoh.setup';
    }
}
for (var key in Ruhoh_core) Ruhoh[key] = Ruhoh_core[key];
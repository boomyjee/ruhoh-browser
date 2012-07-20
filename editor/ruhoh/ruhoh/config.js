// Structured container for global configuration parameters.
Ruhoh.Config = {
    generate: function (path_to_config) {
        var site_config = Ruhoh.Utils.parse_yaml_file(path_to_config);
        if (!site_config) {
            Ruhoh.log.error("Empty site_config.\nEnsure ./"+Ruhoh.names.config_data+" exists and contains valid YAML");
            return false;
        }
        
        var theme = site_config.theme ? site_config.theme.toString().replace(/\s/g,'') : '';
        if (theme=="") {
            Ruhoh.log.error("Theme not specified in "+Ruhoh.names.config_data);
            return false;
        }
        
        var config = {};
        config.theme = theme;
        config.env = site_config.env || undefined;
        
        config.rss_limit = site_config.rss ? site_config.rss.limit : 20;
        
        config.posts_permalink = site_config.posts ? site_config.posts.permalink : undefined;
        config.posts_layout = site_config.posts ? site_config.posts.layout : undefined;
        config.posts_layout = config.posts_layout || 'post';
        
        var excluded_posts = site_config.posts ? site_config.posts.excluded : undefined;
        config.posts_exclude = (excluded_posts || []).map(function(node){return new RegExp(node);});
        
        config.pages_permalink = site_config.pages ? site_config.pages.permalink : undefined;
        config.pages_layout = site_config['pages'] ? site_config.pages['layout'] : undefined;
        config.pages_layout = config.pages_layout || 'page';
        
        var excluded_pages = site_config['pages'] ? site_config.pages['exclude'] : undefined;
        config.pages_exclude = (excluded_pages || []).map(function(node){return new RegExp(node);});
        
        return config;
    }
}
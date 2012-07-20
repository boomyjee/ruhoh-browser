// Structured container for all pre-defined URLs in the system.
// These URLs are used primarily for static assets in development mode.
// When compiling, all urls are of course mapped literally to the asset filepaths.
Ruhoh.Urls = {
    generate: function (config) {
        var urls = {};
        urls.media                = this.to_url(Ruhoh.names.assets, Ruhoh.names.media)
        urls.widgets              = this.to_url(Ruhoh.names.assets, Ruhoh.names.widgets)
        urls.dashboard            = this.to_url(Ruhoh.names.dashboard_file.split('.')[0])
        
        urls.theme                = this.to_url(Ruhoh.names.assets, config.theme)
        urls.theme_media          = this.to_url(Ruhoh.names.assets, config.theme, Ruhoh.names.media)
        urls.theme_javascripts    = this.to_url(Ruhoh.names.assets, config.theme, Ruhoh.names.javascripts)
        urls.theme_stylesheets    = this.to_url(Ruhoh.names.assets, config.theme, Ruhoh.names.stylesheets)
        urls.theme_widgets        = this.to_url(Ruhoh.names.assets, config.theme, Ruhoh.names.widgets)
        return urls;
    },
    
    to_url: function () {
        return '/' + [].join.call(arguments,'/');
    },
    
    to_url_slug: function (title) {
        return escape(this.to_slug(title));
    },
    
    // My Post Title ===> my-post-title
    to_slug: function (title) {
        title = title.toString().toLowerCase();
        return title.replace(/^\-+/g, '').replace(/\-+$/g, '').replace(/\-+/g, '-');
    }
}
Ruhoh.Templaters.AssetHelpers = {
    assets: function () {
        var method = "assets_"+Ruhoh.config.env;
        if (!this[method]) return '';
        return this[method]();
    },
    
    assets_preview: function () {
        var buffer = '';
        var master_layout = this.context['page']['master_layout'];
        var sub_layout = this.context['page']['sub_layout'];
        
        var stylesheets = Ruhoh.DB.stylesheets[master_layout] || [];
        stylesheets = stylesheets.concat(Ruhoh.DB.stylesheets[sub_layout] || []);
        stylesheets = stylesheets.concat(Ruhoh.DB.stylesheets[Ruhoh.names.widgets] || []);
        
        function rand() {
            var self = Ruhoh.Templaters.AssetHelpers;
            if (self.rand) return self.rand;
            return self.rand = Math.floor(Math.random()*9007199254740992);
        }
        
        for (var i=0;i<stylesheets.length;i++) {
            var style = stylesheets[i];
            buffer += "<link href=\""+style['id']+"?"+rand()+"\" type=\"text/css\" rel=\"stylesheet\" media=\"all\">\n";
        }
        buffer += "\n";
        
        scripts = Ruhoh.DB.javascripts[master_layout] || [];
        scripts = scripts.concat(Ruhoh.DB.javascripts[sub_layout] || []);
        scripts = scripts.concat(Ruhoh.DB.javascripts[Ruhoh.names.widgets] || []);
        
        for (var i=0;i<scripts.length;i++) {
            var script = scripts[i];
            buffer += "<script src=\""+script['id']+"?"+rand()+"\"></script>\n";
        }
        return buffer;
    },
      
    assets_development: function () {
        var buffer = '';
        var master_layout = this.context['page']['master_layout'];
        var sub_layout = this.context['page']['sub_layout'];
        
        var stylesheets = Ruhoh.DB.stylesheets[master_layout] || [];
        stylesheets = stylesheets.concat(Ruhoh.DB.stylesheets[sub_layout] || []);
        stylesheets = stylesheets.concat(Ruhoh.DB.stylesheets[Ruhoh.names.widgets] || []);
        
        function rand() {
            return Math.floor(Math.random()*9007199254740992);
        }
        
        for (var i=0;i<stylesheets.length;i++) {
            var style = stylesheets[i];
            buffer += "<link href=\""+style['url']+"?"+rand()+"\" type=\"text/css\" rel=\"stylesheet\" media=\"all\">\n";
        }
        buffer += "\n";
        
        scripts = Ruhoh.DB.javascripts[master_layout] || [];
        scripts = scripts.concat(Ruhoh.DB.javascripts[sub_layout] || []);
        scripts = scripts.concat(Ruhoh.DB.javascripts[Ruhoh.names.widgets] || []);
        
        for (var i=0;i<scripts.length;i++) {
            var script = scripts[i];
            buffer += "<script src=\""+script['url']+"?"+rand()+"\"></script>\n";
        }
        return buffer;
    },
      
    // TODO: Implement this for real.
    assets_production: function () {
        return this.assets_development();
    }
}
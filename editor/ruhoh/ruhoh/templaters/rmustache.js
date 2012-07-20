Ruhoh.Templaters.RMustache = {
    render: function (tpl,view) {
        var me = this;
        var key;
        for (key in Ruhoh.Templaters.AssetHelpers)
            view[key] = Ruhoh.Templaters.AssetHelpers[key];
        
        for (key in Ruhoh.Templaters.BaseHelpers)
            view[key] = Ruhoh.Templaters.BaseHelpers[key];
        
        view['context'] = view;
        
        var extra = {
            content: function () {
                var pc = this.get_page_content();
                var content = pc[0], id = pc[1];
                var content = me.render(content,view);
                return Ruhoh.Converter.convert(content, id);
            },
            
            get_page_content: function () {
                var id = this.context['id'];
                id = id || this.context['page']['id'];
                if (!id) return '';
                if (!new RegExp("^"+Ruhoh.names.posts).test(id))
                    id = Ruhoh.names.pages+"/"+id;
        
                return [Ruhoh.Utils.parse_page_file(Ruhoh.paths.base, id)['content'], id];
            },
      
            widget: function(name) {
                if (this.context['page'][name.toString()].toString() == 'false') return '';
                return Ruhoh.DB.widgets[name.toString()]['layout'];
            }
        }
            
        for (key in extra) 
            view[key] = extra[key];
        
        var ctx = Mustache.Context.make(view);
        
        ctx.lookup = function (name) {
            var sup = Mustache.Context.prototype.lookup;
            if (name.toString().indexOf("?")==-1) return sup.call(this,name);
            
            var parts = name.toString().split("?");
            var context = parts[0];
            var helper = parts[1];
            
            context = sup.call(this,context);
            if (this.view[helper]) 
                return this.view[helper].call(this.view,context);
            else
                return context;
        }
            
        return Mustache.render(tpl,ctx,Ruhoh.DB.partials);
    }
}
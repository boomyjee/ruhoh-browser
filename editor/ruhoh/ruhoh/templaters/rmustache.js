Ruhoh.Templaters.RMustache = {
    
    context: function () {
        var view = {
            content: function () {
                var pc = this.get_page_content();
                var content = pc[0], id = pc[1];
                var content = Ruhoh.Templaters.RMustache.render(content,this.context);
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
        };
        
        var key;
        for (key in Ruhoh.Templaters.AssetHelpers)
            view[key] = Ruhoh.Templaters.AssetHelpers[key];
        
        for (key in Ruhoh.Templaters.BaseHelpers)
            view[key] = Ruhoh.Templaters.BaseHelpers[key];
        
        for (key in view) {
            var f = view[key];
            (function(f){
                view[key] = function () {
                    if (this==view) {
                        return f.apply(view,arguments); 
                    } else {
                        view.context = this;
                        return f.apply(view,arguments); 
                    }
                }
            })(f);
        }
        
        return new Mustache.Context(view);
    },
    
    render: function (tpl,view) {
        if (!this.top_context) this.top_context = this.context();

        var me = this;
        var ctx = new Mustache.Context(view,this.top_context);
        ctx.lookup = function (name) {
            var sup = Mustache.Context.prototype.lookup;
            if (name.toString().indexOf("?")==-1) return sup.call(this,name);
            
            var parts = name.toString().split("?");
            var context = parts[0];
            var helper = parts[1];
            
            context = sup.call(this,context);

            if (me.top_context.view[helper]) 
                return me.top_context.view[helper].call(this.view,context);
            else
                return context;
        }
        return Mustache.render(tpl,ctx,Ruhoh.DB.partials);
    }
}
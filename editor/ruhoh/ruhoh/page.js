Ruhoh.Page = $.Class.extend({
    init: function () {
        this.templater = Ruhoh.Templaters.RMustache;
    },
    change: function (id) {
        this.reset();
        this.path = id;
        if (new RegExp("^"+Ruhoh.names.posts).test(id)) {
            this.data = Ruhoh.DB.posts.dictionary[id];
        } else {
            this.path = Ruhoh.names.pages+"/"+id;
            this.data = Ruhoh.DB.pages[id];
        }
        if (!this.data) throw "Page "+id+" not found in database";
        this.id = id;
    },
    render: function () {
        this.ensure_id();
        this.process_layouts();
        return this.templater.render(this.expand_layouts(),this.payload());
    },
    
    process_layouts: function () {
        this.ensure_id();
        if (this.data.layout) {
            this.sub_layout = Ruhoh.DB.layouts[this.data.layout];
            if (!this.sub_layout) throw "Layout does not exist: " + this.data.layout;
        }
        
        if (this.sub_layout && this.sub_layout.data.layout) {
            this.master_layout = Ruhoh.DB.layouts[this.sub_layout.data.layout];
            if (!this.master_layout) throw "Layout does not exist: " + this.sub_layout.data.layout;
        }
        
        this.data.sub_layout = this.sub_layout['id'] || undefined;
        this.data.master_layout = this.master_layout['id'] || undefined;
        return data;
    },

    // Expand the layout(s).
    // Pages may have a single master_layout, a master_layout + sub_layout, or no layout.
    expand_layouts: function () {
        if (this.sub_layout) {
            var layout = this.sub_layout.content;
            
            // If a master_layout is found we need to process the sub_layout
            // into the master_layout using mustache.
            if (this.master_layout && this.master_layout.content) {
                var payload = this.payload();
                payload.content = layout;
                layout = this.templater.render(this.master_layout.content,payload);
            }
        } else {
            // Minimum layout if no layout defined.
            var layout = '{{{content}}}'             
        }
        return layout;
    },
    
    payload: function () {
        this.ensure_id();
        var payload = clone(Ruhoh.DB.payload());
        payload.page = this.data;
        return payload;
    },
    
    // Provide access to the page content.
    content: function () {
        this.ensure_id();
        Ruhoh.Utils.parse_page_file(Ruhoh.paths.base,this.path).content;
    },
    
    // Public: Formats the path to the compiled file based on the URL.
    //
    // Returns: [String] The relative path to the compiled file for this page.
    compiled_path: function () {
        this.ensure_id();
        var path = unescape(this.data.url).replace(/^\//g, '') // strip leading slash
        if (path=="") path = "index.html";
        if (!/\.\w+$/.test(path)) path += '/index.html';
        return path;
    },
    
    reset: function () {
        this.id = undefined;
        this.data = undefined;
        this.content = undefined;
        this.sub_layout = undefined;
        this.master_layout = undefined;
    },
    
    ensure_id: function () {
        if (!this.id)
            throw '@page ID is null: ID must be set via page.change(id) or page.change_with_url(url)';
    }
});
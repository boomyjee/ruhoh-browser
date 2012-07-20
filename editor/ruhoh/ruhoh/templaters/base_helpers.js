Ruhoh.Templaters.BaseHelpers = {
    partial: function(name) {
        var p = Ruhoh.DB.partials[name.toString()];
        if (!p) Ruhoh.Friend.yellow("partial not found: '"+name+"'");
        return p;
    },

    // Truncate the page content relative to a line_count limit.
    // This is optimized for markdown files in which content is largely
    // blocked into chunks and separating by blank lines.
    // The line_limit truncates content based on # of content-based lines,
    // so blank lines don't count toward the limit.
    // Always break the content on a blank line only so result stays formatted nicely.
    summary: function () {
        var pc = this.get_page_content();
        var content = pc[0]; var id = pc[1];
        try {
            var line_limit = parseInt(self.context['site']['config']['posts']['summary_lines']);
        } catch (e) {
            line_limit = false;
        }
        line_limit = line_limit || 20;
        
        var line_count = 0;
        var line_breakpoint = content.lines.count;
        
        var lines = content.lines();
        for (var i=0;i<lines.length;i++) {
            var line = lines[i];
            if (/^\s*$/.test(line)) { // line with only whitespace
                if (line_count >= line_limit) {
                    line_breakpoint = i;
                    break;
                }
            } else {
                line_count += 1;
            }
        }
        
        content = hashToArray(content.lines).slice(0, line_breakpoint).join("");
        content = this.render(content);
        
        return Ruhoh.Converter.convert(content, id);
    },
    
    pages: function () {
        var pages = [];
        for (var key in this.context.db.pages) pages.push(this.context.db.pages[key]);
        this.mark_active_page(pages);
        return pages;
    },
      
    posts: function () {
        return this.to_posts(this.context['db']['posts']['chronological']);
    },
      
    posts_latest: function () {
        try { 
            var latest = parseInt(this.context['site']['config']['posts']['latest']); 
        } catch (e) {
            latest = null;
        }
        latest = latest || 10;
        return (latest > 0) ? this.posts().slice(0, latest) : this.posts;
    },
      
    categories: function () {
        var cats = [];
        for (var key in this.context.db.posts.categories) cats.push(this.context.db.posts.categories[key]);
        return cats;
    },
      
    tags: function () {
        return hashToArray(this.context['db']['posts']['tags']);
    },
      
    raw_code: function (sub_context) {
        var code = sub_context.replace(/\{/g, '&#123;').replace(/\}/g, '&#125;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return "<pre><code>"+code+"</code></pre>";
    },
      
    debug: function (sub_context) {
        Ruhoh.Friend.yellow("?debug:");
        Ruhoh.Friend.magenta(sub_context.class);
        Ruhoh.Friend.cyan(sub_context.inspect);
        
        return "<pre>"+sub_context.class+"\n"+sub_context.pretty_inspect+"</pre>";
    },

    to_posts: function(sub_context) {
        var posts = [];
        for (var i=0;i<sub_context.length;i++) {
            var id = sub_context[i];
            var post = this.context['db']['posts']['dictionary'][id];
            if (post) posts.push(post);
        }
        return posts;
    },

    to_pages: function(sub_context) {
        var pages = [];
        for (var i=0;i<sub_context.length;i++) {
            var id = sub_context[i];
            var page = this.context['db']['pages'][id];
            if (page) pages.push(page);
        }
        return this.mark_active_page(pages);
    },
      
    to_categories: function (sub_context) {
        var cats = [];
        for (var i=0;i<sub_context.length;i++) {
            var id = sub_context[i];
            var cat = this.context['db']['posts']['categories'][id];
            if (cat) cats.push(cat);
        }
        return cats;
    },
      
    to_tags: function(sub_context) {
        var tags = [];
        for (var i=0;i<sub_context.length;i++) {
            var id = sub_context[i];
            var tag = this.context['db']['posts']['tags'][id];
            if (tag) tags.push(tag);
        }
        return tags;
    },
      
    next: function(sub_context) {
        if (typeof(sub_context)!="string" || !sub_context) return;
        var id = sub_context.id ? sub_context.id : sub_context;
        if (!id) return;
        var index = this.context['db']['posts']['chronological'].indexOf(id);
        if (index==-1 || index<1) return;
        var next_id = this.context['db']['posts']['chronological'][index-1];
        if (!next_id) return;
        return this.to_posts([next_id]);
    },
      
    previous: function(sub_context) {
        if (typeof(sub_context)!="string" || !sub_context) return;
        var id = sub_context.id ? sub_context.id : sub_context;
        if (!id) return;
        var index = this.context['db']['posts']['chronological'].indexOf(id);
        if (index==-1) return;
        var prev_id = this.context['db']['posts']['chronological'][index+1];
        if (!prev_id) return;
        return this.to_posts([prev_id]);
    },
            
    // Marks the active page if exists in the given pages Array
    mark_active_page: function(pages) {
        for (var i=0;i<pages.length;i++) {
            var page = pages[i];
            if (page.id != this.context.page.id) continue;
            var active_page = clone(page);
            active_page['is_active_page'] = true;
            pages[i] = active_page;
        }
        return pages;
    }
}
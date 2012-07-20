Ruhoh.Parsers.Pages = {
    generate: function () {
        Ruhoh.ensure_setup();
        
        var pages = this.files();
        var dictionary = {};
        
        for (var i=0;i<pages.length;i++) {
            var filename = pages[i];
            var id = this.make_id(filename);
            var parsed_page = '';
            
            FileUtils.cd(Ruhoh.paths.base,function(){
                parsed_page = Ruhoh.Utils.parse_page_file(filename);
            });
            
            parsed_page.data.id = id;
            parsed_page.data.url = this.permalink(parsed_page.data);
            parsed_page.data.title = parsed_page.data.title || this.to_title(filename);
            if (parsed_page.data.layout==undefined)
                parsed_page.data.layout = Ruhoh.config.pages_layout;
            
            dictionary[id] = parsed_page['data'];
        }
        Ruhoh.Utils.report('Pages',dictionary,[]);
        return dictionary;
    },
    
    files: function () {
        var me = this;
        var res;
        FileUtils.cd(Ruhoh.paths.base,function(){
            res = FileUtils.select(Ruhoh.names.pages+"/**/*.*",function (filename) {
                return me.is_valid_page(filename);
            });
        });
        return res;
    },
    
    is_valid_page: function (filepath) {
        if (FileUtils.is_directory(filepath)) return false;
        if (filepath[0]==".") return false;
        for (var i=0;i<Ruhoh.config.pages_exclude.length;i++) {
            if (Ruhoh.config.pages_exclude[i].test(filepath)) return false;
        }
        return true;
    },
    
    make_id: function (filename) {
        return filename.replace(new RegExp("^"+Ruhoh.names.pages+"/","g"),'');
    },
    
    to_title: function (filename) {
        var name = FileUtils.basename( filename, FileUtils.extname(filename) );
        if (name=='index' && filename.indexOf('/')!=-1)
            name = filename.split("/")[-2];
        return name
            .replace(/\b\w/g,function(s){return s.toUpperCase()});
    },
    
    // Build the permalink for the given page.
    // Only recognize extensions registered from a 'convertable' module.
    // This means 'non-convertable' extensions should pass-through.

    // Returns [String] the permalink for this page.
    permalink: function (page) {
        var ext = FileUtils.extname(page['id']);
        var name = page.id.replace(new RegExp(ext+"$",'g'), '');
        if (Ruhoh.Converter.extensions().indexOf(ext)!=-1) ext = ".html";
        
        var url = name.split("/").map(function(p){
            return Ruhoh.Urls.to_url_slug(p);
        }).join("/");
        
        url = ("/"+url+ext).replace(/\/index.html$/g, '');
        if (page.permalink=='pretty' || Ruhoh.config.pages_permalink == 'pretty')
            url = url.replace(/\.html$/g, '');
        if (url=="") url = "/";
        return url;
    }
}
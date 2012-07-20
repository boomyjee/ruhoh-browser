Ruhoh.Parsers.Payload = {
    generate: function () {
        return {
            "db" : {
                "pages" :  Ruhoh.DB.pages,
                "posts" :  this.determine_category_and_tag_urls(),
            },
            "site" : Ruhoh.DB.site,
            'page' : {},
            "urls" : {
                "theme_stylesheets" : Ruhoh.urls.theme_stylesheets,
                "theme_javascripts" : Ruhoh.urls.theme_javascripts,
                "theme_media" : Ruhoh.urls.theme_media,
                "media" : Ruhoh.urls.media,
            }
        }
    },
    
    // This is an ugly hack to determine the proper category and tag urls.
    // TODO: Refactor this out.
    determine_category_and_tag_urls: function () {
        if (!Ruhoh.DB.routes || !Ruhoh.DB.posts) return undefined;
        var categories_url;
        for (var url in {'/categories':1, '/categories.html':1}) {
            categories_url = url;
            if (url in Ruhoh.DB.routes) break;
        }
        
        for (var key in Ruhoh.DB.posts.categories) {
            var value = Ruhoh.DB.posts.categories[key];
            Ruhoh.DB.posts['categories'][key]['url'] = categories_url+"#"+value['name']+"-ref";
        }
        
        var tags_url;
        for (var url in {'/tags':1, '/tags.html':1}) {
            tags_url = url;
            if (url in Ruhoh.DB.routes) break;
        }
        
        for (var key in Ruhoh.DB.posts.tags) {
            var value = Ruhoh.DB.posts.tags[key];
            Ruhoh.DB.posts['tags'][key]['url'] = tags_url+"#"+value['name']+"-ref";
        }
        return Ruhoh.DB.posts;
    }
}
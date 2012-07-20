Ruhoh.Parsers.Routes = {
    generate: function () {
        var routes = {};
        for (var key in Ruhoh.DB.pages) {
            var page = Ruhoh.DB.pages[key];
            routes[page.url] = page.id;
        }
        for (var key in Ruhoh.DB.posts.dictionary) {
            var page = Ruhoh.DB.posts.dictionary[key];
            routes[page.url] = page.id;
        }
        return routes;
    }
}
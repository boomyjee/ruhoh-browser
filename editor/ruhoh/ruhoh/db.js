Ruhoh.DB = {
    WhiteList : ['site','posts','pages','routes','layouts','partials','widgets','stylesheets','javascripts','_payload'],
    update: function (name) {
        switch (name) {
            case 'site':
                this[name] = Ruhoh.Parsers.Site.generate(); break;
            case 'routes':
                this[name] = Ruhoh.Parsers.Routes.generate(); break;
            case 'posts':
                this[name] = Ruhoh.Parsers.Posts.generate(); break;
            case 'pages':
                this[name] = Ruhoh.Parsers.Pages.generate(); break;
            case 'layouts':
                this[name] = Ruhoh.Parsers.Layouts.generate(); break;
            case 'partials':
                this[name] = Ruhoh.Parsers.Partials.generate(); break;
            case 'widgets':
                this[name] = Ruhoh.Parsers.Widgets.generate(); break;
            case 'stylesheets':
                this[name] = Ruhoh.Parsers.Stylesheets.generate(); break;
            case 'javascripts':
                this[name] = Ruhoh.Parsers.Javascripts.generate(); break;
            case '_payload':
                this[name] = Ruhoh.Parsers.Payload.generate(); break;
            default:
                throw "Data type: '"+name+"' is not a valid data type.";
        }
    },
    
    // Always regenerate a fresh payload since it
    // references other generated data.
    payload: function () {
        this.update('_payload');
        return this._payload;
    },
      
    all_pages: function () {
        return this.posts['dictionary'].concat(this.pages);
    },
    
    update_all: function () {
        for (var i=0;i<this.WhiteList.length;i++) {
            var name = this.WhiteList[i];
            this.update(name);
        }
    }
}
Ruhoh.Parsers.Posts = {
    DateMatcher: /^(.+\/)*(\d+-\d+-\d+)-(.*)(\.[^.]+)$/,
    Matcher: /^(.+\/)*(.*)(\.[^.]+)$/,
    
    // Public: Generate the Posts dictionary.
    generate: function () {
        Ruhoh.ensure_setup();
        
        var results = this.process();
        var ordered_posts = this.ordered_posts(results['posts']);
        
        return {
            'dictionary'      : results['posts'],
            'drafts'          : results['drafts'],
            'chronological'   : this.build_chronology(ordered_posts),
            'collated'        : this.collate(ordered_posts),
            'tags'            : this.parse_tags(ordered_posts),
            'categories'      : this.parse_categories(ordered_posts)
        }
    },
    
    process: function () {
        var dictionary = {};
        var drafts = []
        var invalid = [];

        var files = this.files();
        
        for (var i=0;i<files.length;i++) {
            var filename = files[i];
            var parsed_page = '';
            FileUtils.cd(Ruhoh.paths.base,function(){
                parsed_page = Ruhoh.Utils.parse_page_file(filename);
            });
            var data = parsed_page['data'];
          
            var filename_data = this.parse_page_filename(filename);
          
            if (filename_data=="") {
                var error = "Invalid Filename Format. Format should be: my-post-title.ext"
                invalid.push([filename,error]);
                continue;
            }
          
            data['date'] = data['date'] || filename_data['date'];
            
            if (!this.formatted_date(data['date'])) {
                var error = "Invalid Date Format. Date should be: YYYY-MM-DD"
                invalid.push([filename, error]);
                continue;
            }
        
            if (data.type=="draft") {
                if (Ruhoh.config.env == 'production') continue;
                drafts.push(filename);
            }

            data['date']          = data['date'].toString();
            data['id']            = filename;
            data['title']         = data['title'] || filename_data['title'];
            data['url']           = this.permalink(data);
            data['layout']        = data['layout'] || Ruhoh.config.posts_layout;
            dictionary[filename]  = data;
        }
        
        Ruhoh.Utils.report('Posts', dictionary, invalid);
        return { 
            "posts": dictionary,
            "drafts": drafts
        }
    },
        
    formatted_date: function (date) {
        try {
            return new Date(date.replace(/(\d+)-(\d+)-(\d+)/, '$2/$3/$1'));
        } catch (e) {
            return false;
        }
    },
        
    files: function() {
        var me = this;
        var res;
        FileUtils.cd(Ruhoh.paths.base,function() {
            res = FileUtils.select(Ruhoh.names.posts+"/**/*.*",function (filename) {
                return me.is_valid_page(filename);
            });
        });
        return res;
    },
        
    is_valid_page: function (filepath) {
        if (FileUtils.is_directory(filepath)) return false;
        if (filepath[0]==".") return false;
        for (var i=0;i<Ruhoh.config.posts_exclude.length;i++) {
            if (Ruhoh.config.posts_exclude[i].test(filepath)) return false;
        }
        return true;
    },
        
    ordered_posts: function (dictionary) {
        var ordered_posts = [];
        for (var key in dictionary) ordered_posts.push(dictionary[key]);
        ordered_posts.sort(function(a,b){
            return new Date(a) - new Date(b);
        });
        return ordered_posts;
    },
        
    parse_page_filename: function(filename) {
        var data = filename.match(this.DateMatcher);
        if (!data) data = filename.match(this.Matcher);
        if (!data) return {};
        
        if (this.DateMatcher.test(filename)) {
            return {
                "path": data[1],
                "date": data[2],
                "slug": data[3],
                "title": this.to_title(data[3]),
                "extension": data[4]
            };
        } else {
            return {
                "path": data[1],
                "slug": data[2],
                "title": this.to_title(data[2]),
                "extension": data[3]
            };
        }
    },
                
    // my-post-title ===> My Post Title
    to_title: function(file_slug) {
        return file_slug.replace(/[^\p{Word}+]/g, ' ').replace(/\b\w/,function(s){return s.toUpperCase()});
    },
                
    // Used in the client implementation to turn a draft into a post.  
    to_filename: function(data) {
        FileUtils.join(Ruhoh.paths.posts, Ruhoh.Urls.to_slug(data['title'])+"."+data['ext']);
    },
                

    // Another blatently stolen method from Jekyll
    // The category is only the first one if multiple categories exist.
    permalink: function (post) {
        var date = new Date(post['date']);
        var title = Ruhoh.Urls.to_url_slug(post['title']);
        var format = post['permalink'] || Ruhoh.config.posts_permalink  || "/:categories/:year/:month/:day/:title.html";
        
        // Use the literal permalink if it is a non-tokenized string.
        if (format.indexOf(":")==-1) {
          var url = format.replace(/^\//g, '').split('/').map(escape).join('/');
          return "/"+url;
        }

        var filename = FileUtils.basename(post['id'], FileUtils.extname(post['id']));
        
        var category = new Array(post['categories'])[0];
        if (category) category = category.split('/').map(Ruhoh.Urls.to_url_slug).join('/');
        
        var hash = {
            "year"       : date.getFullYear(),
            "month"      : date.getMonth()+1,
            "day"        : date.getDay(),
            "title"      : title,
            "filename"   : filename,
            "i_day"      : date.getDay(),
            "i_month"    : date.getMonth()+1,
            "categories" : category || '',
        }
            
        var url = format;
        for (var key in hash) {
            url = url.replace(":"+key, hash[key]);
        }
        return url.replace(/\/+/g, "/");
    },

    build_chronology: function (ordered_posts) {
        return ordered_posts.map(function (post){ return post['id'] });
    },
                
    // Internal: Create a collated posts data structure.
    //
    // posts - Required [Array] 
    //  Must be sorted chronologically beforehand.
    //
    // [{ 'year': year, 
    //   'months' : [{ 'month' : month, 
    //     'posts': [{}, {}, ..] }, ..] }, ..]
    // 
    collate: function (ordered_posts) {
        var collated = [];
        
        for (var i=0;i<ordered_posts.length;i++) {
            var post = ordered_posts[i];
        
            var thisYear = new Date(post['date']).getFullYear();
            var thisMonth = new Date(post['date']).getMonth()+1;
          
            if (i-1 >= 0) {
                var prevYear = new Date(ordered_posts[i-1]['date']).getFullYear();
                var prevMonth = new Date(ordered_posts[i-1]['date']).getMonth()+1;
            } 

            if(prevYear == thisYear) {
                if(prevMonth == thisMonth) {
                    collated.last['months'].last['posts'].push(post['id']) // append to last year & month
                } else {
                    collated.last['months'].push({
                        'month': thisMonth,
                        'posts': [post['id']]
                    }) // create new month
                }
            } else {
                collated.push({ 
                    'year': thisYear,
                    'months': [{ 
                        'month': thisMonth,
                        'posts': [post['id']]
                    }]
                }) // create new year & month
            }
        }
        return collated;
    },

    parse_tags: function (ordered_posts) {
        var tags = {};
        
        for (var i=0;i<ordered_posts.length;i++) {
            var post = ordered_posts[i];
            for (var t=0;t<post['tags'].length;t++) {
                var tag = post.tags[t];
                if (tags[tag])
                    tags[tag]['count'] += 1
                else
                    tags[tag] = { 
                        'count': 1, 
                        'name': tag,
                        'posts': [] 
                    }
                      
                tags[tag]['posts'].push(post['id']);
            }
        }
        return tags;
    },
                      
    parse_categories: function (ordered_posts) {
        var categories = {}
        
        for (var i=0;i<ordered_posts.length;i++) {
            var post = ordered_posts[i];
            for (var c=0;c<post.categories.length;c++) {
                var cat = post.categories[c];
                cat = cat.join('/');
                if (categories[cat])
                    categories[cat]['count'] += 1
                else
                    categories[cat] = { 
                        'count': 1, 
                        'name': cat, 
                        'posts': []
                    }
                categories[cat]['posts'].push(post['id']);
            }
        }
        return categories;
    }
}
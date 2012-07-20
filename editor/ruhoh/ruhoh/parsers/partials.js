Ruhoh.Parsers.Partials = {
    generate: function () {
        var gp = this.global_partials();
        var tp = this.theme_partials();
        for (var key in tp) { gp[key] = tp[key]; }
        return gp;
    },
    
    theme_partials: function () {
        return this.process(Ruhoh.paths.theme_partials);
    },
      
    global_partials: function () {
        return this.process(Ruhoh.paths.partials);
    },
      
    process: function(path) {
        if (!FileUtils.exist(path)) return {};
        var partials = {};
        FileUtils.cd(path,function (){
            FileUtils.select("**/*",function (filename) {
                if (FileUtils.is_directory(filename)) return;
                if (filename[0]==".") return;
                partials[filename] = FileUtils.open(filename);
            });
        });
        return partials;
    }
}
Ruhoh.Parsers.Layouts = {
    generate: function () {
        var layouts = {}
        var files = this.files();
        for (var i=0;i<files.length;i++) {
            var filename = files[i];
            var id = FileUtils.basename(filename, FileUtils.extname(filename));
            var data = Ruhoh.Utils.parse_layout_file(Ruhoh.paths.theme_layouts, filename);
            data['id'] = id;
            layouts[id] = data;
        }
        
        Ruhoh.Utils.report('Layouts', layouts, []);
        return layouts;
    },
    files: function () {
        if (!FileUtils.is_directory(Ruhoh.paths.theme_layouts)) return [];
        var res;
        FileUtils.cd(Ruhoh.paths.theme_layouts,function() {
            res = FileUtils.select("**/*.*",function (filename) {
                if (FileUtils.is_directory(filename)) return false;
                if (filename[0]=="_" || filename[0]==".") return false;
                return true;
            });
        });
        return res;
    }
}

Ruhoh.Converter = {
    convert: function (content,id) {
        var extension = FileUtils.extname(id).toLowerCase();
        
        for (var key in Ruhoh.Converter) {
            var converter = Ruhoh.Converter[key];
            if (key=='convert') continue;
            if (key=='extensions') continue;
            if (converter.extensions.indexOf(extension)==-1) continue;
            return converter.convert(content);
        }
        return content;
    },
    
    extensions: function () {
        var collection = [];
        for (var key in Ruhoh.Converter) {
            var converter = Ruhoh.Converter[key];
            if (!converter.extensions) continue;
            collection = collection.concat(converter.extensions);
        }
        return collection
    }
}
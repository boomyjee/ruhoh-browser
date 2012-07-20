Ruhoh.Converter.Markdown = {
    extensions: ['.md', '.markdown'],
    convert: function (content) {
        var converter = new Showdown.converter();
        return converter.makeHtml(content);
    }
}
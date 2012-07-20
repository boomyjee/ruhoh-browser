// Sitewide data hash + configuration file.
Ruhoh.Parsers.Site = {
    generate: function () {
        var site = Ruhoh.Utils.parse_yaml_file(Ruhoh.paths.site_data) || {}
        var config = Ruhoh.Utils.parse_yaml_file(Ruhoh.paths.config_data)
        site['config'] = config;
        return site;
    }
}
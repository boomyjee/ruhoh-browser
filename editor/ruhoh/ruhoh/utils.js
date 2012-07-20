Ruhoh.Utils = {
    FMregex: /^(---\s*\n[\s\S]*?\n?)^(---\s*$\n?)/m,
    
    parse_yaml_file: function () {
        var filepath = FileUtils.join.apply(FileUtils,arguments);
        if (!FileUtils.exist(filepath)) return undefined;
        
        var file = FileUtils.open(filepath);
        var res = jsyaml.load(file);
        return res;
    },
    
    parse_page_file: function () {
        var path = FileUtils.join.apply(this,arguments);
        if (!FileUtils.exist(path)) throw "File not found: "+path;

        var page = FileUtils.open(path);
        var front_matter = page.match(this.FMregex)
            
        if (front_matter) {
            data = jsyaml.load(front_matter[0].replace(/---\n/g, "")) || {};
            data['categories'] = data['categories'] || [];
            data['tags'] = data['tags'] || [];
        } else {
            data = {}
        }
        
        return { 
            "data": data,
            "content": page.replace(this.FMregex, '')
        }
    },
    
    parse_layout_file: function () {
        var path = FileUtils.join.apply(this,arguments);
        if (!FileUtils.exist(path)) throw "Layout file not found: "+path;
        var data = {};
        var page = FileUtils.open(path);
        var front_matter = page.match(this.FMregex);
        if (front_matter)
            data = jsyaml.load(front_matter[0].replace(/---\n/g, "")) || {};
      
        return { 
            "data": data,
            "content": page.replace(this.FMregex, '')
        }
    },
    
    report: function (name, dict, invalid) {
        var collection = [];
        for (var key in dict) collection.push(dict[key]);
        
        output = collection.length+"/"+(collection.length + invalid.length)+" "+name+" processed.";
        if (collection.length==0 && invalid.length==0)
            Ruhoh.Friend.plain("0 "+name+" to process.");
        else if (invalid.length==0)
            Ruhoh.Friend.green(output);
        else {
            Ruhoh.Friend.yellow(output);
            Ruhoh.Friend.list(name+" not processed:", invalid);
        }
    },
    
    deep_merge: function (hash1, hash2) {
        return deep_merge(hash1,hash2);
    }
}

/*    
class Ruhoh
  module Utils
    
    FMregex = /^(---\s*\n.*?\n?)^(---\s*$\n?)/m
    
    def self.parse_yaml_file(*args)
      filepath = File.__send__ :join, args
      return nil unless File.exist? filepath

      file = File.open(filepath, 'r:UTF-8') {|f| f.read }
      yaml = YAML.load(file) || {}
      yaml
    rescue Psych::SyntaxError => e
      Ruhoh.log.error("ERROR in #{filepath}: #{e.message}")
      nil
    end
    
    def self.parse_page_file(*args)
      path = File.__send__(:join, args)
      raise "File not found: #{path}" unless File.exist?(path)

      page = File.open(path, 'r:UTF-8') {|f| f.read }

      front_matter = page.match(FMregex)
      if front_matter
        data = YAML.load(front_matter[0].gsub(/---\n/, "")) || {}
        data['categories'] = Array(data['categories'])
        data['tags'] = Array(data['tags'])
      else
        data = {}
      end
      
      { 
        "data" => data,
        "content" => page.gsub(FMregex, '')
      }
    rescue Psych::SyntaxError => e
      Ruhoh.log.error("ERROR in #{path}: #{e.message}")
      nil
    end
    
    def self.parse_layout_file(*args)
      path = File.__send__(:join, args)
      raise "Layout file not found: #{path}" unless File.exist?(path)
      data = {}
      page = File.open(path, 'r:UTF-8') {|f| f.read }

      front_matter = page.match(FMregex)
      if front_matter
        data = YAML.load(front_matter[0].gsub(/---\n/, "")) || {}
      end
      
      { 
        "data" => data,
        "content" => page.gsub(FMregex, '')
      }
    rescue Psych::SyntaxError => e
      Ruhoh.log.error("ERROR in #{path}: #{e.message}")
      nil
    end
    
    def self.relative_path(filename)
      filename.gsub(Regexp.new("^#{Ruhoh.paths.base}/"), '')
    end

    def self.url_to_path(url, base=nil)
      parts = url.split('/')
      parts = parts.unshift(base) if base
      File.__send__(:join, parts)
    end    

    def self.report(name, collection, invalid)
      output = "#{collection.count}/#{collection.count + invalid.count} #{name} processed."
      if collection.empty? && invalid.empty?
        Ruhoh::Friend.say { plain "0 #{name} to process." }
      elsif invalid.empty?
        Ruhoh::Friend.say { green output }
      else
        Ruhoh::Friend.say {
          yellow output
          list "#{name} not processed:", invalid
        }
      end
    end
    
    # Merges hash with another hash, recursively.
    #
    # Adapted from Jekyll which got it from some gem whose link is now broken.
    # Thanks to whoever made it.
    def self.deep_merge(hash1, hash2)
      target = hash1.dup

      hash2.keys.each do |key|
        if hash2[key].is_a? Hash and hash1[key].is_a? Hash
          target[key] = self.deep_merge(target[key], hash2[key])
          next
        end

        target[key] = hash2[key]
      end

      target
    end
    
  end
end #Ruhoh*/
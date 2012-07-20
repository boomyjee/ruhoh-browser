if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function (obj, fromIndex) {
    if (fromIndex == null) {
        fromIndex = 0;
    } else if (fromIndex < 0) {
        fromIndex = Math.max(0, this.length + fromIndex);
    }
    for (var i = fromIndex, j = this.length; i < j; i++) {
        if (this[i] === obj)
            return i;
    }
    return -1;
  };
}

if (!Array.prototype.forEach)
{
  Array.prototype.forEach = function(fun /*, thisp*/)
  {
    var len = this.length;
    if (typeof fun != "function")
      throw new TypeError();

    var thisp = arguments[1];
    for (var i = 0; i < len; i++)
    {
      if (i in this)
        fun.call(thisp, this[i], i, this);
    }
  };
}

function deep_merge(a,b) {
    return $.extend(true,{},a,b);
}

function clone(a) {
    return $.extend(true,{},a);
}

function hashToArray(hash) {
    var res = [];
    for (var key in hash) res.push(hash[key]);
    return res;
}

Ruhoh = {
    Parsers: {},
    Templaters: {}
};
var $ = teacss.jQuery;
FileUtils = {
    cache: {},
    
    init: function () {
        this.cache = FileApi.request('batch',{path:FileApi.root},true);
        
        var system = FileApi.root.split("/");
        system.pop();
        system = system.join("/")+"/editor/ruhoh";
        
        var def = FileApi.request('batch',{path:system},true);
        for (var key in def) this.cache[key] = def[key];
        
        this.cd_base = FileApi.root;
    },

    absolute: function (path) {
        if (/^(\/)|(http)/.test(path)) return path;
        return this.cd_base + "/" + path.replace(/^\//,'');
    },
    join: function () {
        var args = [].slice.call(arguments, 0);
        return args.join("/");
    },
    exist: function (filename) {
        filename = this.absolute(filename);
        return this.cache[filename]!==undefined;
    },
    open: function (filename) {
        filename = this.absolute(filename);
        return this.cache[filename] ? this.cache[filename].content : undefined;
    },
    is_directory: function (filename) {
        filename = this.absolute(filename);
        return this.cache[filename] && this.cache[filename].directory;
    },
    
    cd: function (path,callback) {
        var old = this.cd_base;
        this.cd_base = path;
        callback.call(this);
        this.cd_base = old;
    },
    select: function (mask,callback) {
        function esc(s) {
            return s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&").replace(/\\\*/g,"[A-Za-z0-9_-]{1,}");
        }
        
        var path = this.cd_base+"/"+mask;
        var parts = path.split("**/");
        var path_pre = parts[0];
        var path_after = parts[1];
        
        var r_pre = path_after ? new RegExp("^"+esc(path_pre)) : new RegExp("^"+esc(path_pre)+"$");
        var r_after = path_after ? new RegExp(esc(path_after)+"$") : false;
        
        var files = [];
        for (var name in this.cache) {
            if (!r_pre.test(name)) continue;
            if (r_after && !r_after.test(name)) continue;
            
            var sub = name.substring(this.cd_base.length+1);
            if (!callback || callback(sub)) files.push(sub);
        }
        return files;
    },
    getwd: function () {
        return FileApi.root;
    },
    extname: function (path) {
        return "."+path.split(".").pop();
    },
    basename: function (path, suffix) {
        var b = path.replace(/^.*[\/\\]/g, '');
        if (typeof(suffix) == 'string' && b.substr(b.length - suffix.length) == suffix) {
            b = b.substr(0, b.length - suffix.length);
        }
        return b;
    }
}
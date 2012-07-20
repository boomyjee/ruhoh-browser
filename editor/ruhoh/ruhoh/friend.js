Ruhoh.Friend = {
    say: function (type,text) {
        this[type](text);
    },
    
    color_enabled: function () {
        return true;
    },
    
    list: function (caption,listings) {
        this.red(" "+caption);
        for (var i=0;i<listings.length;i++) {
            this.cyan("    - " + listings[i][0]);
            this.cyan("      " + listings[i][1]);
        }
    },
    
    color: function (text, color_code) {
        if (this.color_enabled())
            ruhoh_cms.logTab.instance.log("%c"+text,color_code);
        else
            ruhoh_cms.logTab.instance.log(text);
    },
    
    plain: function (text) {
        ruhoh_cms.logTab.instance.log(text);
    },
    
    bold: function (text) {
        this.color(text, "font-weight:bold");
    },
    
    red: function(text) {
        this.color(text, "color:red")
    },
    
    green: function(text) {
        this.color(text, "color:green")
    },
    
    yellow: function(text) {
        this.color(text, "color:yellow")
    },
    
    blue: function(text) {
        this.color(text, "color:blue")
    },
    
    magenta: function(text) {
        this.color(text, "color:magenta")
    },
    
    cyan: function(text) {
        this.color(text, "color:cyan")
    },
    
    white: function(text) {
        color(text, "color:#eee")
    },
}
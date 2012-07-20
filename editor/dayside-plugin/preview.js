// plugin register
dayside.plugins.push(function(){
    // return custom context menu for some items
    dayside.editor.filePanel.bind("contextMenu",function(nop,data){
        var sub = data.path.substring(FileApi.root.length);
        // it is a page
        if (/^\/pages\//.test(sub)) {
            data.menu = data.inject(
                data.menu,
                "preview",
                {
                    label: 'Live preview',
                    action: function(){
                        dayside.editor.tabs2.addTab(
                            new ruhoh_cms.previewTab({file:data.path})
                        );
                    }
                },
                function (pk,pv,nk,nv) { return true; }
            );
        }
    });
    
    dayside.editor.bind("codeChanged",function(e,tab){
        var me = ruhoh_cms;
        clearTimeout(me.changeTimeout);
        me.changeTimeout = setTimeout(function(){
            var file = tab.options.file;
            var text = tab.editor.getValue();
            FileUtils.cache[file].content = text;
            
            ruhoh_cms.update();
            for (var i=0;i<ruhoh_cms.tabs.length;i++)
                ruhoh_cms.tabs[i].update();
        },200);        
    });
    
    dayside.editor.tabs2.addTab(new ruhoh_cms.logTab);
    
    FileUtils.init();
    ruhoh_cms.update();
    
    dayside.editor.tabs2.addTab(
        new ruhoh_cms.previewTab({file:FileApi.root+"/pages/index.html"})
    );
});

ruhoh_cms = {
    tabs: [],
    update: function () {
        Ruhoh.Friend.plain("--------- Starting update ----------");
        Ruhoh.setup();
        Ruhoh.config.env = 'preview';
        Ruhoh.DB.update_all();
    }
};
(function($){
    ruhoh_cms.previewTab = teacss.ui.tab.extend({
        init: function(options) {
            var caption = options.file.substring(FileApi.root.length+1);
            options = $.extend({caption:caption,closable:true},options);
            this._super(options);
            
            this.iframe = 
                $("<iframe src='"+teacss.path.absolute("dayside-plugin/blank.htm")+"'>")
                    .appendTo(this.element)
                    .css({width:'100%',height:'100%'});
            
            var me = this;
            ruhoh_cms.tabs.push(this);
            setTimeout(function(){
                me.update();
                dayside.editor.tabs2.selectTab(me);
            },1);
        },
        update: function () {
            var id = this.options.file.substring((FileApi.root+"/pages/").length);
            var page = new Ruhoh.Page;
            page.change(id);
            var html = page.render();
            var d = this.iframe[0].contentDocument;
            d.open();
            d.write(html);
            d.close();
        }
    });
    
    ruhoh_cms.logTab = teacss.ui.tab.extend({
        init: function (options) {
            var $ = teacss.jQuery;
            options = options || {};
            this._super($.extend({'caption': 'Log'},options));
            
            this.element.css({background:"#333",padding:10,overflow:'auto',color:'white','line-height':'1.5em'});
            
            
            this.Class.instance = this;
        },
        
        log: function (a1,a2) {
            var style = "";
            var msg;
            if (a1.substring(0,2)=="%c") {
                msg = a1.substring(2);
                style = a2;
            } else {
                msg = [].join.call(arguments," ");
            }
            this.element.prepend("<div style='"+style+"'>"+msg+"</div>");
        }
    });    
})(teacss.jQuery);
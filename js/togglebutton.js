; (function(win, doc, undef) {
    'use strict';
    //options={
    //  ispending:true,//请求时挂起
    //  toggleClass :[{cls:'1',enable:true,action:function(obj){
    //      
    //  }},{cls:'2',enable:false}]//规定 1为On，2为off
    //  
    //  ,toggle:function(state){
    //      return promise;
    //  }
    //}
    //var toggle = (function(){
    //     var dfd = $.Deferred();
    //     var task = function()
    //     {
    //         // 发布内容
    //         dfd.resolve("Alice2");
    //     }
    //     var task1 = function()
    //     {
    //         // 发布内容
    //         dfd.resolve("Alice2");
    //     }
        
    //     setTimeout( task, 3000);
    //     setTimeout( task1, 5000);
        
    //     return dfd.promise();
    // })();
    var toggleButton = function(el, options) {
        this.el = el;
        this.element = el[0];
        $.extend(this,options);
        if(!$.isArray(this.toggleClass)){
            this.toggleClass=[this.toggleClass,null];
        }
    }
    toggleButton.prototype = {
        states:['on','off','disable'],
        ispending:true,
        init: function() {
            var me=this;
            this.el.on('tap',function(target){
                if(me.ispending&&me.locking){
                    return;
                }
                $.when(me.beforetoggle&&me.beforetoggle()).done(function(flag){
                    if(flag==false){
                        return;
                    }
                    var currentstate = me.dotoggle();//首先改变样式
                    //判断disable
                    if(currentstate==me.states[2]){
                        return;
                    }
                    me.locking = true;
                    $.when(me.toggle(me.el,currentstate)).done(function(){
                        me.locking=false;
                    });
                })
            });
        }
        ,dotoggle:function(){
            var toggleon = this.toggleClass[0];
            var toggleoff = this.toggleClass[1];
            if(this.el.hasClass(toggleon.cls)){
                if(toggleon.enable==false){
                    return this.states[2];
                }
                this.el.removeClass(toggleon.cls);
                
                if(toggleoff){
                    this.el.addClass(toggleoff.cls);
                }
                $(this).data('state',this.states[1]);
                toggleon.action&&toggleon.action(this.el);
                return this.states[1];
            }
            else{

                if(toggleoff&&toggleoff.enable==false){
                    return this.states[2];
                }
                if(toggleoff){
                    this.el.removeClass(toggleoff.cls);
                }
                this.el.addClass(toggleon.cls);
                $(this).data('state',this.states[0]);
                toggleoff.action&&toggleoff.action(this.el);
                return this.states[0];
            }
        }
    }
    Object.defineProperties(window.sinaCnHome, {
        toggleButton: {
            value: toggleButton
        }
    });
})(window, document); 
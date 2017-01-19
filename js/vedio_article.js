@require("article_util.js")
@require("gesut.js")
setTimeout(function(){
    new ReleventNews({
        relevent : {
            //必须
            cre : 'aspect',                        //产品位 标志看点
            mod : 'r',                           //产品位 标志看点
            tmpl : function(option){
                var item = option.item;
                var arr =[];

                arr.push('<a href="'+ item.wapurl +'" data-info="'+ item.info +'">')

                arr.push('<dl class="f_card">');
                if(item.img && item.img.u){
                    arr.push('<dt class="f_card_dt">');
                    arr.push('<img src="'+((item.img&&item.img.u)||'')+'" alt="'+(item.title||'')+'">');
                    arr.push('</dt>');
                }
                arr.push(' <dd class="f_card_dd">');
                arr.push('<h4 class="f_card_h4">'+(item.title||'')+'</h4>');
                //arr.push('<p class="f_card_p">'+(item.summary||'')+'</p>');
                arr.push('<div class="f_card_lricon">');
                arr.push('<span class="comment">'+(item.comment_total||0)+'<em class="icon_comment"></em></span>');
                arr.push('</div></dd></dl></a>');
                return arr.join('');
            },  
            extra:'app_type=115',
            //非必需
            entryClass:"#j_oWrap",    //最外层 默认值
            contentBoxClass:'#j_container',   //feedBox 默认值
            loadingClass:'.h_load_more',          //加载图标 默认值
            feedAdClass:'.sina_tj_article_feed', //广告位 默认值
            maxLoad :  40,                       //最大长度 默认值
            callup : {
                active: false,                   //是否要呼起客户端 默认不呼起   
                len: 5,                          //前几条呼起       默认值
            },
            onload : function (option) {
                // window["sinaSax"]&&window["sinaSax"].callback('ajaxMoreLoadSax');
            }
        }
    })
},200)

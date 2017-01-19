/**
 * @新科技频道-手机新浪网
 * @requires "util", "exposure", "zepto"
 * @author yuanyuan23@staff.sina.com.cn
 * @date 2016-05-03
 */
 


(function(w, d){
    var ua = window.navigator.userAgent.toLowerCase()
    /*
    * get relevent news
    * 
    */
    
    ,GetQueryString=function(url,name){
        var result = '';
        var reg = new RegExp("[\?]"+name +"=([^&]*)(&|$)");
        var r = url.match(reg);
        if(r!=null)
        {
            result = decodeURI(r[1]); 
        }
        return result;
    }   
    ,isSearch = (function(){
        
        var bd = /\.baidu\.com/gi;
        var sm = /\.sm\.cn/gi;
        var _strUrl = document.referrer; 
  
        if(bd.test(_strUrl)){
            keywords = GetQueryString(_strUrl,'word') || '';
            if(!keywords){

                keywords = GetQueryString(_strUrl,'wd') || '';

            }
            if(!keywords){
                var r = _strUrl.match(/\/w\=\d+\_\d+\_(.*?)\//);
                if(r!=null){
                    keywords = (r[1]);
                }
            }
            if(!keywords){
                keywords = document.querySelector('h1').innerHTML;
            }
        }else if(sm.test(_strUrl)){
            keywords = GetQueryString(_strUrl,'q');
        }else{
            return false;
        }
        return true;
    })();
    
    
    window.ReleventNews = function (option){
        if(typeof option != 'object'){
            return;
        }
        this.option = option;
        this.confInit();
        if(option.relevent){
            this.releventInit();
        }
        if(option.video){
            this.videoInit();
        }
        

        this.bindEvent();  
 
    }
    ReleventNews.prototype.confInit = function(){
        this.conf = {

            maxLen :10,
            floatLen : 2,
            maxLoad: 0,
            monitor: true,
            checkBottomTimer: null,
            loadingClass: '',
            contentBoxClass: '',
            feedAdClass: '',
            entryClass : '',
            extra : '',
            tmpl : '',
            //needExpose: true,
            statistics: {
                miniLen: -1,
                maxLen: 10,
                api: 'http://slog.sina.cn/a.gif?',
                data: {
                    action: '', // recommend_wapexposure
                    refer: '', // curpage uid
                    t: 1,  //random
                    uid: '', //uid,guid
                    info: '', // xx,xxx,xx
                    mod: '',
                    cre: '',
                },
                waitQueue: [],
                active: true,
                keywords : '',
                //curUid: null,
                nodeIndex: [],
                nodeInfos: [],
                exposeElems: []
            },
           
            callup: ''
        }
    }
    ReleventNews.prototype.releventInit = function(){
        var option = this.option;
        option.relevent.cre = ua.indexOf('sinanews')!=-1?'newsapp': (option.relevent.cre || (w.__docConfig && __docConfig.__cre)||'newspagew');
        option.relevent.mod = option.relevent.mod||'f';
        option.relevent.entryClass = option.relevent.entryClass||".j_article_relevent",    //最外层 默认值
        option.relevent.contentBoxClass = option.relevent.contentBoxClass||'.j_relevent_box',   //feedBox 默认值
        option.relevent.loadingClass = option.relevent.loadingClass||'.j_load_bar',          //加载图标 默认值
        option.relevent.feedAdClass = option.relevent.feedAdClass||'.sina_tj_article_feed', //广告位 默认值
        option.relevent.maxLoad = option.relevent.maxLoad || (w.__docConfig && __docConfig.__hotNewsNo) || 40,                       //最大长度 默认值
        option.relevent.callup = option.relevent.callup||{
            active: false,                   //是否要呼起客户端 默认不呼起   
            len: 5,                          //前几条呼起       默认值
        },
        option.relevent.onload = option.relevent.onload || function(){};
        option.relevent.extra = option.relevent.extra||'';                    //请求接口额外的参数,类型string
        option.relevent.tmpl = option.relevent.tmpl || function(){};
        option.relevent.statistics = option.relevent.statistics || {
            expose: 'rcd_wexp',
            click: 'rcd_wclick'
        };

        if(option.flowRead){
            this.flowReadInit();
        }

        sina.extendDict(this.conf, {

            maxLoad: option.relevent.maxLoad,
            loadingClass: option.relevent.loadingClass,
            contentBoxClass: option.relevent.contentBoxClass,
            feedAdClass: option.relevent.feedAdClass,
            entryClass : option.relevent.entryClass,
            extra : option.relevent.extra,
            tmpl : option.relevent.tmpl,
            statistics: {
                miniLen: -1,
                maxLen: 10,
                api: 'http://slog.sina.cn/a.gif?',
                data: {
                    action: '', // recommend_wapexposure
                    refer: '', // curpage uid
                    t: 1,  //random
                    uid: '', //uid,guid
                    info: '', // xx,xxx,xx
                    mod: '',
                    cre: option.relevent.cre,
                },
                waitQueue: [],
                active: true,
                keywords : option.relevent.statistics,
                //curUid: null,
                nodeIndex: [],
                nodeInfos: [],
                exposeElems: []
            },
            callup: option.relevent.callup
        },true);
        console.log(this.conf)
        this.entry = $(this.conf.entryClass);
        this.objectMap = {};
        this.keywords = '';

        this.checkDocument();
    }
    ReleventNews.prototype.videoInit = function(){
        var option = this.option;

        option.video.entryClass = option.video.entryClass ||'j_relevent_video',
        option.video.ch = option.video.ch || [],
        option.video.onload = option.video.onload || function(){};
        option.video.pageType=option.video.pageType||"article";
        this.releventVideo(); 
    }
    ReleventNews.prototype.flowReadInit = function(){
        var option = this.option;
        // if()
        option.flowRead.ch = option.flowRead.ch || [],
        option.flowRead.maxLoad = option.flowRead.maxLoad || 20;
        option.flowRead.onload = option.flowRead.onload || function(){};

        if(this.matchCh(option.flowRead.ch)){
            var history = storage.get('flowReadHistory');
            if(!history || history.indexOf(__docConfig.__docId)==-1){
                option.flowRead.status = true;
                option.relevent.maxLoad = option.flowRead.maxLoad || option.relevent.maxLoad;
            }
            else{
                option.flowRead.status = false;
            }
            
        }
    }
    ReleventNews.prototype.checkDocument = function(){
      
        if(this.entry.length == 0){
            return;
        }
        var _this = this;
        var doms = this.entry;
        doms.forEach(function(item, index){
            var dom = doms.eq(index)
                ,uid = _this.track.getUid()
                ,tmp;
            if(dom.data('uid') != null){
                return;
            }
            dom.data('uid',uid);
            tmp = {
                wrapBox: dom,
                inited: true,
                loadingBar: dom.find(_this.conf.loadingClass),
                contentBox: dom.find(_this.conf.contentBoxClass),
            };
      
            tmp.params = _this.loadConf(dom, true);
          
            _this.objectMap[uid] = tmp;
            
            _this.findFeedAds(uid);

            //console.log(tmp);
            //sina.fireEvent('initRelevent', ['monitor', uid]);
            _this.loadData(uid, true);
        });

        this.track.ElemClick.call(this,doms); // 猜你喜欢点击曝光
    }
    ReleventNews.prototype.monitor = function(){

        var curObj = null
            ,j = null;
        var _this = this;
        
        for(j in _this.objectMap){
            if(_this.objectMap.hasOwnProperty(j)){
                curObj = _this.objectMap[j];
                curObj && curObj.wrapBox && curObj.wrapBox[0].getBoundingClientRect().bottom < ($(window).height() + 97) ? 
                    (curObj.inited ? sina.fireEvent('loadmore_relevent', ['releventNews_listen', j]) : sina.fireEvent('initRelevent', ['monitor', j]))
                    : '';
            }
        }
    }
    

    ReleventNews.prototype.GuessTemplate = function(option){
        var needLazy = option.needLazy || false;
        var callup = option.callup || false; 
        var callupIndex = option.callupIndex || '';
        var str= this.conf.tmpl&&this.conf.tmpl(option);
        return str||''; 
    }

  
   
    ReleventNews.prototype.buildDom = function(datas, curObj, isFirst){
        var _this = this;
        var typeMap = ['top', 'auto']
            ,feedNodes = []
            ,fragment = document.createDocumentFragment()
            ,curOpt = curObj.params
            ,ads = curOpt.ads
            ,i = curOpt.loaded;
        curOpt.topLoaded += datas[typeMap.indexOf('top')].length;
        var callupIndex = 1;
        datas.forEach(function(data, index){
            data && data.forEach(function(item){
                var img, title, dateObj, date, comment, tmp;
                // 需要异常处理
                img = '';

                var oDiv = document.createElement('div');
                oDiv.innerHTML = _this.GuessTemplate({
                  
                    needLazy : isFirst,
                    callup : (_this.conf.callup.active && callupIndex <= _this.conf.callup.len),
                    callupIndex : callupIndex++,
                    item : item
                })

                var tmp = oDiv.children[0];
       
                feedNodes.push(tmp);
                if(_this.conf.statistics.active){
                    _this.conf.statistics.nodeIndex.push(tmp);
                    _this.conf.statistics.nodeInfos.push(item.info || '');
                }
            })
        });
        
        feedNodes.forEach(function(item){
            if(i >= _this.conf.maxLoad){
                return;
            }
            i += 1;
            while(ads && i in ads){
                fragment.appendChild(ads[i][0])
                ads[i].removeClass('hide');
                i += 1;
            }
    
            fragment.appendChild(item);
        });
        
        curOpt.loaded = i;
        curObj.contentBox.append(fragment);
        isFirst && this.option.relevent.onload && this.option.relevent.onload(datas);
        isFirst && this.trigger('releventLoaded', [datas], false);
        isFirst && sina.fireEvent('addLazyNode', ['relevent', curObj.contentBox]);
        sina.fireEvent('onload_relevent', ['relevent',curObj.contentBox]);
        _this.conf.statistics.active && sina.fireEvent('elemExposeAddItem', ['relevent', feedNodes]);
        _this.conf.callup.active && _sinaCallEvent && _sinaCallEvent.trigger('sina_bind_target');
   
        if(window.SUDA && !isFirst){
            SUDA.log();
        }
        if (window.suda && !isFirst) {

            _this.loadtime = _this.loadtime||1;
             
              var clickInfo = {
                'type' : 'exposure',  //点击的类型
                'name' : 'exp_recommend_news',  //当前点击的aid关键字
                'title': '正文页模块曝光', //中文说明
                'index': _this.loadtime ++  //索引  如果是单个为0即可
              }
                    
            
            if(window.suda_count){
              window.suda_count(clickInfo);
            }

        };
    }
    ReleventNews.prototype.findFeedAds = function(uid){
        var ads, adElems, curOpt;
        var _this= this;
        if(_this.objectMap.hasOwnProperty(uid) && _this.objectMap[uid]){
            curOpt = _this.objectMap[uid].params;
            adElems = $(curOpt.feedAdClass);
            ads = {}
            adElems.forEach(function(elem, index){
                var dom = adElems.eq(index);
                if(dom.data('pos') !== null){
                    dom.addClass('hide');
                    ads[dom.data('pos')] = dom;
                }
            });
            curOpt.ads = ads;
        }
    }
    ReleventNews.prototype.loadData = function (uid, isFirst){
       
        var _this =this;
        if(_this.objectMap.hasOwnProperty(uid) && _this.objectMap[uid]){
            if(sina.lock('set', uid)){
                var tmp = _this.objectMap[uid];
              
                tmp.loadingBar.show();
                sina.request(function(resp){
                    sina.lock('release', uid);
                    tmp.loadingBar.hide();
                    if(resp && resp.result){
                        resp = resp.result;
                        _this.conf.statistics.data.refer = resp.refer || null;
                        tmp.params.totalLen = resp.total || resp.data.length;
                        _this.objectMap[uid].params.data.length = _this.conf.maxLen;
             
                        tmp.params.data['offset'] = resp.end;
                        if(isSearch && isFirst){
                            
                            _this.RelateData = resp.data.splice(0, _this.conf.floatLen);
                      
                            _this.buildDom([resp.top, resp.data], tmp, isFirst);
                            _this.RelatedDom(_this.RelateData);
                        }
                        else{
                             _this.buildDom([resp.top, resp.data], tmp, isFirst);
                        }
                        

                    }else{
                        if(isFirst){
                            
                            tmp.wrapBox.hide();
                            delete _this.objectMap[uid]; // make sure other process won't include this
                        }
                    }
                }, tmp.params.url + (_this.option.relevent.extra || ''), tmp.params.data, 0, 'callback') //callBackFunc, url, data, timeout:second, jsonpQsKey, callbackKey, retry, cache, method
            }
        }
    }
    ReleventNews.prototype.loadConf = function(dom, isFirst){
        var _this = this;
        var obj = {
            data: {
                feed_fmt:'1',
                dedup:'32',
                merge:'3',
                statics:'1',
                this_page:'1',
                rfunc:'105',
                fields: 'url',
                offset: 0,
                length: (isSearch && isFirst)? _this.conf.maxLen+_this.conf.floatLen : _this.conf.maxLen,
                feed_fields: 'url,mtitle,stitle,title,wapurls,wapurl,img,comment_total,type,ctime',
                cateid: (w.__docConfig && __docConfig.__cateid) || 'sina_all',
                mod: _this.option.relevent.mod,
                cre: _this.option.relevent.cre,
                pageUrl: (w.__docConfig && __docConfig.__webURL) || d.location.href,
            },
            url: 'http://cre.dp.sina.cn/api/v3/get?',
            topLoaded: 0,
            loaded: 0,
            feedAdClass: dom.data('feedAd') || _this.conf.feedAdClass,
            ads: []
        };
        if(isSearch){
            obj.data.query = keywords;
        }
        return obj;
    }

    ReleventNews.prototype.track = {

        ElemExpose : function(doms, action){
  
            doms = doms.find('a');
            var exposeCnf = this.conf.statistics;
        
            var infoArr=[];
            exposeCnf.data.action = action || this.conf.statistics.keywords.expose;
            if(doms[0]){
                exposeCnf.data.mod = this.track.getMod(doms[0].href) || exposeCnf.data.mod;
                exposeCnf.data.cre = this.track.getCre(doms[0].href) || exposeCnf.data.cre;
            }
            doms.forEach(function(index){
           
                infoArr.push($(index).data('info'));
            })

            exposeCnf.data.uid = this.track.getUid(); 
            exposeCnf.data.t = parseInt(Math.random()*10); 
            exposeCnf.data.info =infoArr.join(',');   
            var imgObj = new Image();
            imgObj.src = exposeCnf.api + sina.urlEncode(exposeCnf.data);
        }
        ,ElemClick : function(doms, action){

            var _this = this;
            doms.on('click tap', 'a', function(){
                if(!this.getAttribute('data-info')){
                    return;
                }
                var exposeCnf = _this.conf.statistics;
                var imgObj;

                exposeCnf.data.uid = _this.track.getUid(); 
                exposeCnf.data.action = action || _this.conf.statistics.keywords.click;
                exposeCnf.data.info = this.getAttribute('data-info');
                exposeCnf.data.mod = _this.track.getMod(this.href) || exposeCnf.data.mod;
                exposeCnf.data.cre = _this.track.getCre(this.href) || exposeCnf.data.cre;
                imgObj = new Image();
                exposeCnf.data.t = parseInt(Math.random()*10);
                imgObj.src = exposeCnf.api + sina.urlEncode(exposeCnf.data);
            })
        }
        ,getUid: function(){
            return (function(){
                var guid,uid ;
                if(typeof window.getCookie === 'function'){
                    //alert(document.cookie)
                    guid = getCookie('ustat')||'';
                   
                }
                if(typeof window.userInfo === 'object'){
                    uid = userInfo.uid || '';
                   
                }
                return (uid || '') + ',' + (guid || '');
            })();
        }
        ,getMod : function(str){
            if(str){
                return this.match(str, 'mod');
            }
            return ''; 
        }
        ,getCre : function(str){
            if(str){
                return this.match(str, 'cre');
            }
            return ''; 
        }
        ,match : function(str, name){
            var reg = new RegExp(name +"\=(.*?)\&");
            var r = str.match(reg);
            if(r!=null)
            {
                return r[1]; 
            }
            return '';
        }
    }
    ReleventNews.prototype.RelatedDom=function (data){
        var _this =this;
        if(data == '') return;
        var style = document.createElement('style');
        style.innerHTML = ".related_pic{width:100%;height:74px;position: fixed;bottom: 0;left:0;color:#fff;transition:all ease-in 1s 6s;opacity: 0; z-index: 1200;}.related_pic_block{ opacity: 1;z-index: 1200;}.related_title{width:27px;height:74px;background:#3990e6;font-size: 14px;line-height: 14px;padding:8px 5px 8px 5px;box-sizing: border-box;position: relative;}.related_content{background:rgba(0,0,0,.8);font-size: 15px;padding:5px 10px 5px 40px;box-sizing: border-box;}.related_content h3{color:#fff;line-height: 18px;white-space:nowrap; text-overflow:ellipsis; overflow:hidden;padding:7px 0;}.related_title::after{content: '';display: block;position: absolute;top: 35px;left: 100%;width: 0;height: 0;border-top: 3px solid transparent;border-right: 3px solid transparent;border-bottom: 3px solid #3990e6;border-left: 3px solid transparent;-webkit-transform: rotate(90deg);}";
        $('head').append(style);

        $('body').append('<div class="clearfix related_pic" id="j_related_pic" data-sudaclick="artBottomFloat"></div>');
            
        var arr=[];    
        arr.push('<div class="fl related_title">相关推荐</div>');
        arr.push('<div class=" related_content">');
        for(var i = 0 ; i< data.length; i++){
            arr.push('<a href="'+data[i].wapurl+'" title="'+(data[i].stitle ||data[i].title)+'" data-info="'+data[i].info+'" >');
            arr.push('<h3>'+data[i].title+'</h3>');
            arr.push('</a>');

        }
        arr.push('</div>');
        $('#j_related_pic').append(arr.join(''));

        
        setTimeout(function(){
            if($('#j_related_pic').children.length>0){
                $('#j_related_pic').addClass("related_pic_block");  
            };
            _this.track.ElemClick.call(_this, $('#j_related_pic'), 'rcd_wseclick');

        },200)
        setTimeout(function(){
            _this.track.ElemExpose.call(_this, $('#j_related_pic'), 'rcd_wseexp');
        },6000)
        
    };
    var videoRequestMap ={
        "article": 'http://cre.dp.sina.cn/api/news/related?cre=videopagew&mod=f&merge=3&statics=1&this_page=1&type=3,10&length=5&pageurl=',
        "weibo":"http://cre.dp.sina.cn/api/news/related?cre=weibosx&mod=v&merge=3&statics=1&this_page=1&type=3,10&length=5&pageurl="
    }
    ReleventNews.prototype.releventVideo = function(){
        var _this = this;
        var oVideo = $('.'+_this.option.video.entryClass);
      
        if(oVideo.length>0 && $('.j_article_video').length==0 && _this.matchCh(this.option.video.ch)){
            
            sina.request(function(re){
                if(re && re.status && !re.status.code){
                    if(re.data.length>0 && re.data[0]){
                        
                        var data = re.data[0];
                        var tmpl = _this.option.video.tmpl(data);
                        oVideo.append(tmpl);

                        this.track.ElemClick.call(this, oVideo, 'rcd_wvclick');
                        sina.fireEvent('elemExposeAddItem', ['relevent_video',oVideo]);  
                        this.trigger('videoLoaded', [data], false);   
                        this.option.video.onload&&this.option.video.onload(data);
                    }
                    else{
                        console.log('相关视频没有数据');
                        this.trigger('videoLoaded', [], false);  
                        this.option.video.onload&&this.option.video.onload();
                    }
                }

            }.bind(this),videoRequestMap[_this.option.video.pageType]+((w.__docConfig && __docConfig.__webURL) || d.location.href), {}, 0, 'callback')
        }
    }
    ReleventNews.prototype.matchCh = function(arr){
       
        var Booleans = false;
        if(arr == 'all' || arr.indexOf('all')!=-1){
            return true;
        }
        arr.forEach(function(ch){
          
            if(window.location.href.indexOf(ch)!= -1 ){
                Booleans = true;
                return;
            }
        })
        return Booleans;
    }
    ReleventNews.prototype.flowRead = function(){
        var doms = this.entry.find('a');
        var arr = [];
        for(var i=0; i<doms.length;i++){
            arr.push(doms.data('info').split('|')[0]);
        }
        var impress_id = arr.join(',');


        sina.request(function(re){
                if(re && re.status && !re.status.code){
                    if(re.data.length>0 && re.data[0]){
                        
                        var data = re.data[0];
                        console.log(data);

                        this.trigger('flowReadLoaded', [data], false);  
                        this.option.flowRead.onload&&this.option.flowRead.onload(data);    
                        if(data.surl){
                            if (window.suda) {                            
                                var clickInfo = {
                                    'type' : 'flowRead',
                                    'name' : 'flowRead',
                                    'title': '流式阅读',
                                    'index': 0
                                }                             
                                if(window.suds_count){
                                    window.suds_count(clickInfo);
                                }
                            };
                            var history = storage.get('flowReadHistory')||'';
                            storage.set('flowReadHistory', history + __docConfig.__docId + ';');
                            $('body').append('<div id="j_flowRead" style="position: fixed;height: 40px;width: 100%;background-color: rgba(18,155,240,0);z-index: 1000;color: #fff;text-align: center;line-height: 40px;font-size: 14px; left: 0;bottom: 0;transition: .5s all linear;-webkit-transition: .5s all linear;">正在为您加载新页面...</div>');
                            setTimeout(function(){
                                $('#j_flowRead').css('background-color', 'rgba(18,155,240,0.8)');
                            },0)
                            setTimeout(function(){
                                $('#j_flowRead')[0].parentNode.removeChild($('#j_flowRead')[0]);
                                window.location.href=data.surl;
                            },800)
                            this.option.flowRead.status = false;
                            
                        } 
                    }
                    else{
                        console.log('流式阅读没有数据');
                        this.trigger('flowReadLoaded', [0], false);   
                        this.option.flowRead.onload&&this.option.flowRead.onload();  
                    }
                }


            }.bind(this), 'http://cre.dp.sina.cn/api/v3/get?cre=pagenextw&mod=f&merge=3&statics=1&cateid=1z&offset=0&length=1&impress_id='+impress_id, {}, 0, 'callback')    
    }
    ReleventNews.prototype.bindEvent= function(){
        var _this = this;
        sina.listenEvent('elemExposeHappen', function(src, exposeElems, userInfo){
        //debugger; 曝光

            if(sina.getType(exposeElems) === 'array' && _this.conf.statistics.nodeIndex.length){
                    
                var infos = [];
                var exposeCnf = _this.conf.statistics;
                exposeElems.forEach(function(node){ // ignore other expose event!
                    if(_this.option.video && $(node).hasClass(_this.option.video.entryClass)){  //视频直接曝光
                        _this.track.ElemExpose.call(_this, $(node), 'rcd_wvexp');
                        return;
                    }
                    var nodeIndex = exposeCnf.nodeIndex.indexOf(node);
                    var nodeInfo = nodeIndex !== -1 && exposeCnf.nodeInfos[nodeIndex];
                    if(nodeInfo){
                        infos.push(nodeInfo);
                        exposeCnf.exposeElems.push(node);
                    }
                });
                infos.length > 0 && (exposeCnf.waitQueue=exposeCnf.waitQueue.concat(infos));
                var waitQueue = exposeCnf.waitQueue;
                var imgObj;
                if(waitQueue.length === 0){
                    return;
                }
                exposeCnf.data.action = _this.option.relevent.statistics.expose;
                if(exposeCnf.exposeElems[0]){
                    exposeCnf.data.mod = _this.track.getMod(exposeCnf.exposeElems[0].href) || exposeCnf.data.mod;
                    exposeCnf.data.cre = _this.track.getCre(exposeCnf.exposeElems[0].href) || exposeCnf.data.cre;
                    
                    
                }
                exposeCnf.data.uid = userInfo;
                while(1){
                    if(exposeCnf.miniLen > 0 && waitQueue.length < _this.conf.statistics.miniLen){
                        break;
                    }
                    imgObj = new Image();
                    exposeCnf.data.info = waitQueue.splice(0, exposeCnf.maxLen>0 ? exposeCnf.maxLen : waitQueue.length).join(',');
                    exposeCnf.data.t = parseInt(Math.random()*10);
                    imgObj.src = exposeCnf.api + sina.urlEncode(exposeCnf.data);
                    /*debug*/
                        // alert('send ' + exposeCnf.api + sina.urlEncode(exposeCnf.data));
                    /*debug*/
                    if(waitQueue.length === 0){
                        break;
                    }
                }
            }
        });
        sina.listenEvent('initRelevent', function(src, uid){
        //debugger;
            if(_this.objectMap.hasOwnProperty(uid) && !_this.objectMap[uid].inited){
                _this.objectMap[uid].inited = true;
                _this.loadData(uid, true);
            }
        });
        sina.listenEvent('loadmore_relevent', function(source, uid){
          
            if(_this.objectMap.hasOwnProperty(uid) && _this.objectMap[uid]){
                if(_this.objectMap[uid].params.loaded < _this.conf.maxLoad){
                    _this.loadData(uid);
                    
                }
                else{
                    if(_this.option.flowRead && _this.option.flowRead.status && _this.matchCh(_this.option.flowRead.ch)){
                        // 流式阅读
                        _this.flowRead();
                    }
                    console.log('relevent '+ uid +' load done!');
                }
               
            }
            
        });
        
        this.option.relevent && sina.listenEvent('pageScroll', this.monitor.bind(this)); 
    }
    sina.extendDict(ReleventNews.prototype, sina.EventFactory());
    ReleventNews.init = ReleventNews.checkDocument;

    var storage = {
        set : function(key, value){
            try{
                localStorage.setItem(key, value);
            }
            catch(e){

            }
        },
        get : function(key){
            var value='';
            try{
                localStorage.setItem('test', 1);
                value = localStorage.getItem(key);
            }
            catch(e){

            }
            return value;
        },
        remove : function(key){

            try{
                localStorage.setItem('test', 1);
                localStorage.removeItem(key);
                
            }
            catch(e){

            } 
        }
    }
})(window, document);

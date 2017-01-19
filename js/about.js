// @require("http://mjs.sinaimg.cn/wap/module/base/js/zepto.min.js")


try{var EventFactory = function(){

    var eventMap = {};

    function initEvent(live){

        return {

            listener: [], // {func: Function, liveIndex: 0}

            isLive: live || false,

            liveEvents: [],

        };

    }

    function addListener(eventObj, listenFunc){

        var listenerProxy = eventObj.listener,

            exist = false,

            listenObj = {};

        exist = !loginBox.every(function(tmp){

            if(tmp.func !== listenFunc){

                return true;

            }else{

                listenObj = tmp;

                return false;

            }

        });

        if(!exist){

            listenObj = {

                func: listenFunc,

                liveIndex: 0,

            };

            listenerProxy.push(listenObj);

        }

        return listenObj;

    }

    return {

        on: function(eventName, func, isLive){

            if(!this.eventMap){

                this.eventMap = {};

            }

            eventMap = this.eventMap;

            var eventObj=null, listenerObj=null, isLive=isLive||false;

            if(!eventMap.hasOwnProperty(eventName)){

                eventMap[eventName] = initEvent(isLive);

            }

            eventObj = eventMap[eventName];

            listenObj = addListener(eventMap[eventName], func);

            if(isLive && eventObj.liveEvents.length > 0 && listenObj.liveIndex < eventObj.liveEvents.length){

                listenObj.liveIndex = eventObj.liveEvents.length;

                var i=listenObj.liveIndex,

                    len = eventObj.liveEvents.length;

                eventObj.liveIndex = len;

                for(;i<len;i++){

                    eventObj.func.apply(window, eventObj.liveEvents[i]);

                }

            }

        },

        trigger: function(eventName, params, isLive){

            //isLive = typeof(isLive) === 'boolean' ? isLive : true;

            var eventObj = {};

            if(!this.eventMap){

                this.eventMap = {};

            }

            eventMap = this.eventMap; 

            if(!eventMap.hasOwnProperty(eventName)){

                eventObj = eventMap[eventName] = initEvent(typeof(isLive) === 'boolean' ? isLive : true);

                eventObj.liveEvents.push(params);

            }else{

                eventObj = eventMap[eventName];

                eventObj.listener.forEach(function(listenObj){

                    try{

                        listenObj.func.apply(window, params);

                    }catch(err){

                        console.error && console.error(err);

                    }

                });

                isLive ? eventObj.liveEvents.push(params) : '';

            }

        }

    };

}

var sina = (function(w, d){

    var _$ = {}

        ,_UA = navigator.userAgent;

    function addEvent(obj,eventType,func){ //disuse

        if(w.addEventListener){

            obj.addEventListener(eventType,func,false);

        }else{

            obj.attachEvent("on" + eventType, func); 

        }

    }

    function delEvent(obj,eventType,func){ //disuse

        if(window.removeEventListener){

            obj.removeEventListener(eventType,func,false)

        }else{

            obj.detachEvent("on" + eventType, func); 

        }

    }

    function viewData(){ //disuse

        var W=0, H=0, SL=0, ST=0, SW=0, SH=0;

        var dd=d.documentElement; 

        W=w.innerWidth||dd.clientWidth||d.body.clientWidth||0;

        H=w.innerHeight||dd.clientHeight||d.body.clientHeight||0;

        ST=d.body.scrollTop||dd.scrollTop||w.pageYOffset;

        SL=d.body.scrollLeft||dd.scrollLeft||w.pageXOffset;

        SW=Math.max(d.body.scrollWidth, dd.scrollWidth ||0);

        SH=Math.max(d.body.scrollHeight,dd.scrollHeight||0, H);

        return {

            "scrollTop":ST,

            "scrollLeft":SL,

            "documentWidth":SW,

            "documentHeight":SH,

            "viewWidth":W,

            "viewHeight":H

        };

    }

    function delNode(nid){  //disuse

        if(nid && nid.nodeName){

            nid.parentNode.removeChild(nid);

        }

    }

    var UAIDS = {

        browser:{

            firefox: 'firefox',

            ie: 'msie',

            chrome: 'chrome',

            qq: 'mqqbrowser',

            uc: 'ucbrowser',

            baidu: 'baidu',

        },

        client:{

            weibo: 'weibo',

            weixin: 'micromessenger',

            qq: 'qq'

        },

        platform: {

            iphone: 'iphone',

            ipod: 'ipod',

            ipad: 'ipad'

        },

        system:{

            ios: 'ios',

            android: 'android',

        },

    },

    platformCache = undefined;

    function getPlatformBrowserInfo(){

        var regKeys = [], ret=null, matches=[];

        if(platformCache !== undefined){

            return platformCache; 

        }

        Object.keys(UAIDS).forEach(function(_type){

            regKeys = regKeys.concat(Object.keys(UAIDS[_type]).map(function(item){

                return UAIDS[_type][item];

            }));

        });

        matches = _UA.toLowerCase().match(new RegExp('('+regKeys.join('|')+')+','g'));

        if(matches.length > 0){

            ret = {};

            Object.keys(UAIDS).forEach(function(_type){

                var item = UAIDS[_type],matcher='other',key=null;

                for(key in item){

                    if(item.hasOwnProperty(key) && matches.indexOf(item[key]) !== -1){

                        matcher = key;

                        break;

                    }

                }

                ret[_type] = matcher;

            });

            

        }

        //spec

        if(ret.platform !== 'other'){

            ret.system = 'ios';

        }

        platformCache = ret;

        return ret;

    }

    // var js_mobile_console = null;

    // function mobileConsole(type, msg){

    //     if(js_mobile_console === null && $('.j_mobile_console').length === 0){

    //         js_mobile_console = d.createElement('div');

    //         js_mobile_console.className = 'j_mobile_console';

    //         js_mobile_console.style.width

    //         $('body').append([

    //             '<div class="j_mobile_console"',

    //             ' style="position: fixed;top: 30px;right: 10px;width: 100px;',

    //             'height: 200px;background-color: rgba(0,255,255,0.4);z-index: 9999;',

    //             'word-break: break-word;overflow: auto;"></div>'

    //         ].join(''));

    //         js_mobile_console = $('.j_mobile_console');

    //     }

    //     js_mobile_console = js_mobile_console === null ? $('.j_mobile_console') : js_mobile_console;

    //     switch(type){

    //         case 'log':

    //             js_mobile_console.append(msg.toString())

    //         break;

    //         case 'dir':

    //         break;

    //         default:

    //             return;

    //         break;

    //     }

    // }

    function _extend(src, target, cover){

        cover = cover || false;

        for(var i in target){

            target.hasOwnProperty(i) && !src.hasOwnProperty(i) || cover ? src[i]=target[i] : '';

        }

    }

    function getType(obj){

        var tmp = typeof(obj);

        return tmp === 'object' ? 

            (Object.prototype.toString.call(obj).match(/\[object (.*)\]/) ? RegExp.$1.toLowerCase() : 'other') :

            tmp;

    }

    function urlEncode(obj){

        var objType = getType(obj),

            ret = [];

        if(objType === 'array'){

            ret = objType.map(function(item, index){

                return index+'='+item;

            });

        }else if(objType === 'object'){

            for(var i in obj){

                obj.hasOwnProperty(i) ? ret.push(i+'='+obj[i]) : '';

            }

        }else if(objType === 'string'){

            ret.push(obj);

        }

        return ret.join('&');

    }

    // function isSameDomain(target){

    //     if(target && target.match){

    //         return tmp = target.match(/http\:\/\/([^\/]+)\/.*/) ? tmp[1] === w.location.hostname : false;

    //     }

    // }

    function request(callBackFunc, url, data, timeout, jsonpQsKey, callbackKey, retry, cache, method, rType, headers){

        /*

        *pack jsonp and ajax by auto judge crossdomain

        *@need params callBackFunc, url

        *

        */

        var type='_jsonp';

        function _ajax(){

            var ajaxParams = {

                type: method,

                dataType: 'json',

                cache: cache,

                timeout: timeout,

                data: data,

            };

            var dataStr = urlEncode(data);

            var xhr = new XMLHttpRequest();

            if(method === 'GET'){

                url += (url.indexOf('?') === -1 ? '?'+dataStr : dataStr);

                dataStr = null;

            }

            xhr.onreadystatechange = function(){

                if(xhr.readyState === 4){

                    var resp = null;

                    if(xhr.status === 200){

                        try{

                            resp = JSON.parse(xhr.responseText);

                        }catch(err){

                            resp = null;

                        }

                        

                    }

                    callBackFunc && callBackFunc(resp);

                }

            }

            xhr.open(method, url, true);

            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

            if(headers){

                for(var i in headers){

                    if(headers.hasOwnProperty(i)){

                        xhr.setRequestHeader(i, headers[i]);

                    }

                }

            }

            if(timeout > 0){

                setTimeout(function(){

                    if(xhr.readyState < 3){

                        xhr.abort();

                        callBackFunc && callBackFunc(null);

                    }

                }, timeout*1000);

            }

            xhr.send(dataStr);

        }

        function _jsonp(){

            var jsonpCallback = null;

            jsonpQsKey = jsonpQsKey || 'jsonpcallback';

            var ajaxParams = {

                type: 'GET',

                dataType: 'jsonp',

                jsonp: jsonpQsKey,

            }

            if (data) {

                url += (url.indexOf('?') == -1 ? '?' : '&') + urlEncode(data);

                // ajaxParams['data'] = data;

            }

            ajaxParams['url'] = url;

            if (typeof (callBackFunc) === "function") {

                if (callbackKey) { //某些情况需要指定回调名

                    jsonpCallback = callbackKey;

                } else {

                    jsonpCallback = 'jsonp_' + generateUid();

                }

                window[jsonpCallback] = function (resp) {

                    if(window[jsonpCallback+'timer']){

                        clearTimeout(window[jsonpCallback+'timer']);

                    }

                    delete window[jsonpCallback];

                    callBackFunc(resp);

                }

                ajaxParams['jsonpCallback'] = jsonpCallback;

            }

            function setTimer(){

                window[jsonpCallback+'timer'] = setTimeout(function(){

                    console.log(url+' timeout!!!!');

                    var tmp;

                    if(window[jsonpCallback] && typeof(window[jsonpCallback]) == 'function'){

                        tmp = window[jsonpCallback];

                        delete window[jsonpCallback];

                        if(typeof(retry) ==='number' && retry > 0){

                            jsonpCallback = 'jsonp_'+generateUid();

                            window[jsonpCallback] = tmp;

                            setTimer();

                            retry --;

                        }else{

                            tmp(null);

                        }

                    }

                }, timeout*1000)

            }

            timeout > 0 ? setTimer() : '';

            $.ajax(ajaxParams);

        }

        if(url){

            method = method || 'GET';

            cache = cache ? true : false;

            timeout = timeout || 0;

            return rType === 'ajax' ? _ajax() : _jsonp();

            //return isSameDomain(url) ? _ajax() : _jsonp();

        }

    }

    function readabilityNum(num){

        return typeof(num) === 'number' && num > 0 ?

            (num > 9999999) ? ('999万+') : 

                (num > 9999 ? parseInt(num / 10000) + '万' : num)

            : null;

    }

    function generateUid(key){

        var code = ['A','z','C','E','d','H','j','v','k','L']

            ,timestamp = (new Date()).getTime();

        function getRandomCode(){

            var org = ''+(parseInt(Math.random()*10000));

            return [].map.call(org, function(item){

                return code[item];

            }).join('');

        }

        key = key || '';

        return key + getRandomCode() + timestamp;

    }

    var eventQueues = {};

    function listenEvent(type, func){

        if(eventQueues.hasOwnProperty(type)){

            eventQueues[type].push(func);

        }else{

            eventQueues[type] = [func];

        }

    }

    function fireEvent(type, params){

        if(eventQueues.hasOwnProperty(type)){

            var tmp = eventQueues[type];

            tmp && tmp.forEach && tmp.forEach(function(func){

                try{

                    func.apply(window, params);

                }catch(err){

                    console.error('error:'+err.stack+' in fire process:' + func.name);

                }

            });

        }

    }

    function dateFormat (date, fstr, utc) {

      utc = utc ? 'getUTC' : 'get';

      return fstr.replace (/%[YmdHMS]/g, function (m) {

        switch (m) {

            case '%Y': return date[utc + 'FullYear'] (); // no leading zeros required

            case '%m': m = 1 + date[utc + 'Month'] (); break;

            case '%d': m = date[utc + 'Date'] (); break;

            case '%H': m = date[utc + 'Hours'] (); break;

            case '%M': m = date[utc + 'Minutes'] (); break;

            case '%S': m = date[utc + 'Seconds'] (); break;

            default: return m.slice (1); // unknown code, remove %

        }

        // add leading zero if required

        return ('0' + m).slice (-2);

      });

    }

    function manualAlert(txt, dispTime){

        var box = $('.j_alert_box');

        dispTime = dispTime || 2000

        if(box.length !== 0){

            $('.j_alert_text').text(txt);

            box.show();

            setTimeout(function(){

                box.hide();

            },dispTime);

        }else{

            alert(txt);

        }

    }

    var lockMap = {};

    function requireLock(type, uid, timeout, disable_auto_release){

        /*

        * use for lock async process

        */

        function preventDeadLock(uid, timeout, timer){

            timeout = timeout || 5*1000;

            timer && clearTimeout(timer);

            return setTimeout(function(){

                if(lockMap.hasOwnProperty(uid) && lockMap[uid].stat === 'lock'){

                    lockMap[uid].stat = 'ready';

                };

            }, timeout);

        }

        if(['set', 'get', 'release'].indexOf(type) === -1){

            throw new Error('wrong call lock method');

        }

        if(type === 'set'){

            if(lockMap[uid] && lockMap[uid].stat){

                if(lockMap[uid].stat === 'lock'){

                    return 0;

                }

                lockMap[uid].stat = 'lock';

            }else{

                lockMap[uid] = {stat:'lock'};

            }

            if(!disable_auto_release && timeout){

                lockMap[uid].timer = preventDeadLock(uid, timeout, lockMap[uid].timer);

            }

            return 1;

        }else if(type === 'release'){

            if(lockMap.hasOwnProperty(uid) && lockMap[uid].stat){

                lockMap[uid].stat = 'ready';

                lockMap[uid].timer && clearTimeout(lockMap[uid].timer);

            }

        }

    }

    function getCookie(name) {

        var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");

        if (arr = document.cookie.match(reg)) {

            return unescape(arr[2]);

        }

        else {

            return false;

        }

    }

    function checkLoginStatus(callbackFunc, cancelCallbackFunc){

        var userInfo;

        if(window.getUserInfo){

            window.getUserInfo(check);

        }else{

            check();

        }

        function check(resp){

            var _loginLayer;

            userInfo = resp || {};

            if(userInfo.islogin !== 1){

                if(w['SINA_OUTLOGIN_LAYER']){

                    //获取登录对象

                    _loginLayer = w["SINA_OUTLOGIN_LAYER"];

                    //初始化浮层

                    _loginLayer.set('sso',{

                        entry : 'wapsso'

                    }).init();

                    //将呼出浮层绑定到相应的目标元素上

                                

                    _loginLayer.show();

                    var sucCall= function(re){

                        

                        //表示登陆成功

                        var ret = {

                            islogin: 1,

                            uid: re.uid,

                            uname: re.nick,

                            userface: re.portrait

                        }

                        $.ajax({

                            type: "GET",

                            cache: false,

                            url: "http://kandian.dev.sina.cn/aj/userinfo",

                            success:function(data){

                                var pic = data.data.pic;

                                      

                                if($('#loginBox').length > 0){

                                    $('#loginBox').find('img').attr('src', pic);

                                }

                                    

                            },

                            error:function(f){

                            }

                        })

                        // if($('#loginBox').length > 0){

                        //     $('#loginBox').find('img').attr('src', re.portrait);

                        // }

                        window.userInfo = ret;

                        _loginLayer.remove('login_success', sucCall);

                        callbackFunc && callbackFunc(ret);

                    }

                

                    //登陆成功后的回调事件注册多个login_success事件来对应不同按钮的登陆行为

                    _loginLayer.register("login_success", sucCall);

                    

                    //关闭浮层触发的事件

                    _loginLayer.register("layer_hide", function(){

                        _loginLayer.remove('login_success', sucCall);

                        cancelCallbackFunc && cancelCallbackFunc();

                    });

                }

            }else{

                callbackFunc(userInfo);

            }

            

        }

    }

    function _log(level, msg){

        msg = (typeof(msg) === 'string' ? msg : JSON.stringify(msg)) +' in ' + (this._name || 'default');

        if(level === 'err'){

            if(this._debug){

                debugger;

                return console.error(msg);

            }

            throw new Error(msg);

        }

        if(['debug', 'log'].indexOf(level) !== -1 && !this._debug){

            return;

        }

        (level in console && typeof(console[level])==='function')? console[level](msg) : console.log('['+level+']'+msg);

    }

    function tinyTemplateParser(template, data){

        return getType(template) === 'string' ? template.replace(/<%\s?([\[\]\.A-Za-z0-9_]+)\s?%>/g,function(total, match){

            var tarVal = data, missing = false;

            if(match && tarVal){

                match.split('.').forEach(function(key){

                    var matchers;

                    if(key && !missing){

                        matchers = key.match(/(\w+)(\[(\d)+\])?/);

                        if(matchers){

                            if(tarVal[matchers[1]]){

                                tarVal = tarVal[matchers[1]];

                                if(matchers[2] && matchers[3]){

                                    if(tarVal[matchers[3]]){

                                        tarVal = tarVal[matchers[3]];

                                    }else{

                                        missing = true;

                                    }

                                }

                            }else{

                                missing = true;

                            }

                        }

                    }

                });

            }

            return missing || tarVal === data ? '' : getType(tarVal) !== 'string' ? JSON.stringify(tarVal) : tarVal;

        }) : '';

    }

    var screenInfo = viewData();

    listenEvent('resize', function(){

        screenInfo = viewData();

    });

    listenEvent('pageLoad', function(){

        screenInfo = viewData();

    });

    function checkElemntDisp(elem, offset){

        var posInfo = null;

        offset = offset || 0;

        if(elem && elem.getBoundingClientRect){

            posInfo = elem.getBoundingClientRect();

            return posInfo && getType(posInfo.top)==='number' && posInfo.top > -offset && posInfo.top < (screenInfo.viewHeight+offset);

        }

        return false;

    }

    _$ = {

        //disuse

        '$': function(id){

            return d.getElementById(id);

        }

        ,_$: Zepto

        ,delNode: delNode

        ,viewData: viewData

        ,addEvent: addEvent

        ,delEvent: delEvent

        ,EventFactory:EventFactory

        // ,is_weixn: isWeixn

        //new

        ,getType: getType

        ,extendDict: _extend

        ,tinyTemplateParser: tinyTemplateParser

        // ,isWeixn: isWeixn

        // ,getPlatform: getPlatform

        // ,getExplorer: getExplorer

        ,getPlatformBrowserInfo: getPlatformBrowserInfo

        ,request: request

        ,genUid: generateUid

        ,lock: requireLock

        ,alert: manualAlert

        ,convNum: readabilityNum

        ,dateFormat: dateFormat

        ,getCookie: getCookie

        ,checkElemntDisp: checkElemntDisp

        ,urlEncode: urlEncode

        //manual event

        ,fireEvent: fireEvent

        ,listenEvent: listenEvent

        ,requiredLogin: checkLoginStatus

        ,log: _log

        //,m_console: mobileConsole

    };

    w.addEventListener("onorientationchange" in w ? "orientationchange" : "resize", function(e){

        if(_UA.toLowerCase().indexOf('xiaomi')!=-1){

              setTimeout(function(){

                sina.fireEvent('pageResize', ['base.js', e]);

              },100);

        }

        else{

            setTimeout(function(){

                sina.fireEvent('pageResize', ['base.js', e]);

            },30);

        }

    }, false);

    /*manual contentload event add 1s timer to avoid missing browser event*/

    _$.domContentLoad = false;

    var fireDomContentLoad = function(src){

        if(_$.domContentLoad !== true){

            _$.domContentLoad = true;

            fireEvent('contentLoad', ['base', src]);

        }

    }

    if('readyState' in document && document.readyState === 'complete'){

        fireDomContentLoad('property');

    }else{

        d.addEventListener('DOMContentLoaded', function(){

            fireDomContentLoad('event');

        }, false);

        setTimeout(function(){

            fireDomContentLoad('timer');

        },1000);

    }

    /*manual pageload event add 15s timer to avoid missing browser event*/

    _$.pageLoad = false;

    var firePageLoad = function(src){

        if(_$.pageload !== true){

            _$.pageload = true;

            fireEvent('pageLoad', ['base', src])

            fireDomContentLoad('pageload');

        }

    }

    w.addEventListener('load', function(){

       firePageLoad('event');

    }, false);

    setTimeout(function(){

        firePageLoad('timer');

    },15000);

    /*manul scroll event for control fire rate*/

    var scrollCheckInterval = 500,

        scrollCheckTimer = null,

        scrollFiring = false,

        scrollReFire = false;

    listenEvent('contentLoad', function(){

        $(w).on('scroll', function(e){

            scrollCheckTimer && clearTimeout(scrollCheckTimer);

            scrollCheckTimer = setTimeout(function(){

                if(!scrollFiring){

                    scrollFiring = true;

                    fireEvent('pageScroll', ['base', 'first']);

                    while(scrollReFire){

                        scrollReFire = false;

                        fireEvent('pageScroll', ['base', 'repeat']);

                    }

                    scrollFiring = false;

                }else{

                    scrollReFire = true;

                }

            }, scrollCheckInterval);

        });

    });

    return _$;

})(window, document);

}catch(e){console["error" in console ? "error" : "log"](e, "article_util.js");}

try{/**

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

}catch(e){console["error" in console ? "error" : "log"](e, "guess_like.js");}
// 订阅的js

// @require("utils.js")

// @require("togglebutton.js")

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


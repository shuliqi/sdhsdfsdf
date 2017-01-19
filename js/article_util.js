var EventFactory = function(){
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
; (function(win, doc) {
    'use strict';
    var sinaUtils = {
        toggleClass: function(el, value) {
            if (el.classList.contains(value)) {
                el.classList.remove(value);
            } else {
                el.classList.add(value);
            }
        },
        creatElement: function(tag, option) {
            var el = doc.createElement(tag);
            for (var i in option) {
                el.setAttribute(i, option[i]);
            }
            return el;
        },
        stringSplice:function(src, k, e, sp) {
            if (src == "") {
                return "";
            }
            sp = (sp == "") ? "=" : sp;
            k += sp;
            var ps = src.indexOf(k);
            if (ps < 0) {
                return "";
            }
            ps += k.length;
            var pe = src.indexOf(e, ps);
            if (pe < ps) {
                pe = src.length;
            }
            return src.substring(ps, pe);
        },
        checkCookie:function(){
            var result=false;   
            if(navigator.cookiesEnabled)  return true;   
            document.cookie = "testcookie=yes;";   
      
            var cookieSet = document.cookie;   
      
            if (cookieSet.indexOf("testcookie=yes") > -1)  result=true;   
            document.cookie = "";   
            return result;
        },
        getCookie:function(ckName) {
            if (undefined == ckName || "" == ckName) {
                return "";
            }
            return this.stringSplice(document.cookie, ckName, ";", "");
        },

        //设cookie
        setCookie:function(name,value,iDays,domain)
        {
            var oDate=new Date();
            oDate.setDate(oDate.getDate()+iDays);
            var cookieStr = name+'='+value+';expires='+oDate;
            if(domain!=null){
                cookieStr+=";path=/;domain="+domain+";";
            }
            document.cookie=cookieStr;
        },
        removeCookie:function(name,domain)
        {
            this.setCookie(name, '', -1,domain);
        },
        outerHTML : function(obj){
            var tpl = sinaUtils.creatElement('div',{});
            tpl.appendChild(obj);
            return tpl.innerHTML;
        },
        getWinWidth: function() {
            return win.innerWidth || doc.docElement.clientWidth || doc.body.clientWidth || 0;
        },
        getWinHeight: function() {
            return win.innerHeight || doc.docElement.clientHeight || doc.body.clientHeight || 0;
        },
        isEmptyObj: function(obj) {
            for (var prop in obj) {
                if (obj.hasOwnProperty(prop)) return false;
            }
            return true;
        },
        hasData: function(val) {
            return (!val || Object.prototype.toString.call(val) === "[object Array]" && !val.length || Object.prototype.toString.call(val) === "[object Object]" && this.isEmptyObj(val)) ? false: true;
        },
        jsonp2: (function() {
            var count = 0,
            foo = function(url,data, func,cbquery) {
                var cbnameStr = "jsoncallback";
                if(cbquery!=null)
                    cbnameStr=cbquery.cbName;

                var callback = "jsonpCallback_" + count++;
                if(cbquery){
                    callback=cbquery.cbfnName;
                }
                url = url + (url.indexOf('?') + 1 ? '&': '?') + cbnameStr+'=' + callback + '&timestamp=' + Date.now();
                win[callback] = function(data) {
                    func(data, url, func);
                    win[callback] = null;
                    sinaUtils.trigger('afterJSONP');
                }
                $.ajax({
                    url : url,
                    data : data,
                    async : false,
                    type : 'GET',
                    timeout:3000,
                    dataType : 'jsonp',
                    success:function(data){
                        func(data, url, func);
                        win[callback] = null;
                        sinaUtils.trigger('afterJSONP');
                    }
                });
            }
            return foo;
        } ()),
        jsonp: (function() {
            var count = 0,
            foo = function(url, func, type) {
                var timeout = 3000;
                var callback = "jsonpCallback_" + count++,
                url = url + (url.indexOf('?') + 1 ? '&': '?') + 'callback=' + callback + '&timestamp=' + Date.now(),
                s = this.creatElement("script", {
                    "src": url
                });

                win[callback] = function(data) {
                    
                    clearTimeout(jsonp_timer);
                    func(data, type, url, func);
                    s.parentNode.removeChild(s);
                    win[callback] = null;
                    sinaUtils.trigger('afterJSONP');
                }
                doc.getElementsByTagName('head')[0].appendChild(s);
                if (timeout) {
                    var jsonp_timer = setTimeout(function() {
                        func({},
                        type);
                        s.parentNode.removeChild(s);
                        win[callback] = null;
                        sinaUtils.trigger('afterJSONP');
                    },
                    timeout);
                }
            }
            return foo;
        } ()),
        storage: {
            fastmode:1,
            checkfastmode:function(){
                try
                {
                    localStorage.setItem('checkfastmode', 1);
                    this.fastmode=0;
                }
                catch(e)
                {
                
                }
            },
            set: function(key, value) {
                localStorage.setItem(key, JSON.stringify(value));
            },
            get: function(key) {
                return JSON.parse(localStorage.getItem(key));
            }
        },
        exchange: function(el1, el2) {
            var ep1 = el1.parentNode,
            ep2 = el2.parentNode,
            index1 = Array.prototype.indexOf.call(ep1.children, el1),
            index2 = Array.prototype.indexOf.call(ep2.children, el2);
            ep2.insertBefore(el1, ep2.children[index2]);
            ep1.insertBefore(el2, ep1.children[index1]);
        },
        event: {},
        on: function(event, func) {
            if (!this.event.hasOwnProperty(event)) {
                this.event[event] = [];
            }
            this.event[event].push(func);
        },
        trigger: function(event, args) {
            if (this.event.hasOwnProperty(event)) {
                for (var i = 0,
                len = this.event[event].length; i < len; i++) {
                    this.event[event][i].apply(this, Array.prototype.slice.call(arguments).slice(1));
                }
            }
        },
        getSearchValue: function(key) {
            var localSearch = location.search.substr(1),
            itemArr = localSearch.split("&"),
            value = "";
            for (var i = 0,
            len = itemArr.length; i < len; i++) {
                var listArr = itemArr[i].split("=");
                if (listArr[0] == key) {
                    value = listArr[1];
                }
            }
            return value
        },
        readabilityNum: function(num) {
            return typeof(num) === 'number' && num > 0 ? (num > 9999999) ? ('999万+') : (num > 9999 ? parseInt(num / 10000) + '万': num) : null;
        }
    }
    sinaUtils.storage.checkfastmode();
    if (!win.sinaCnHome) {
        win.sinaCnHome = Object.create({},
        {
            S: {
                value: sinaUtils
            }
        });
    }
})(window, document);

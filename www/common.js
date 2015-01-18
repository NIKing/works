/**
 * Created by alex.yang on 14-7-15.
 */
window.RuiDa = window.RuiDa || {
    Module: {},
    Check: {},
    DeValue: {},
    Tool: {},
    Alert: {},
    host: localStorage.hostAddress
};

RuiDa.Module = (function () {
    return {
        Guide_Init:Guide_Init,
        GetGuide:GetGuide,
        IsGuide:IsGuide,
        PostUser: PostUserInfo,
        binClick: scrollOrClick,
        binMain: bindClickByArr,
        bindClickBtn: bindClickBtn,
        bindClickBtnByArr: bindClickBtnByArr,
        bindClickDelay:bindClickDelay,
        bindClickDelayArr:bindClickDelayArr,
        getSex: getSex,
        initBottomNav: initBottomNav,
        initIScroll: initIScroll,
        refreshIScroll: refreshIScroll,
        backHome: backHome,
        backHistory: backHistory,
        backUrl: backUrl,
        getPic: getPicPath,
        backReloadHistory: backReloadHistory,
        backUrl_deviceBackButn: backUrl_deviceBackButn,
        checkcon:checkcon,
        convertClassByIosVer : convertClassByIosVer
    };

    function Guide_Init(){
        localStorage.guide_home1='0';
        localStorage.guide_home2='0';
        localStorage.guide_adpayoff1='0';
        localStorage.guide_adpayoff2='0';
        localStorage.guide_fans_invite='0';
        localStorage.guide_share_goods='0';
        localStorage.isguide='0';
    }
    function GetGuide(){
        if(localStorage.guide_home1==='1'&&
            localStorage.guide_home2==='1'&&
            localStorage.guide_adpayoff1==='1'&&
            localStorage.guide_adpayoff2==='1'&&
            localStorage.guide_fans_invite==='1'&&
            localStorage.guide_share_goods==='1'){
            localStorage.isguide='1';
        }
    }

    function IsGuide(){
        if(!localStorage.isguide)localStorage.isguide='0';
        if(!localStorage.guide_home1)localStorage.guide_home1='0';
        if(!localStorage.guide_home2) localStorage.guide_home2='0';
        if(!localStorage.guide_adpayoff1) localStorage.guide_adpayoff1='0';
        if(!localStorage.guide_adpayoff2) localStorage.guide_adpayoff2='0';
        if(!localStorage.guide_fans_invite) localStorage.guide_fans_invite='0';
        if(!localStorage.guide_share_goods) localStorage.guide_share_goods='0';
    }

    function checkcon(){
        // 等待加载PhoneGap
        document.addEventListener("deviceready", onDeviceReady_checkConnection, false);

        // PhoneGap加载完毕，可以安全调用PhoneGap方法
        function onDeviceReady_checkConnection() {
            checkConnection();
        }

        function checkConnection() {
            var networkState = navigator.network.connection.type;

            var states = {};
            states[Connection.UNKNOWN]  = 'Unknown connection';
            states[Connection.ETHERNET] = 'Ethernet connection';
            states[Connection.WIFI]     = 'WiFi connection';
            states[Connection.CELL_2G]  = 'Cell 2G connection';
            states[Connection.CELL_3G]  = 'Cell 3G connection';
            states[Connection.CELL_4G]  = 'Cell 4G connection';
            states[Connection.NONE]     = 'No network connection';
            if(networkState===Connection.NONE){
                RuiDa.Alert.showAlert('当前无网络服务', '', '警告', '确定');
            }
        }
    }

    function convertClassByIosVer(){

        // 等待加载PhoneGap
        
        $(function(){
             //onDeviceReadyConvertClass();
            document.addEventListener("deviceready", onDeviceReadyConvertClass, false);
        })
       
        // PhoneGap加载完毕，可以安全调用PhoneGap方法
        function onDeviceReadyConvertClass() {

            var deviceVersion = device.version;
            // var deviceVersion = navigator.userAgent;

            if($("header") && deviceVersion >= 7){
                if($("header"))$("header").addClass("hdHeight70");
                if($("header h1"))$("header h1").addClass("hdLineHeight70");
                if($("header a"))$("header a").addClass("hdLblTop");
                if($("header span"))$("header span").addClass("hdSpanTop");


                var elSection = $("section");
                //如果中间内容只有一个要特殊处理
                if(elSection.length ==0){
                     elSection.addClass("sectionPdTop");
                }else{
                    for(var i=0,sectionLen = elSection.length;i<sectionLen;i++){

                        var sectionClass =$(elSection[i]).attr("class");
                        if(sectionClass && (sectionClass.search("main")>=0 || sectionClass.search("con_main")>=0)){
                            $(elSection[i]).addClass("sectionPdTop");
                        }               
                    }
                }

            }
        }
    }


    function PostUserInfo() {
        var url = localStorage.hostAddress + 'index.php?c=api&m=getuserid&userid=' + localStorage.userid;
        $.ajax({
            url: url,
            type: 'GET',
            data: {
                userid: localStorage.userid
            },
            dataType: 'jsonp'
        }).done(function (datalist) {
            }).fail(function () {
                console.log("error");
            });
    }

    function bindClickDelayArr(arr){
        if (arr) {
            for (var key in arr)
                if (key && arr[key]) {
                    bindClickDelay(key, arr[key]);
                }
        }
    }
    function bindClickDelay(id,url){
        $(id).bind('click',function(){
            setTimeout(function(){
                window.location.href=url;
            },300)
        });
    }

    //直接点击绑定跳转事件(手机上有延迟，最好用下面的)
    function bindClickBtn(id, url) {
        $(id).bind('click', function () {
            window.location.href = url;
        });
    }

    function bindClickBtnByArr(arr) {
        if (arr) {
            for (var key in arr)
                if (key && arr[key]) {
                    bindClickBtn(key, arr[key]);
                }
        }
    }

    //滚动或点击绑定跳转事件
    function scrollOrClick(element, url) {
        $(element).on('touchstart', function (event) {
            var pageYStart = event.originalEvent.targetTouches[0].pageY;
            $(this).on('touchend', function (event) {
                var pageYEnd = event.originalEvent.changedTouches[0].pageY;
                if (Math.abs(pageYStart - pageYEnd) < 30) {
                    window.location.href = url;
                }
                $(this).off('touchend');
            });
        });
    }

    //按数组进行绑定
    function bindClickByArr(arr) {
        if (arr) {
            for (var key in arr)
                if (key && arr[key]) {
                    scrollOrClick(key, arr[key]);
                }
        }
    }

    function getSex(key) {
        var sexarr = {
            1: '男',
            2: '女',
            3: '保密'
        };
        return sexarr[key] || '未知';
    }

    // 底部导航
    function initBottomNav() {
        var urlArr = ['home.html', 'collect.html', 'fans.html', 'person.html'];
        for (var i = 0; i < 4; i++) {
            $('footer nav').eq(i).on('touchend', function () {
                var index = $(this).index();
                if (window.location.href.indexOf(urlArr[index]) != -1) return;
                window.location.href = urlArr[index];

                //清除返利页面留下的数据
                RuiDa.Tool.removeSessionItem_rebate();
            });
        }
    }

    //滚动初始化
    function initIScroll() {
        setTimeout(function () {
            window.iScroll = new iScroll('iScroll', {
                vScrollbar: false
            });
        }, 200);
    }

    //刷新滚动
    function refreshIScroll() {
        setTimeout(function () {
            window.iScroll.refresh();
        }, 200);
    }

    function backHome() {
        $('#backBtn').on('touchstart', function () {
            window.location.href = 'home.html';
        });

        document.addEventListener("deviceready", function () {
            document.addEventListener("backbutton", function () {
                window.location.href = 'home.html';
            }, false);
        }, false);
    }

    function backHistory() {
        $('#backBtn').on('touchend', function () {
            window.history.back();
        });

        document.addEventListener("deviceready", function () {
            document.addEventListener("backbutton", function () {
                window.history.back();
            }, false);
        }, false);
    }

    function backUrl(url) {
        $('#backBtn').on('touchend', function () {
            window.location.href = url;
        });

        document.addEventListener("deviceready", function () {
            document.addEventListener("backbutton", function () {
                window.location.href = url;
            }, false);
        }, false);
    }

    function backUrl_deviceBackButn(fun, arg) {
        if (fun == null || fun == "")return;

        document.addEventListener("deviceready", function () {
            document.addEventListener("backbutton", function () {
                // window.location.href = url;
                fun(arg);

            }, false);
        }, false);
    }

    function getPicPath(picPath, defPath) {
        if (picPath) return (RuiDa.host + picPath);
        else return defPath;
    }

    function backReloadHistory() {
        $('#backBtn').on('touchend', function () {
            var historyLength = sessionStorage.historyLength;
            sessionStorage.removeItem('historyLength');
            window.history.go(historyLength);
        });

        document.addEventListener("deviceready", function () {
            document.addEventListener("backbutton", function () {
                var historyLength = sessionStorage.historyLength;
                sessionStorage.removeItem('historyLength');
                window.history.go(historyLength);
            }, false);
        }, false);
    }
})();



RuiDa.Check = {
    //【start】
    //检查是否为正整数
    isPositiveInteger: function (value) {
        if (value.match(/^([1-9]\d*|0)$/) !== null)
            return true;
        else
            return false;
    },

    //验证字符串长度value,最小长度min,最大长度max
    isCertainLength: function (value, min, max) {
        var len = value.length;
        if (len >= min && len <= max)
            return true;
        else
            return false;
    },

    //arr是否包含element
    isContains: function (arr, element) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] === element)
                return true;
        }
        return false;
    },

    //验证大陆手机号
    isMHMobile: function (value) {
        var mob_preg = /^((\+?86)|(\(\+86\)))?1[3|4|5|7|8][0-9]{9}$/;
        if (!mob_preg.test(value))
            return false;
        else
            return true;
    },

    //验证邮箱
    isEmail: function (value) {
        var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
        return reg.test(value);
    }

    //【end】
};

window.Time = {
    /**
     * 当前时间戳
     * @return <int>        unix时间戳(秒)
     */
    CurTime: function () {
        return Date.parse(new Date()) / 1000;
    },
    /**
     * 日期 转换为 Unix时间戳
     * @param <string> 2014-01-01 20:20:20  日期格式
     * @return <int>        unix时间戳(秒)
     */
    DateToUnix: function (string) {
        var f = string.split(' ', 2);
        var d = (f[0] ? f[0] : '').split('-', 3);
        var t = (f[1] ? f[1] : '').split(':', 3);
        return (new Date(
            parseInt(d[0], 10) || null,
            (parseInt(d[1], 10) || 1) - 1,
            parseInt(d[2], 10) || null,
            parseInt(t[0], 10) || null,
            parseInt(t[1], 10) || null,
            parseInt(t[2], 10) || null
        )).getTime() / 1000;
    },
    /**
     * 时间戳转换日期
     * @param <int> unixTime    待时间戳(秒)
     * @param <bool> isFull    返回完整时间(Y-m-d 或者 Y-m-d H:i:s)
     * @param <int>  timeZone   时区
     */
    UnixToDate: function (unixTime, isFull, timeZone) {
        if (typeof (timeZone) == 'number') {
            unixTime = parseInt(unixTime) + parseInt(timeZone) * 60 * 60;
        }
        var time = new Date(unixTime * 1000);
        var ymdhis = "";
        ymdhis += Time.GetTwo(time.getUTCFullYear()) + "-";
        ymdhis += Time.GetTwo((time.getUTCMonth() + 1)) + "-";
        ymdhis += Time.GetTwo(time.getUTCDate());
        if (isFull === true) {
            ymdhis += " " + Time.GetTwo(time.getUTCHours()) + ":";
            ymdhis += Time.GetTwo(time.getUTCMinutes()) + ":";
            ymdhis += Time.GetTwo(time.getUTCSeconds());
        }
        return ymdhis;
    },
    GetTwo:function(value){
        if(value.toString().length===1){
            return '0'+value;
        }
        return value;
    }
};

RuiDa.Tool = {
    getString:function(str,len){
        //return str;
        if(str.length&&str.length>len){
            return str.substring(0,len)+'...';
        }else{
            return str;
        }
    },
    //如果图片加载失败则加载默认图片
    getDefpicInit:function(){
        $(window).load(function() {
            $('img').each(function() {
                if (!this.complete || typeof this.naturalWidth == "undefined" || this.naturalWidth == 0) {
                    this.src = 'img/default.gif';
                }
            });
        });
    },
    //如果图片加载失败则加载默认图片
    getDefpic:function(){
        $('img').each(function() {
            if (!this.complete || typeof this.naturalWidth == "undefined" || this.naturalWidth == 0) {
                this.src = 'img/default.gif';
            }
        });
    },

    //判断设备类型
    deviceType: function () {
        var checker = {
            ios: navigator.userAgent.match(/(iPhone|iPod|iPad)/i),
            blackberry: navigator.userAgent.match(/BlackBerry/i),
            android: navigator.userAgent.match(/Android/i),
            windows: navigator.userAgent.match(/windows/i)
        };
        if (checker.android) {
            return "android";
        } else if (checker.ios) {
            return "ios";
        } else if (checker.blackberry) {
            return "blackberry";
        } else if (checker.windows) {
            return "windows";
        } else {
            return "";
        }
    },
    //判断字符是否有效
    isValid: function (value) {
        if (value)
            return true;
        else
            return false;
    },
    //返回当前的索引
    indexOf: function (arr, val) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] == val) return i;
        }
        return -1;
    },
    //移除当前元素
    remove: function (arr, val) {
        var index = indexOf(arr, val);
        if (index > -1) {
            arr.splice(index, 1);
        }
    },
    count: function (o) {
        var t = typeof o;
        if (t === 'string') {
            return o.length;
        } else if (t === 'object') {
            var n = 0;
            for (var i in o) {
                n++;
            }
            return n;
        }
        return false;
    },
    //获取url参数值
    GetRequest: function () {
        var url = location.search; //获取url中"?"符后的字串
        var theRequest = new Object();
        if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            strs = str.split("&");
            for (var i = 0; i < strs.length; i++) {
                theRequest[strs[i].split("=")[0]] = decodeURIComponent(strs[i].split("=")[1]);
            }
        }
        return theRequest;
        //调用方法
        //var Request = new Object();
        //Request = GetRequest();
        //var 参数1, 参数2, 参数3, 参数N;
        //参数1 = Request['参数1'];
    },
    GetData2: function (time) {
        return new Date(parseInt(time) * 1000).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
    },
    GetData: window.Time.UnixToDate,
    //6月25日
    GetDataYM: function (unixTime) {
        var time = new Date(unixTime * 1000);
        var ymdhis = "";
        ymdhis += time.getUTCFullYear() + "-";
        ymdhis += time.getUTCMonth() + "-";
        ymdhis += time.getUTCDate();
        return ymdhis;
    },
    RuleNum: function (strid) { //输入规则：只能输入数字或点号
        $(strid).attr("onkeyup", "this.value=this.value.replace(\/[^\\d.]\/g,'')")
            .attr("onblur", "this.value=this.value.replace(\/[^\\d.]\s/g,'')");
    },
    getSafeData: function (value) {
        if (value) {
            if (RuiDa.Check.isMHMobile(value)) {
                return value.substr(0, value.length - 4) + '****';
            }
        }
        return '';
    },
    removeSessionItem_rebate:function(){
        //要清理下session留下的数据
        if(sessionStorage.rebateCloneEl != null && sessionStorage.rebateCloneEl != "" && sessionStorage.rebateCloneEl != "undefined"){
            sessionStorage.removeItem("rebateCloneEl");
            sessionStorage.removeItem("rebateSearchCondition");
        }
    }
};

RuiDa.Alert = {
    //显示一个定制的警告框，依赖于 PhoneGap
    //'手机号不能为空', '', '警告', '返回修改'
    showAlert: function (msg, bacFn, title, btnName) {
        if (navigator.notification) {
            navigator.notification.alert(
                msg,                 //要显示的信息
                function () {
                },       //警告被忽略的回调函数
                title,               //标题
                btnName || '好'             //按钮名称
            )
        } else {
            alert(msg)
        }
    },
    //弹出对话框，带回调，btn===1,为第一个按钮，btn===2为第二个按钮
    showConfirm:function(msg,title,backFn,btns){
            navigator.notification.confirm(
                    msg,                 //要显示的信息
                    backFn,             //警告被忽略的回调函数
                    title,               //标题
                    btns||'取消,确定'           //按钮名称
             )
    }
};

RuiDa.Module.PostUser();

function Loading(targetNode){
    this._targetNode = targetNode  || $("section");
    this._loadingEl = null;
    this.init();
    this.addEvent();
}

Loading.prototype={
    constructor:Loading,
    init:function(){

        //创建元素
        var markLayout = document.createElement("div");
            markLayout.className="loading";
            markLayout.id="showLoading";
        var img = document.createElement("img");
        img.src = "images/wait.gif";
        markLayout.appendChild(img);
        this._loadingEl = markLayout;
        //ajax过滤器,用于监听ajax状态
        $.ajaxPrefilter(function(options) {
            options.global = true;
            options.timeout=20000;
        });

    },
    addLoading:function(){
        //页面中没有loading元素，并且loading已经初始化完毕
        if(this._loadingEl){
            //将内容插入到指定的元素中去（前面），是用jquery
             this._targetNode.prepend(this._loadingEl);
        }
    },
    removeLoading:function(){
        if($("#showLoading")){
                 $("#showLoading").remove();
        }
    },
    addEvent:function(){
        var _this = this;
        $(document).ajaxStart(function(){
            _this.addLoading();
        }).ajaxStop(function(){
            _this.removeLoading();
        }).ajaxSuccess(function(event, request, settings){
            _this.removeLoading();
        }).ajaxError(function(event,request, settings){
            _this.removeLoading();
        });
    }

};
RuiDa.Module.checkcon();
RuiDa.Module.convertClassByIosVer();

function onEvent(tag, label, duration) {
	//prompt("event", JSON.stringify({tag:tag,label:label, duration:duration}));
}

function onKVEvent(tag, map, duration) {
	//map.id = tag;
	//map.duration = duration;
	
	//prompt("ekv", JSON.stringify( map ));
}

$(document).ready(function(e) {
    $('*').filter(function(index) {
        return $(this).attr('ev') != undefined;
    }).on('click', function(e) {
        onEvent('click', $(this).attr('ev'));
		 //RuiDa.Alert.showAlert($(this).attr('ev'));
    });
}, false);

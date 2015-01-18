/**
 * Created by SZRD_WEB on 2014/11/10.
 */
var SZRD_JS = {};

window.player = new(function(){
        var audio;
            playList = [];
        this.init = function(target){
            var self = this;
            audio = target;
            audio.addEventListener('ended',function(){
                 // alert("播放结束");
            });
            audio.addEventListener('loadedmetadata',function(){
                 // alert("播放错误a");
                 audio.play();
            });
            audio.addEventListener('error',function(){
                SZRD_JS.alert('播放失败，点击按钮重新播放');
            });
            audio.addEventListener('timeupdate',function(){

            });
            audio.addEventListener('canplay',function(){
                audio.play();
            })
        };
        this.play=function(order){
            var self = this;
            if(typeof order == 'string' && !parseInt(order)){
                // alert(order);
                audio.src = order;
                audio.load();
                // setTimeout(function(){
                //     audio.play();
                // },200)
                
            }
        }
})


//事件判断
SZRD_JS.judgeEvent = function () {
    var device = 'ontouchstart' in window ? 'MD' : 'PC';
    window.EventStart = device == 'MD' ? 'touchstart' : 'mousedown';
    window.EventEnd = device == 'MD' ? 'touchend' : 'mouseup';
};

//打开积分规则
SZRD_JS.activity = function () {
    $('#activityBtn').on(EventStart, function () {
        var html =
            '<div class=".shadow" id="activityShadow"></div>' +
            '<div id="activityInfo">' +
            '<div class="fill-air"></div>' +
            '<div class="activity-inner">' +
            '<h2>积分规则</h2>' +
            '<a href="javascript:" id="activityClose"></a>' +
            '<div class="hide_div">' +
            '<ul>' +
            '<li>1、每日登陆增加1分，连续登录A周额外加分：<br/>连续一周额外加10分；<br/>连续二周额外加20分；<br/>连续三周额外加30分；</li>' +
            '<li>2、当天学习N个词加N分，每天最多40题；最多40分；</li>' +
            '<li>3、单词考核按单词得分，每天考核20个单词，每答对一个单词加2分。每天12个题目（10个选择题，2个连线题）；</li>' +
            '<li>4、首次参加当天背单词及单词考核可加分，完成当天学习之后的重复学习不加分也不抽奖。</li>' +
            '</ul>' +
            '<h6>&nbsp;</h6>' +
            '<h2>抽奖规则</h2>' +
            '<ul>' +
            '<li>1、每天参加活动者可参与抽奖，只完成学习和考核有机会抽取到移动电源、10元充值卡、积分；</li>' +
            '<li>2、从活动开始当天算起，连续10天参加者可抽取红米手机一部。</li>' +
            '<li>3、累计积分最高前100名同学，将有机会抽取最终大奖：</li>' +
            '<li>第一名：小米4</li>' +
            '<li>第二名：小米3</li>' +
            '<li>第三名：红米</li>' +
            '<li>&nbsp;</li>' +
            '</ul>' +
            '</div>' +
            '</div>' +
            '</div>';
        $('body').append(html);

        $('#activityClose').on(EventStart, function () {
            $('#activityShadow, #activityInfo').remove();
        });
    });
};

SZRD_JS.ajax = function (json, fun) {
    $.ajax(json).done(fun);
};

SZRD_JS.judgeEvent();
SZRD_JS.activity();

//用来删除数组中的某一项，下标开始
//通过合并返回删除项的前后数据
Array.prototype.del = function (n) {
    if (n < 0) return this;
    Array.prototype.del = function (n) {
        if (n < 0) return this;
        //slice()截取数组中的一段数据，concat 合并两个数组返回新数组
        return this.slice(0, n).concat(this.slice(n + 1, n.length));
    };
    return this.slice(0, n).concat(this.slice(n + 1, n.length));
};

$('body').height($(window).height());
$(window).resize(function () {
    if ($(window).height() <= $(window).width()) {
        $('html,body').height($(window).height());
    } else {
        $('body').height($(window).height());
    }
});

// 配置数据
var BaseUrl = "http://46.iciba.com/";
var StartDate = "2014-11-20";
var MP3Url = "http://res.iciba.com/resource/amp3/";

//临时存储  
var TempCache = {
    cache: function (value) {
        sessionStorage.setItem("KingSoftTempCache", value);
    },
    getCache: function () {
        return sessionStorage.getItem("KingSoftTempCache");
    },
    setItem: function (key, value) {
        if (!window.localStorage) {
            if (typeof value == 'object') value = JSON.stringify(value);
            SZRD_JS.setCookie(key, value);
        } else {
            localStorage.setItem(key, JSON.stringify(value));
        }
    },
    setItemOfKingSoft: function (key, value) {
        if (!key || !value) return;

        var userInfo = TempCache.getItem("userBaseInfoForKingSoft");
        userInfo[key] = value;
        TempCache.setItem("userBaseInfoForKingSoft", userInfo);
    },
    getItem: function (key) {
        if (!window.localStorage) {
            return SZRD_JS.getCookie(key) ? JSON.parse(SZRD_JS.getCookie(key)) : undefined;
        } else {
            return JSON.parse(localStorage.getItem(key));
        }
    },
    removeItem: function (key) {
        if (!window.localStorage) {
            SZRD_JS.delCookie(key);
        } else {
            return localStorage.removeItem(key);
        }
    },
    removeAllItem:function(){
        if(!window.localStorage){
            SZRD_JS.resetCookie();
        }else{
            localStorage.clear();
            sessionStorage.clear();
        }
    }
};

SZRD_JS.alert = function (con) {
    var html =
        '<div class="alert">' +
        '<span>' + con + '</span>' +
        '</div>';

    $('body').append(html);

    setTimeout(function () {
        $('.alert').remove();
    }, 2000);
};


SZRD_JS.Util = function (argName) {

    var calcuDateDiffer = function () {
        //暂时取客户端时间
        var currentDate = new Date(),
            currentY = currentDate.getFullYear(),
            currentM = currentDate.getMonth() + 1,  //月份从 0 - 11 ，0代表1
            currentD = currentDate.getDate();

        var startY = StartDate.substring(0, StartDate.indexOf('-')),
            startM = StartDate.substring(5, StartDate.lastIndexOf('-')),
            startD = StartDate.substring(StartDate.length, StartDate.lastIndexOf('-') + 1);

        var differ = ((Date.parse(currentM + '/' + currentD + '/' + currentY) - Date.parse(startM + '/' + startD + '/' + startY)) / 86400000);

        return Math.abs(differ);
    };

    var getQueryString = function () {
        var reg = new RegExp("(^|&)" + argName + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return r[2];
        return null;
    };

    return {
        calcuDateDiffer: calcuDateDiffer,
        getQueryString: getQueryString
    }
};

SZRD_JS.getDiffer = function (date1, date2) {
    return (new Date(date1) - new Date(date2)) / 86400000;
};

SZRD_JS.delCookie = function (name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = SZRD_JS.getCookie(name);
    if (cval != null)
        document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
};
SZRD_JS.getCookie = function (name) {
    var arrStr = document.cookie.split("; ");
    for (var i = 0; i < arrStr.length; i++) {
        var temp = arrStr[i].split("=");
        if (temp[0] == name) return unescape(temp[1]);
    }
    return undefined;
};
SZRD_JS.setCookie = function (name, value, expire, path) {
    // expire = expire || 30 * 24 * 60 * 60 * 1000;
    // path = path || '/';
    // var date = new Date();
    // date.setTime(date.getTime() + expire);
    // document.cookie = name + "=" + encodeURIComponent(value) + "; expires=" + date.toUTCString() + "; path=" + path;
    // return $;

    document.cookie = name + "=" + value;
};
SZRD_JS.resetCookie = function () {
    var cookieName = ['userBaseInfoForKingSoft', 'startChongci', 'currentQuestionSum', 'scoreForKingSoft', 'currentQuestionSum', 'onlineView', 'appleOver', 'myHistory'];

    for (var i = 0, len = cookieName.length; i < len; i++) {
        SZRD_JS.delCookie(cookieName[i]);
    }
};

SZRD_JS.exitApp = function (_this) {
    SZRD_JS.alert('双击退出');
    var userInfo = TempCache.getItem("userBaseInfoForKingSoft");

    _this.off().on(EventStart, function () {
        SZRD_JS.ajax({
            url: BaseUrl + 'logout.php',
            type: 'POST',
            dataType: 'json',
            data: {
                cc: userInfo.cc,
                user_id: userInfo.user_id
            }
        }, function (data) {
            if (data.status == 0) {
                // SZRD_JS.resetCookie();
                TempCache.removeAllItem();
                SZRD_JS.delCookie("cc");
                SZRD_JS.delCookie("user_id");
                window.location.href = 'index.html';
            } else {
                SZRD_JS.alert(data.msg);
            }
        });
    });

    var fun = arguments.callee;
    setTimeout(function () {
        _this.off().on(EventStart, function () {
            fun($(this));
        });
    }, 1000);
};

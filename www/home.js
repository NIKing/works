/*
 首页代码
 */
var adIndex = 0,
    timer,
    autoTimer;

var home = (function() {
    return {
        run: toRun
    };

    //广告图的滚动
    function adMove(el) {
        clearInterval(autoTimer);

        var ind = 0;
        var start = el.scrollLeft;
        var end = el.clientWidth * adIndex;
        var change = end - start;
        var max=$('#adWrap li').length;

        clearInterval(timer);
        timer = setInterval(function() {
            ind++;
            if (ind == 20) {
                $('.ad_btn_wrap a').eq(adIndex).css('background', 'black');
                clearInterval(timer);
                autoTimer = setInterval(function() {
                    adIndex++;
                    if (adIndex >= max) {
                        adIndex = 0;
                    };
                    $('.ad_btn_wrap a').css('background', '#888888');
                    adMove(document.getElementById('adWrap'));
                }, 3333);
            }
            el.scrollLeft = Tween.Expo.easeOut(ind, start, change, 20);
        }, 33);
    }

    function bindEvent(){
        //广告事件
        $('#adWrap').on('touchstart', 'img', function(event) {
            var wrap = $(this).parent().parent().parent();
            adIndex = $(this).parent().index();
            pageXStart = event.originalEvent.targetTouches[0].pageX;
        });

        $('#adWrap').on('touchend', 'img', function(event) {
            pageXEnd = event.originalEvent.changedTouches[0].pageX;
            if (pageXEnd - pageXStart > 30 && adIndex != 0) {
                // 左移
                adIndex--;
                $('.ad_btn_wrap a').css('background', '#888888');
                adMove(document.getElementById('adWrap'));
            } else if (pageXEnd - pageXStart < -30 && adIndex + 1 != $('#adWrap li').length) {
                // 右移
                adIndex++;
                $('.ad_btn_wrap a').css('background', '#888888');
                adMove(document.getElementById('adWrap'));
            }
        });

        autoTimer = setInterval(function() {
            adIndex++;
            if (adIndex >= 4) {
                adIndex = 0;
            }
            $('.ad_btn_wrap a').css('background', '#888888');
            adMove(document.getElementById('adWrap'));
        }, 3333);
    }

    function bindClick(key,id){
        $('#pic_'+key).on('touchstart', function(event) {
            var pageYStart = event.originalEvent.targetTouches[0].pageY;
            $(this).on('touchend', function(event) {
                var pageYEnd = event.originalEvent.changedTouches[0].pageY;
                if(Math.abs(pageYStart - pageYEnd)===0) {
                    window.location.href = 'index_binner.html?id='+id;
                }
                $(this).off('touchend');
            });
        });
    }

    function setuserid(){
            cordova.exec(function() {}, function() {}, 'SharePlugin', 'setid',[localStorage.userid]);
    }

    function guide(){
        //localStorage.isguide='1';
        //RuiDa.Module.Guide_Init();
        //localStorage.guide_home1='1';
        //localStorage.guide_home2='1';
        if(localStorage.isguide==='1'){
            $('#guide1,#guide2').hide();
        }else{
            if(localStorage.guide_home1==='0'){
                $('#guide1').show();
                $('#guide2').hide();
                $('#guide_next1').bind('click',function() {
                    localStorage.guide_home1='1';
                    $('#guide1').hide();
                    $('#btn2').click();
                });
            }else if(localStorage.guide_home2==='0'){
                $('#guide1').hide();
                $('#guide2').show();
                $('#guide_next2').click(function() {
                    localStorage.guide_home2='1';
                    $('#guide2').hide();
                    $('#btn6').click();
                });
            }else{
                $('#guide1,#guide2').hide();
            }
            RuiDa.Module.GetGuide();
        }
    }
    function toRun() {
        document.addEventListener("deviceready", setuserid, false);
       
        $("#totalLeBi").bind("click",function(){
            setTimeout(function(){
                sessionStorage.money_manager_url = "2";
                window.location.href = "money_manager.html";
            },400);
        });

        $("#totalFans").bind("click",function(){
            setTimeout(function(){
                sessionStorage.home_allfans = "1";
                window.location.href = "fans_direct.html";
            },400);
        });

        // 本页数据
        $.ajax({
            url: localStorage.hostAddress + 'index.php?c=api&m=index',
            type: 'GET',
            dataType: 'jsonp'
        }).done(function(data) {
                $('#totalLeBi').text(data.num1||'0');
                $('#totalFans').text(data.num2||'0');
                $('#newLebi').text(data.num3||'0');
                $('#newFans').text(data.num4||'0');
                $('.message_num').text(data.newscount);

                var picinfo=data.banner,html='';
				  // 暂时性的写死，以后要关联后台
				  var mypicinfo = [{"id":"1"},{"id":"2"},{"id":"3"}];
                var strpic=['1.gif','2.gif','3.gif'];

                //$('#adWrap ul').first().empty();
                $('.ad_btn_wrap').empty();
                for(var key in mypicinfo){
                    html+='<li><img id="pic_'+key+'" src="ad2/'+strpic[key]+'" ev="btn_bannerad_'+key+'" /></li>';
                    $('.ad_btn_wrap').append('<a href="javascript:;"></a>');
                }
                $('#adWrap ul').first().empty().append(html);

                bindEvent();
                for(var key in mypicinfo){
                    bindClick(key,key);
                }

                setTimeout(function(){
                    RuiDa.Module.initIScroll();
                },200);
            }).fail(function() {
                console.log("error");
            });


        // 等待加载PhoneGap
        document.addEventListener("deviceready", function() {
            // 监听退出
            document.addEventListener("backbutton", confirmExit, false);
        }, false);

       /* //中部导航
        RuiDa.Module.bindClickBtnByArr({
           *//* '.btn_wrap #btn1': 'rebate.html',*//*
            '.btn_wrap #btn2': 'ad_payoff.html',
            '.btn_wrap #btn3': 'recommend.html',
            '.btn_wrap #btn4': 'rank.html',
            // '.btn_wrap .btn5': 'withdraw.html',
            '.btn_wrap #btn6': 'fans_invite.html'
        });*/
        //中部导航
        RuiDa.Module.bindClickBtnByArr({
            //'#btn1': 'rebate.html',
            //'#btn2': 'ad_payoff.html',
            //'#btn3': 'recommend.html',
            '#btn4': 'rank.html',
            //'.btn5': 'withdraw.html',
            '#btn6': 'fans_invite.html'
        });

        RuiDa.Module.bindClickDelayArr({
            '#btn2': 'ad_payoff.html',
            '#btn1': 'rebate.html',
            '#btn3': 'recommend.html'
        });

        $("#btn3").bind("click",function(){
            sessionStorage.removeItem("rebateSearchCondition_recommend");
             sessionStorage.removeItem("rebateCloneEl_recommend");
        });


        $(".btn5").bind("click",function(){
            window.location.href = "withdraw.html";
            sessionStorage.withdraw_urlType = 2;  //1:资金管理；2：首页
        });

        //导航
        guide();

        RuiDa.Module.initBottomNav();
    }

    function exitApp() {
        navigator.app.exitApp();
    }

    function confirmExit() {
        document.removeEventListener("backbutton", confirmExit, false);
        document.addEventListener("backbutton", exitApp, false);
        setTimeout(function() {
            document.removeEventListener('backbutton', exitApp, false);
            document.addEventListener("backbutton", confirmExit, false);
        }, 3000);
    }
})();

home.run();

/*
    个人中心
*/
window.Person = (function() {
    function start() {

        $("#f_zijinguanli").bind("touchstart",function(){
            sessionStorage.money_manager_url = "1";
        });

        if(sessionStorage.my_fansinfo === "1"){
            sessionStorage.my_fansinfo=false;
        }

        $("#f_wodefensi").bind("touchstart",function(){
            sessionStorage.my_fansinfo = "1";
        });

      /*  $('#f_zijinguanli').bind('click',function(){
            setTimeout(function(){
                window.location.href='money_manager.html';
            },300);
        });*/
        RuiDa.Module.bindClickBtnByArr({
            '#f_fensi': 'person_list.html', //个人中心（个人资料）
            '#f_gerenzhongxin': 'person_list.html', //个人中心（个人资料）
            //'#f_xiaoxitishi': 'messageDistribution.html', //消息提示
            //'#f_zijinguanli': 'money_manager.html', //资金管理
            //'#f_chengzhangjilu': 'growth.html', //成长记录
            //'#f_wodefensi': 'fans.html', //我的粉丝
            //'#f_wodeshoucang': 'collect.html', //我的收藏
            '#f_bangzhuzhongxin': 'help.html' //帮助中心
        });
        RuiDa.Module.bindClickDelayArr({
            '#f_xiaoxitishi': 'messageDistribution.html', //消息提示
            '#f_zijinguanli': 'money_manager.html', //资金管理
            '#f_chengzhangjilu': 'growth.html', //成长记录
            '#f_wodefensi': 'fans.html', //我的粉丝
            '#f_wodeshoucang': 'collect.html'//我的收藏
        });

        RuiDa.Module.initBottomNav();
        RuiDa.Module.initIScroll();
        RuiDa.Module.backHome();
        getData();

        //加载失败则添加默认图片
        RuiDa.Tool.getDefpicInit();

        // 退出监听
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

// 等待加载PhoneGap
        document.addEventListener("deviceready", function() {
            document.addEventListener("backbutton", confirmExit, false);
        }, false);

    }

    function getData() {
        // 本页数据
        $.ajax({
            url: localStorage.hostAddress + 'index.php?c=api&m=usercenter',
            type: 'GET',
            dataType: 'jsonp'
        }).done(function(data) {
            $("#f_newscount").html(data.countnews);
            $("#f_fensi").html(data.fensi);
            
            $(".cl1_t1").html(data.info.nickname);
            $("#f_headpic").attr('src', RuiDa.Module.getPic(data.info.headpic, 'img/goods.jpg'));
        }).fail(function(error) {
            console.log(error);
        });
    }
    return {
        start: function(){
            start();
        }
    }
})();

window.Person.start();



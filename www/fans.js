/*
    粉丝
*/
window.Fans = (function() {

    var isscroll=false;

    function start() {
        $('header span').on('touchstart', function() {
            window.location.href = 'fans_explain.html';
        });

        if(sessionStorage.my_fansinfo ==='1'){
            RuiDa.Module.backUrl('person.html');
        }else{
            RuiDa.Module.backHome();
        }

        RuiDa.Module.bindClickBtnByArr({
            '#fans1': 'fans_contact.html',
            '#fans2': 'fans_direct.html',
            '#fans3': 'fans_invite.html',
            '#fans4': 'fans_my.html'
        });

        RuiDa.Module.initBottomNav();
        //RuiDa.Module.backUrl('person.html');
        //RuiDa.Module.backHistory();
        GetData();
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

    function GetData() {
        var url = localStorage.hostAddress + 'index.php?c=api&m=wodefensi';
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'jsonp'
        }).done(function(datalist) {
            $('#fansPic').attr('src', RuiDa.Module.getPic(datalist.userinfo.headpic , 'img/default.gif'));
            $('#name').text(datalist.userinfo.nickname);
            $('#fansNum').text('粉丝' + datalist.all + '人');
            $('#fans_dir').text(datalist.zhijie);
            $('#fans_con').text(datalist.guanlian);
                setTimeout(function(){
                    if(!isscroll){
                        RuiDa.Module.initIScroll();
                        isscroll=true;
                    }else{
                        RuiDa.Module.refreshIScroll();
                    }
                },200);
        }).fail(function() {
            console.log("error");
        });
    }
    return {
        start: start
    }
})();
window.Fans.start();
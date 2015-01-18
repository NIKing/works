/*
 个人中心代码
 */
window.Person_list = (function() {
    function start() {
        RuiDa.Module.initIScroll();
        RuiDa.Module.backUrl('person.html');

        $(".dou").each(function(){
            $(this).click(function(){
                var pageId = $(this).attr("id"),
                    url = "";

                if(pageId == "info"){

                   url = "personalData.html";
                }else if(pageId =="manage"){
                    url = "my_pay.html";
                }else{
                    url ="x_Password.html";
                }

                window.location.href=url;

            })
        });

       /* $('#submit_out').bind('touchend', function() {
            exit();
        });*/

        $('#submit_out').bind('touchend', function() {
            window.RuiDa.Alert.showConfirm('您确定退出登录么？', '提示', function (btn) {
                if(btn===2) exit();
            });
         });
        sessionStorage.userinfo=localStorage.phoneNum+'|'+localStorage.password; //{'id':localStorage.userid,'pwd':localStorage.password };
    }

    function exit() {

        localStorage.phoneNum = '';
        localStorage.password = '';
        localStorage.userid = '';
        window.location.href = 'index.html';
    }

    return {
        start: start
    };
})();

window.Person_list.start();

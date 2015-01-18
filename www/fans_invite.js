/*
    粉丝邀请代码
*/
var invite = (function() {

    return {
        run: toRun
    };

    function guide(){
        if(localStorage.isguide==='1'){
            $('#guide').hide();
        }else{
            if(localStorage.guide_fans_invite==='0'){
                $('#guide').show();
                $('#guide_next1').click(function() {
                    localStorage.guide_fans_invite='1';
                    $('#guide').hide();
                    $("#weixin_invite").click();
                });
                $('#guide_next2').click(function() {
                    localStorage.guide_fans_invite='1';
                    $('#guide').hide();
                    $("#phone_invite").click();
                });
            }else{
                $('#guide').hide();
            }
            RuiDa.Module.GetGuide();
        }
    }

    function toRun() {
        //导航
        guide();

        RuiDa.Module.initIScroll();
        RuiDa.Module.backHistory();

        var inviteType = 0; // 0:QQ空间；1：新浪微博；2：腾讯微博；3：微信朋友圈；4：人人;5：微信好友；6：通讯录好友；7：腾讯QQ

        //邀请微信好友
        $("#weixin_invite").bind('click',function(){
            inviteType = 5;
            postInviteByCordova(inviteType);
        });

        // 通讯录好友
        $("#phone_invite").bind('click',function(){
            inviteType = 6;
            postInviteByCordova(inviteType);
        });
        // 3：微信朋友圈
        $("#friend_share").bind('touchstart',function(){
            inviteType = 3;
            postInviteByCordova(inviteType);
        });
        // 1：新浪微博
        $("#sina_share").bind('touchstart',function(){
            inviteType = 1;
            postInviteByCordova(inviteType);
        });
        // 0:QQ空间
        $("#QQKJ_share").bind('touchstart',function(){
            inviteType = 0;
            postInviteByCordova(inviteType);
        });
        // 7：腾讯QQ
        $("#QQ_share").bind('touchstart',function(){
            inviteType = 7;
            postInviteByCordova(inviteType);
        });
        // 2：腾讯微博
        $("#QQWB_share").bind('touchstart',function(){
            inviteType = 2;
            postInviteByCordova(inviteType);
        });
        // 4：人人
        $("#renren_share").bind('touchstart',function(){
            inviteType = 4;
            postInviteByCordova(inviteType);
        });

        function postInviteByCordova(type){
            if(type <0)return;

            var str="邀请码为："+localStorage.affid+",米米，这软件我每天上下班用，能赚个水电费钱。强烈推荐你也下个试试";
            var content='';

            if(type===5||type===3){//微信或朋友圈
                content =  [str,"http://www.52mimi.cn/images/mimilogo.png","http://appapi.52mimi.cn/index.php?c=api&m=os_down",type];
            }else if(type===6){//通讯录
                str+=",下载地址为: http://www.52mimi.cn/";
                content =  [str,"","http://www.52mimi.cn/",type];
            }else{
                str+=",下载地址为： http://www.52mimi.cn/ ";
                content =  [str,"http://www.52mimi.cn/images/mimilogo.png","http://www.52mimi.cn/",type];
            }
            /*  if(type===5){
             content =  ["邀请码为"+localStorage.affid+" 米米，这软件我每天上下班用，能赚个水电费钱。强烈推荐你也下个试试 ,为：","http://www.52mimi.cn/images/logo.png","http://appapi.52mimi.cn/index.php?c=api&m=os_down",type];
             }*/
            /*var content =  ["米米，这软件我每天上下班用，能赚个水电费钱。强烈推荐你也下个试试  http://182.92.183.18/  ,邀请码为："+localStorage.affid,"","http://mmm.fyhqy.com/index.php?c=api&m=os_down",type];
            if(type===5){
                content =  ["米米，这软件我每天上下班用，能赚个水电费钱。强烈推荐你也下个试试 ,邀请码为："+localStorage.affid,"","http://mmm.fyhqy.com/index.php?c=api&m=os_down",type];
            }*/
            //var content =  ["米米上逛一圈，发现一款好商品，大牌的品质地摊的价格，亲，你也看看? http:\\www.baidu.com+,邀请码为："+localStorage.phoneNum,"","",type];
            cordova.exec(function() {
                window.RuiDa.Alert.showAlert('分享成功', '', '成功', '确定');
            }, function() {
                window.RuiDa.Alert.showAlert('分享失败', '', '提示', '确定');
            }, 'SharePlugin', 'share',content);
        }
        getData();
    }

    function getData(){
        var url= localStorage.hostAddress +'index.php?c=api&m=yaoqing_count';
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'jsonp'
        }).done(function(data) {
                $('#yaoqingnum').text(data.count);
            }).fail(function() {
                console.log("error");
            });
    }
})();

invite.run();
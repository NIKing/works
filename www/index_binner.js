/*
 帮助页代码
 */
window.Index_binner = (function() {
    var  Request=RuiDa.Tool.GetRequest()
        ,id=Request['id']
        ,strpic=['1a.gif','2a.gif','3a.gif'];
       // 暂时写死，以后跟后台关联
    function start() {
        RuiDa.Module.backUrl('home.html');
        RuiDa.Module.initIScroll();
        $('img').attr('src','ad2/'+strpic[id]);
        $('.btngo'+id).live('click',function(){
            setTimeout(function(){
                window.location.href= id==='1'?'ad_payoff.html':'fans_invite.html';
            },400);
        });
        $('#btngo').addClass('btngo'+id);
    }

    function getInfo(){
        $('title').text(arrlist[id]);
        $('h1').text(arrlist[id]);
        $('.scrollInner >div').each(function(){
            $(this).hide();
        });
        $('#info_'+id).show();
    }

    return {
        start: start
    }
})();
window.Index_binner.start();

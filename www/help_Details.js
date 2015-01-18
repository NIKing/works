/*
	帮助页代码
*/
window.Help = (function() {
    var navlist={
            '1':'新手引导'
            ,'2':'常见问题'
            ,'3':'产品介绍'
            ,'4':'功能机制'
            ,'5':'注册密码'
            ,'6':'积分墙'
            ,'7':'提现说明'
        },
        arrlist=['新手引导','常见问题','产品介绍','功能机制','注册密码','积分墙','提现说明'];

    var  Request=RuiDa.Tool.GetRequest(),id=Request['id'];


    function start() {
        RuiDa.Module.backUrl('help.html');
        RuiDa.Module.initIScroll();
        getInfo();
    }

    function getInfo(){
        $('title').text(arrlist[id]);
        $('h1').text(arrlist[id]);
        $('.scrollInner >div').each(function(){
            $(this).hide();
        });
        $('#info_'+id).show();
    }



    function getData() {
        var url = localStorage.hostAddress + 'index.php?c=api&m=help';
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'jsonp'
        }).done(function(datalist) {
            var data = datalist.list,
                html = '';
            for (var key in data) {
                html += '<p>' + data[key].title + '<br>' + data[key].content + '</p>';
            }
            $('.scrollInner').append(html);
            RuiDa.Module.refreshIScroll();
        }).fail(function() {
            console.log("error");
        });
    }

    return {
        start: start
    }
})();
window.Help.start();
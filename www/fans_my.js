/*
	我的邀请人代码
*/
window.Fans_my = (function() {
    function start() {
        //RuiDa.Module.backUrl('fans.html');
        RuiDa.Module.backHistory();
        getData();
        //加载失败则添加默认图片
        RuiDa.Tool.getDefpicInit();

    }

    function getData() {
        var url = localStorage.hostAddress + 'index.php?c=api&m=wodeyaoqingren';
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'jsonp'
        }).done(function(datalist) {
                console.log(222,datalist);
                if(datalist.hasOwnProperty('result')&&!datalist.result) {
                    $('#dongtai').text('没有动态');
                    return;
                }
                var data=datalist.info;
                //RuiDa.Module.binClick('#dongtai', 'dynamic.html?name='+ (data.nickname||data.mobile));
                RuiDa.Module.binClick('#dongtai', 'dynamic.html?id='+(data.id || "0")+'&name='+ (data.nickname||data.mobile));

                $('#all').text(datalist.all||'0');
                $('#name').text(data.nickname || data.mobile);
                $('#zhijie').text(datalist.zhijie);
                $('#guanlian').text(datalist.guanlian);
                $("#diqu").html(data.diqu || "暂无");
                $("#qianming").html(data.qianming || "暂无");
                $("#mobile").html(data.mobile || "暂无");

                setTimeout(function(){
                    RuiDa.Module.initIScroll();
                },300)

        }).fail(function() {
            console.log("error");
        });
    }

    return {
        start: start
    }
})();
window.Fans_my.start();
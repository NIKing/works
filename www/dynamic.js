/*
	动态代码
*/

/*//广告图的滚动
var iScroll = new iScroll('iScroll', {
	vScrollbar: false
});*/
window.Ad_payoff=(function(){

    var  Request=RuiDa.Tool.GetRequest(),name=Request['name'],id=Request['id'];

    function start(){

        $('#name').text(name);
       //RuiDa.Module.initIScroll();
       //RuiDa.Module.backUrl('fans_my.html');


    	$('#backBtn').on('touchstart', function() {
    		window.history.go(-1);
    	});


        getData();
    }


    function getData(){
        var url= localStorage.hostAddress +'index.php?c=api&m=dongtai&id='+id;
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'jsonp'
        }).done(function(datalist) {
                var html='',data=datalist.list;
                for(var key in data){
                    html+='<div class="time_wrap"><img src="images/circle_hover.png" class="dot" />';
                    html+='<span class="time">'+RuiDa.Tool.GetData(data[key].createtime,true,8)+'</span></div>';
                        html+='<div class="con_wrap"><div class="con">'+data[key].description;
                    html+='</div></div>';
                }
                $('#scrollInner').empty().append(html);

                setTimeout(function(){
                    RuiDa.Module.initIScroll();
                },300)

            }).fail(function() {
                console.log("error");
            });
    }
    return {
        start:start
    }
})();
window.Ad_payoff.start();
/*
	收支明细
*/
window.Ad_payoff = (function() {
    var isfirstScroll=true;
    //1购买商品获得2分享商品获得3下载获得4点击广告获得5通过好友获得6送给好友7使用8邀请好友9推荐获得10提现11后台发放
    var typearr = {
          /*  'type1': '1',
            'type2': '9',
            'type3': '8',
            'type4': '4'*/
            'type1': '1',
            'type2': '9',
            'type3': '8',
            'type4': '3',
            'type5': '56'
        },
       /* 超级返利 11
        邀请 8
        广告 3
        我要推荐 9*/
        strtype = {
            '1': 'type1',
            '2': 'type3',
            '3': 'type2',
            '4': 'type4',
            '5': 'type5'
        },
        Request = RuiDa.Tool.GetRequest();

    function start() {
        $(".p_details ul li").on("click", function() {
            var index = $(this).index();
            var aside = $(".p_details>aside");
            $(this).addClass("light").siblings().removeClass("light");
            aside.eq(index).css({
                "display": "block"
            }).siblings().not("ul").css({
                "display": "none"
            });
        });

        if (Request.hasOwnProperty('type')) {
            $('#' + strtype[Request['type']]).addClass("light").siblings().removeClass("light");
            getData(typearr[strtype[Request['type']]], $('#' + strtype[Request['type']]).text());
        } else
            getData(typearr['type1'], '值得买');
        bindType();

        RuiDa.Module.backUrl('money_manager.html');
    }

    function bindType() {
        $('.p_details li').each(function() {
            $(this).bind('touchstart', function() {
                $(this).addClass("light").siblings().removeClass("light");
                getData(typearr[$(this).attr('id')], $(this).text());
            });
        });
    }

    function getData(type, title) {
        var url = localStorage.hostAddress + 'index.php?c=api&m=shouzhimingxi&type=' + type;
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'jsonp'
        }).done(function(datalist) {
                console.log(2222,datalist);
            var html = '',
                data = datalist.list;
            for (var key in data) {

                var times = RuiDa.Tool.GetData(data[key].createtime, true,8);
                if(times !=null && times != ""){
                    times = times.substring(0,10);
                }else{
                    times = '时间';
                }

                html += '<li><p class="p_top"><strong>' + title + '</strong><b>+' + data[key].jifen + '米币</b></p>';
                html += '<p><i>' + (data[key].description || '某商品') + '</i><em>' + times+ '</em></p></li>';
            }
            $('#content').empty();
            if (data.length > 0) {
                $('#content').append(html);
            }
                if(isfirstScroll){
                    RuiDa.Module.initIScroll();
                    isfirstScroll=false;
                }else
                    RuiDa.Module.refreshIScroll();

        }).fail(function() {
            console.log("error");
        });
    }

    return {
        start: start
    }
})();
window.Ad_payoff.start();
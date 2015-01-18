/*
	排行榜代码
*/
var rank = (function() {
    var strtype={'商品分享榜':'shangpinfenxaingbang','积分榜':'haoyoujifenbang','邀请榜':'haoyouyaoqingbang'},
        strlogo=['<img src="images/champion.png" />','<img src="images/runner_up.png" />','3','4','5'],
        strdata={'商品分享榜':'fenxiang','积分榜':'jifen','邀请榜':'yaoqing'},
        isfirstScroll=true;




	function toRun() {
		RuiDa.Module.initBottomNav();
		RuiDa.Module.backHome();
        getData(strtype['商品分享榜'],strdata['商品分享榜']);
        $('.con_main ul > li').each(function(){
                $(this).bind('touchend', function() {
                    //$(this).addClass("hover").parent().siblings().find('span').removeClass("hover");
                    $(this).addClass("light").siblings().removeClass("light");
                    var navType = $(this).text();
                    getData(strtype[navType],strdata[navType]);
                });
            }
        );

	}
    function getData(urltype,type){
        var url= localStorage.hostAddress +'index.php?c=api&m='+urltype;
        console.log('1111111111111111url',urltype);
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'jsonp'
        }).done(function(datalist) {
                console.log('222222',datalist);
                var html='',data=datalist.list;
                for(var key in data){
                    var nickName = data[key].nickname;
                    nickName = nickName.length > 8 ? nickName.substring(0,7)+"...":nickName;
                    html+='<li class="'+(key==='0'?'lifirst':'')+'"><div class="rank_logo">'+strlogo[key]+'</div>';
                    html+='<img src="'+RuiDa.Module.getPic(data[key].headpic,'img/default.gif')+'" class="portrait" />';
                    html+='<div class="info"><span class="name">'+( nickName ||RuiDa.Tool.getSafeData(data[key].mobile))+'</span>'; //nickname
                    html+='<span class="running_days Num-type">'+(data[key][type]||'0')+'</span></div>';
                    html+='<div class="in_days"></div></li>';
                }
                $('#iScroll ul').first().empty().append(html);
                setTimeout(function(){
                    //加载失败则添加默认图片
                    $('#iScroll li>img').each(function() {
                        if (!this.complete || typeof this.naturalWidth == "undefined" || this.naturalWidth == 0) {
                            this.src = 'img/default.gif';
                        }
                    });
                },100)

                setTimeout(function(){
                    if(isfirstScroll){
                        RuiDa.Module.initIScroll();
                        isfirstScroll=false;
                    }else
                        RuiDa.Module.refreshIScroll();
                },200)

            }).fail(function() {
                console.log("error");
            });
    }
    return {
        run: toRun
    };
})();

rank.run();
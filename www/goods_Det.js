/*
 商品详情代码
 */
window.Goods_details = (function() {
    var Request = new Object(),
        Request = RuiDa.Tool.GetRequest(),
        goodsid = Request['id'],
        url= Request['url'],

        picarr={'1':'images/love.png','2':'images/love_hover.png'},
        picstr={'1':'2','2':'1'},
        isShoucang=false;

    function start() {
        $('#iframe').attr('src',decodeURIComponent(url));
        frames["iframe"].scrollTop ="110";
        $("#backBtn").bind("touchend",function(){
            window.history.go(-1);
        })
    }
    return {
        start: start
    }
})();
window.Goods_details.start();
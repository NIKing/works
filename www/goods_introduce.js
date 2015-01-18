/*
 商品详情代码
 */
window.Goods_details = (function () {
    var Request = new Object(),
        Request = RuiDa.Tool.GetRequest(),
        goodsid = Request['id'],
        picstr={'0':'love','1':'love_hover'},
        isclickzan = true,
        strzidie={'1':'查看详情','2':'收起'},
        strdian={'1':'2','2':'1'},
        str='1',
        desciption='';

    function start() {
        RuiDa.Module.initBottomNav();
        RuiDa.Module.backUrl('recommend.html');
        RuiDa.Module.initIScroll();
        goodsid ? getData() : console.log("商品的id传值有问题");

    }

    function zidie(){
        if(desciption.length<=32){
            $('#zidie').hide();
            return;
        }
        $('#zidie').bind('click',function(){
            if(str==='1'){
                $('#des').text(desciption);
                $(this).text(strzidie[strdian[str]]);
                str=strdian[str];
            }else{
                $('#des').text(RuiDa.Tool.getString(desciption,32));
                $(this).text(strzidie[strdian[str]]);
                str=strdian[str];
            }
            window.iScroll.refresh();
        });
    }

    function getData() {
        var url = localStorage.hostAddress + 'index.php?c=api&m=fabu_details&id=' + goodsid;
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'jsonp'
        }).done(function (data) {
                desciption=data.description;
                //desciption='韩国代购两件套一字领短袖条纹T恤女高腰裙裤子韩版显瘦休闲韩版显瘦休闲';
                $('#goodsImg').attr('src', RuiDa.Module.getPic(data.pic1, 'img/goods_big.jpg'));
                //$('.decription').text(data.name);
                $('#name').text(data.name);
                $('#des').text(RuiDa.Tool.getString(desciption,32));
                $('.money').text(parseFloat(data.price || '0').toFixed(2));
                $('.share_number').text((data.fenxiang || '0') + '人分享');
                $('.love').attr('src','images/'+picstr[data.ifzan]+'.png');
                $('.love').bind('click',function(){
                    if(parseInt(data.ifzan)===0&&isclickzan){
                        getZan(goodsid);
                    }
                });
                zidie();
                //需要对每个图片设置监听事件
                $(".scrollInner img").load(function () {
                    setTimeout(function () {
                        window.iScroll.refresh();
                    }, 1000)

                })
            }).fail(function () {
                console.log("error");
            });
    }

    function getZan(id){
        isclickzan=false;
        var url= localStorage.hostAddress +'index.php?c=api&m=dianzan&id='+id;
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'jsonp'
        }).done(function(datalist) {
                $('.love').attr('src','images/'+picstr[1]+'.png');
            }).fail(function() {
                console.log("error");
            });
    }

    return {
        start: start
    }
})();
window.Goods_details.start();
/*
    粉丝详情代码
*/
window.Fans_details = (function() {
    var Request = new Object(),
        Request = RuiDa.Tool.GetRequest(),
        fansid = Request['fansid'];

    function start() {

        getData();

     /*   $("#letter").bind("touchend",function(){
            window.history.go(-1);
        })*/

        RuiDa.Module.initIScroll();
        //RuiDa.Module.backHistory();//fans_direct.html
        if(sessionStorage.fans_info==='1'){
            RuiDa.Module.backUrl('messageDistribution.html');
        }else if(sessionStorage.fans_info==='3'){
            RuiDa.Module.backUrl('user_askforandgive.html');
        }else{
            RuiDa.Module.backUrl('fans_direct.html');
        }
        //RuiDa.Module.backUrl('fans_direct.html');
    }

    function getData() {
        var url = localStorage.hostAddress + 'index.php?c=api&m=fensixiangqing&id=' + fansid;
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'jsonp'
        }).done(function(datalist) {
            $('#fansPic').attr('src', RuiDa.Module.getPic(datalist.info.headpic, 'img/fans.png'));
            $('#all').text(datalist.all||'0');
            $('#name').text(datalist.info.nickname||datalist.info.mobile);
            $('#fansNum').text('粉丝' + datalist.all + '人');
            $('#fansNum_zj').text(datalist.zhijie||0);
            $('#fansNum_gl').text(datalist.guanlian||0);
            $('#diqu').text(datalist.info.diqu||'');
            $('#qianming').text(datalist.info.qianming||'');
            $('#mobile').text(datalist.info.mobile);

            var arr = {
                '#letter': 'letter.html?fansid='+fansid,
                '#stateBtn': 'dynamic.html?name='+ (datalist.info.nickname||datalist.info.mobile),
                '#sentletter': 'f_letter.html?fansid=' + datalist.info.id+'&name=' + (datalist.info.nickname||datalist.info.mobile)
            };
            RuiDa.Module.bindClickBtnByArr(arr);
        }).fail(function() {
            console.log("error");
        });
    }

    return {
        start: start
    }
})();
window.Fans_details.start();
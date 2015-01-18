/*
	添加支付宝1页代码
*/
window.Letter = (function() {
    var  Request=RuiDa.Tool.GetRequest(),fansid=Request['fansid'];
    function start() {
        // 后退监听
        RuiDa.Module.backUrl('fans_details.html?fansid='+fansid);
        RuiDa.Module.initIScroll();

        getData();
    }

    function vScroRefresh() {
        setTimeout(function() {
            iScroll.refresh();
        }, 200);
    }

    function getData() {
        var url = localStorage.hostAddress + 'index.php?c=api&m=letter_list';
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'jsonp'
        }).done(function(datalist) {
            var data = datalist.list,
                html = '',
                arr = {};
            for (var key in data) {
                html += '<li id="letter_id' + data[key].id + '"><p style="padding-top:15px"><span>' + data[key].mobile + '</span><em>' + RuiDa.Tool.GetData(data[key].createtime || new Date().getDate(), true,8);
                html += '<img src="images/next.png"/> </em></p><p>' + data[key].content + '</p></li>';
                arr['#letter_id' + data[key].id] = 'message_details.html?id=' + data[key].id;
            }
            $('.letter ul').first().append(html);
            RuiDa.Module.bindClickBtnByArr(arr);
            vScroRefresh();
        }).fail(function() {
            console.log("error");
        });
    }

    return {
        start: start
    }
})();
window.Letter.start();
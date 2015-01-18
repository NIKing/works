/*
 直接粉丝代码
 */
window.Fans_direct = (function () {
    function start() {
        RuiDa.Module.initIScroll();
        RuiDa.Module.backUrl('money_manager.html');
        sessionStorage.fans_info = '3';

        getData();
    }

    $('#searchBtn').bind('touchstart', function () {
        var str = $('#searchContent').val();
        if (!str || str === '请输入关键字') {
            $('.seek').empty().append('<li>关键字不能为空</li>');
            return;
        }
        if (str || str !== '请输入关键字') {
            getSearch(str);
        }
    });

    function getSearch(str) {
        var url = localStorage.hostAddress + 'index.php?c=api&m=get_fensi_search';
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'jsonp',
            data: {
                key: str
            }
        }).done(function (datalist) {
                gethtml(datalist);
            }).fail(function () {
                console.log("error");
            });
    }


    function getData() {
        //var url = localStorage.hostAddress + 'index.php?c=api&m=zhijiefensi' + (para && '&key=' + para);
        var url = localStorage.hostAddress + 'index.php?c=api&m=get_user_fensi';
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'jsonp'
        }).done(function (datalist) {
                gethtml(datalist);
            }).fail(function () {
                console.log("error");
            });
    }

    function gethtml(datalist) {
        var html = '',
            data = datalist.list,
            pic = '',
            name = '',
            from = '',
            id = '',
            arr = {};
        if (!data.length) {
            $('.seek').empty().append('<li>暂无结果</li>');
            return;
        }
        for (var key in data) {
            id = data[key].id;
            pic = RuiDa.Module.getPic(data[key].headpic, 'img/portrait.png');
            name = data[key].nickname || '';
            if (name.indexOf("暂无昵称") >= 0) {
                name = data[key].mobile;
            }

            from = data[key].from || '';
            html += '<li><div id="fan_' + id + '"><img src="' + pic + '" class="user_pic" />';
            html += '<div class="info_wrap">';
            html += '<span class="name">' + name + '</span>';
            html += '<span class="description">' + from + '</span></div></div>';
            html += '<em id="AandG_A_' + id + '">索要</em><em id="AandG_G_' + id + '">赠送</em></li>';
            arr['#fan_' + id] = 'fans_details.html?fansid=' + id;
            arr['#send_' + id] = 'f_letter.html?fansid=' + id + '&name=' + name;
            arr['#AandG_G_' + id] = 'present.html?fansid=' + id + '&name=' + name + '&type=G';
            arr['#AandG_A_' + id] = 'present.html?fansid=' + id + '&name=' + name + '&type=A';
        }

        $('#iScroll ul').empty();
        $('#iScroll ul').first().append(html);

        RuiDa.Module.bindClickBtnByArr(arr);
    }

    return {
        start: start
    }
})();
window.Fans_direct.start();
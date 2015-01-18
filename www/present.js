/*
 赠送页代码
 */
window.AddPay2 = (function () {
    var Request = RuiDa.Tool.GetRequest()
        , fansid = Request['fansid']
        , name = Request['name']
        , type = Request['type']
        , strtype = {'G': '赠送', 'A': '索要'}
        , para = {'G': '1', 'A': '2'};

    function start() {
        RuiDa.Module.backUrl('user_askforandgive.html');
        $('#type1').text(strtype[type]);
        $('#type2').text(strtype[type]);
        $('#name').text(name);

        RuiDa.Tool.RuleNum('#inputjifen');

        $('#submit').bind('touchstart', function () {
            var strjifen = $('#inputjifen').val();
            if (!strjifen || strjifen === '0') {
                window.RuiDa.Alert.showAlert('请输入积分', '', '警告', '确定');
            } else if (parseFloat(strjifen) > 0) {
                getData(strjifen);
            }
        });
    }

    function getData(strjifen) {


        var url = localStorage.hostAddress + 'index.php?c=api&m=jifen_to_user';
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'jsonp',
            data: {
                userid: fansid,
                type: para[type],
                jifen: strjifen
            }
        }).done(function (data) {
                if (data.result) {
                    RuiDa.Alert.showConfirm(strtype[type] + '成功', '成功', function () {
                        window.location.href="user_askforandgive.html";
                    }, '确定');
                } else
                    window.RuiDa.Alert.showAlert(strtype[type] + '失败', '', '失败', '确定');
            }).fail(function () {
                console.log("error");
            });
    }

    return {
        start: start
    }
})();
window.AddPay2.start();
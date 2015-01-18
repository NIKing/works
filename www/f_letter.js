/*
 发送站内信代码
 */
window.F_letter = (function () {
    var Request = RuiDa.Tool.GetRequest(),
        id = Request['fansid'],
        name = Request['name'];

    function start() {
        var strtitle = $('#content').val();
        $('#name').text(name);
        $('#m_top').bind('touchstart', function () {
            var str = $('#content').val();
            console.log(str);
            if (!str || str === '请输入您需要发送的内容...') {
                window.RuiDa.Alert.showAlert('请输入您需要发送的内容', '', '警告', '确定');
            } else {
                getData(str);
            }
        });

        RuiDa.Module.backHistory();
    }

    function getData(value) {
        var url = localStorage.hostAddress + 'index.php?c=api&m=letter_add&id=' + id + '&content=' + value;
        console.log('url', url);
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'jsonp'
        }).done(function (datalist) {
                console.log('222222', datalist);
                window.RuiDa.Alert.showConfirm('站内信发送成功', '成功', function (btn) {
                    if (btn === 2) {
                        window.location.href = "fans_direct.html";
                    }
                });
            }).fail(function () {
                console.log("error");
            });
    }

    return {
        start: start
    }
})();
window.F_letter.start();
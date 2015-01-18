/*
	帮助页代码
*/
window.User_agreement = (function() {
    function start() {
        RuiDa.Module.backUrl('regist.html');
        RuiDa.Module.initIScroll();
    }

    function getData() {
        var url = localStorage.hostAddress + 'index.php?c=api&m=help';
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'jsonp'
        }).done(function(datalist) {
            var data = datalist.list,
                html = '';
            for (var key in data) {
                html += '<p>' + data[key].title + '<br>' + data[key].content + '</p>';
            }
            $('.scrollInner').append(html);
            RuiDa.Module.refreshIScroll();
        }).fail(function() {
            console.log("error");
        });
    }

    return {
        start: start
    }
})();
window.User_agreement.start();
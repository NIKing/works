/*
    粉丝
*/
window.About_zhongle = (function() {

    function start() {
        $('header span').on('touchstart', function() {
            window.location.href = 'fans_explain.html';
        });

        RuiDa.Module.initIScroll();
        RuiDa.Module.backUrl('messageSet.html');

        var type=RuiDa.Tool.deviceType(),strTypeShow='';
        strTypeShow=type===''?'android':type;
        $('#deviceType').text(strTypeShow.toUpperCase());
    }
    return {
        start: start
    }
})();
window.About_zhongle.start();
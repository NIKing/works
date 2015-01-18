/*
    体验应用代码
*/
var adIndex = 0,
    timer,
    autoTimer;

var Experience_app = (function() {

    function start() {

        RuiDa.Module.backHistory();
        RuiDa.Module.initIScroll();

        $('#closeBtn').on('touchstart', function() {
            window.location.href = 'ad_payoff.html';
        });

        getData();

        //广告事件
        $('#adWrap').on('touchstart', 'img', function(event) {
            var wrap = $(this).parent().parent().parent();
            adIndex = $(this).parent().index();
            pageXStart = event.originalEvent.targetTouches[0].pageX;
        });

        $('#adWrap').on('touchend', 'img', function(event) {
            pageXEnd = event.originalEvent.changedTouches[0].pageX;
            if (pageXEnd - pageXStart > 30 && adIndex != 0) {
                // 左移
                adIndex--;
                $('.ad_btn_wrap a').css('background', '#888888');
                adMove(document.getElementById('adWrap'));
            } else if (pageXEnd - pageXStart < -30 && adIndex + 1 != $('#adWrap li').length) {
                // 右移
                adIndex++;
                $('.ad_btn_wrap a').css('background', '#888888');
                adMove(document.getElementById('adWrap'));
            };
        });

        autoTimer = setInterval(function() {
            adIndex++;
            if (adIndex >= 4) {
                adIndex = 0;
            };
            $('.ad_btn_wrap a').css('background', '#888888');
            adMove(document.getElementById('adWrap'));
        }, 3333);
    }

    //广告图的滚动
    function adMove(el) {
        clearInterval(autoTimer);

        var ind = 0;
        var start = el.scrollLeft;;
        var end = el.clientWidth * adIndex;
        var change = end - start;

        clearInterval(timer);
        timer = setInterval(function() {
            ind++;
            if (ind == 20) {
                $('.ad_btn_wrap a').eq(adIndex).css('background', 'black');
                clearInterval(timer);
                autoTimer = setInterval(function() {
                    adIndex++;
                    if (adIndex >= 4) {
                        adIndex = 0;
                    };
                    $('.ad_btn_wrap a').css('background', '#888888');
                    adMove(document.getElementById('adWrap'));
                }, 3333);
            }
            el.scrollLeft = Tween.Expo.easeOut(ind, start, change, 20);
        }, 33);
    }

    function getData() {
        var url = localStorage.hostAddress + 'index.php?c=api&m=tiyanyingyong';
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'jsonp'
        }).done(function(datalist) {
            var html = '',
                data = datalist.list;
            for (var key in data) {
                html += '<li><img src="' + RuiDa.Module.getPic(data[key].pic, 'img/app_logo.png') + '" />';
                html += '<div><span>' + data[key].title + '</span>';
                html += '<span>下载奖励 <em>' + data[key].jifen + '</em>积分</span>';
                html += '</div><a href="javascript:;">下载</a></li>';
            }
            $('#content').empty();
            $('#content').append(html);
        }).fail(function() {
            console.log("error");
        });
    }

    return {
        start: start
    }
})();

window.Experience_app.start();
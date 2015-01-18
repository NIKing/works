/**
 * Created by SZRD_WEB on 2014/11/10.
 */
SZRD_JS.apple = function () {
    var userInfo = TempCache.getItem("userBaseInfoForKingSoft");

    if (TempCache.getItem('date_no') == undefined) {
        //偏移量默认为当天
        TempCache.setItem('date_no', SZRD_JS.Util().calcuDateDiffer());
    }

    //用户头像，会出现在小汽车上
    $('#userImage').attr('src', userInfo.head_photo);

    if (TempCache.getItem('myHistory') == 1) {
        $('#gamePlan').hide();
    }

    if (userInfo.cet != 4 && userInfo.cet != 6) {
        window.location.href = 'telephone.html';
    }

    var json = {
        url: BaseUrl + 'getwords.php',
        type: 'POST',
        dataType: 'json',
        async: false,
        data: {
            cc: userInfo.cc,
            user_id: userInfo.user_id,
            phone: userInfo.phone,
            cet: userInfo.cet,
            date_no: TempCache.getItem('date_no')
        }
    };

    var wordInfo = null,  //从后台获取的单词
        appleNum = 0;  //已查看单词或者苹果的个数

    //点击苹果
    $('#appleWrap img').on(EventStart, function () {
        $(this).hide();
        $('#gameInfoWrap').hide();

        //显示单词信息
        showWordInfo(appleNum++);
    });

    if (TempCache.getItem('appleOver') == 1) {
        $('#wordStartBtn, #carWrap').show();
        $('#appleWrap, #gameInfoWrap').hide();
        $('#basket').hide();
        TempCache.removeItem('appleOver');
    } else {
        SZRD_JS.ajax(json, function (data) {
            if (data.status == 0) {
                wordInfo = JSON.parse(data.result);
                preload(appleNum);
            } else {
                SZRD_JS.alert(data.msg);
            }
        });
    }

    //点击收获
    $('#harvestBtn').on(EventStart, function () {
        $('#wordWrap').hide();

        $('.shadow').remove();

        if (judgeAppleIsOver() && appleNum >= 40) {
            $('#wordStartBtn, #carWrap').show();
            $('#basket').hide();
        }

        $('#gamePlan').text('已收获' + appleNum + '分');
        changeBasketImg();
    });

    var audio = new Audio();
    //点击声音按钮
    $('#playBtn').on(EventStart, function () {
        //var index = appleNum % 10 == 0 ? 9 : appleNum % 10 - 1;
        //$('audio')[0].play();
        //
        //$('audio')[0].addEventListener('ended', function () {
        //    this.removeEventListener('ended', arguments.callee, false);
        //    $('audio').remove();
        //    $('body').append('<audio src="' + audio.src + '"></audio>');
        //}, false);
        // audio.play();
        // audio.load();
        // alert($(window).height());
         window.player.play($(this).attr('_url'));
        //var ua = window.navigator.userAgent;
        //if (ua.indexOf('M356') != -1){
        //    var audio
        //}
    });

    $('#wordStartBtn').on(EventStart, function () {

        var scoreConfig = {
            option: 1,  //选项
            level: 0,    //关卡
            score: appleNum
        };

        var userScore = TempCache.getItem("scoreForKingSoft");

        if (!userScore || userScore == "" || userScore == undefined) {
            TempCache.setItem('currentQuestionSum', 0);
            TempCache.setItem("scoreForKingSoft", scoreConfig);
        }

        TempCache.setItem("appleOver", 1);
        window.location.href = 'word.html';
    });

    function showWordInfo(index) {
        var data = wordInfo[index];

        $('#wordNum').text(index + 1 + '/40');
        $('#word').text(data.word);
        $('#soundmark').text('[' + data.pronounce + ']');

        if (data.mp3 != null) {
            $('#playBtn').attr('_url', data.mp3).show();

            // $('audio').remove();
            // $('body').append('<audio autoplay="autoplay" src="' + data.mp3 + '"></audio>');
            // audio.src = wordInfo[appleNum - 1].mp3;

            window.player.init($('audio')[0])
            // alert(data.mp3);
            window.player.play(data.mp3);

        } else {
            $('#playBtn').hide();
        }

        //单词的中文
        var meaningHtml = '';
        data.meaning = JSON.parse(data.meaning);
        if (!$.isEmptyObject(data.meaning)) {
            for (var i in data.meaning) {
                meaningHtml += i + data.meaning[i] + '<br />';
            }
            $('#translate').html(meaningHtml);
        }

        //单词的例句（考点）
        var kdHtml = '';
        data.kd = JSON.parse(data.kd);
        if (!$.isEmptyObject(data.kd)) {
            $('.example-title').show();
            for (var i in data.kd) {
                kdHtml += data.kd[i] + '<br />';
            }
        } else {
            $('.example-title').hide();
        }
        $('#exampleSentence').html(kdHtml);

        //频率信息
        $('#info').html(
            '<span>已在' + userInfo.cet + '级考试中出现</span>' +
            '<span>' + data.frequence + '次</span>'
        );

        //颜色的选择
        var colors = ['#ff8b00', '#ed403a', '#07c527'],
            index = parseInt(Math.random() * 3);

        $('#harvestBtn').css({
            'background': 'url(img/harvest' + (index + 1) + '.png) no-repeat 0 0',
            'background-size': '100% 100%'
        });
        $('#wordNum, #info').css('color', colors[index]);
        $('#playBtn img').attr('src', 'img/play-btn' + (index + 1) + '.png');

        $('#wordWrap').show();

        //位置的一些控制
        $('.word-title').css('height', 'auto').children('div').remove();
        if ($('.word-title').height() > 43) {
            $('#word').after('<div></div>');
        }

        var height = $('#wordWrap').outerHeight();
        $('#wordWrap').css('margin-top', -height / 2).show().before('<div class="shadow"></div>');
    }

    function judgeAppleIsOver() {
        var isOver = true;
        $('#appleWrap img').each(function () {
            if ($(this).css('display') == 'block') {
                isOver = false;
                return false;
            }
        });

        if (isOver && appleNum < 40) {
            preload(appleNum);
        }

        return isOver;
    }

    function preload(num) {
        $('#appleWrap img').show();

        //var arrUrl = [];
        //for (var i = num, len = num + 10; i < len; i++) {
        //    arrUrl.push(wordInfo[i].mp3);
        //}
        //
        //$('audio').remove();
        //var i,
        //    len = arrUrl.length;
        //for (i = 0; i < len; i++) {
        //    $('body').append('<audio src="' + arrUrl[i] + '"  preload="true"></audio>')
        //}
    }

    function changeBasketImg() {
        if (appleNum > 0 && appleNum <= 5) {
            $('#basket').attr('src', 'img/basket1.png');
        } else if (appleNum > 5 && appleNum <= 10) {
            $('#basket').attr('src', 'img/basket2.png');
        } else if (appleNum > 10 && appleNum <= 15) {
            $('#basket').attr('src', 'img/basket3.png');
        } else if (appleNum > 15 && appleNum <= 20) {
            $('#basket').attr('src', 'img/basket4.png');
        } else if (appleNum > 20 && appleNum <= 25) {
            $('#basket').attr('src', 'img/basket5.png');
        } else if (appleNum > 25 && appleNum <= 30) {
            $('#basket').attr('src', 'img/basket6.png');
        } else if (appleNum > 30) {
            $('#basket').attr('src', 'img/basket7.png');
        }
    }
};

$(function () {
    SZRD_JS.apple();
});

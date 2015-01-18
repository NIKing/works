/**
 * Created by SZRD_WEB on 2014/11/10.
 */
$.fn.extend({
    "close": function () {
        //var that = this,el = that[0];
        this.hide();
        $("#perform_home").show();
        $(".perform_footer").show();
    }
});

SZRD_JS.perform = function () {
    var userInfo = TempCache.getItem("userBaseInfoForKingSoft"),
        winCurrentDiff = 0,
        todayIsTest = 0; //当天是否做过 0 :未做过

    //积分排名等信息
    function getScroleAndRand() {
        SZRD_JS.ajax({
            url: BaseUrl + 'getimprove.php',
            type: 'POST',
            dataType: 'json',
            async: false,
            data: {
                cc: userInfo.cc,
                user_id: userInfo.user_id
            }
        }, function (data) {
            if (data.status == 0) {
                var result = JSON.parse(data.result);
                $('.rankingList strong').text(result.user_order);
                $('.integral strong').text(result.score);

                if (userInfo.cet == 6) {
                    $('.word p').text('六级单词提升');
                } else {
                    $('.word p').text('四级单词提升');
                }

                $('.word strong').text(parseInt(result.improve) / 100 + '%');

                todayIsTest = result.is_test;

                if (result.is_test == 0) {
                    $('#chongciWrap').show();
                } else if (result.is_test == 1) {
                    $('#overWrap').show();
                }
            } else {
                SZRD_JS.alert(data.msg);
            }
        });
    }

    getScroleAndRand();

    //我的历程
    $('#myHistoryBtn').on(EventEnd, function () {
        $(".perform, .perform_footer").hide();

        var json = {
            url: BaseUrl + 'gethistory.php',
            type: 'POST',
            dataType: 'json',
            async: false,
            data: {
                cc: userInfo.cc,
                user_id: userInfo.user_id
            }
        };

        SZRD_JS.ajax(json, function (data) {
            if (data.status == 0) {
                var results = data.result,
                    tds = $('.perform_myHistory td');


                //存在那种结果为空的情况
                //if (results.length != 0) {
                    var i,
                        len = SZRD_JS.Util().calcuDateDiffer();

                    for (i = 0; i < len; i++) {
                        $('.perform_myHistory td[diff]').eq(i).css({
                            'background': 'url(img/perform_calendar_fail.png) no-repeat center center',
                            'background-size': '40% 40%'
                        }).attr('_hasDone','1');
                    }

                    var i,
                        len = results.length;

                    for (i = 0; i < len; i++) {
                        var result = results[i];

                        tds.each(function () {
                            if ($(this).attr('diff') == result.date_no && result.status == "1") {
                                //if (result.status == 0) {
                                //    $(this).css({
                                //        'background': 'url(img/perform_calendar_fail.png) no-repeat center center',
                                //        'background-size': '40% 40%'
                                //    });
                                //} else if (result.status == 1) {
                                    $(this).css({
                                        'background': 'url(img/perform_calendar_success.png) no-repeat center center',
                                        'background-size': '40% 40%'
                                    }).attr('_hasDone','0');
                                //}
                            }
                        });
                    }
                //}

                var currentDate = new Date();
                currentDateY = currentDate.getFullYear();
                currentDateM = currentDate.getMonth() + 1;
                currentDateD = currentDate.getDate();

                if (currentDateM == 11) {
                    currentDiff = currentDateD - 25;
                } else if (currentDateM == 12) {
                    currentDiff = currentDateD + 10;
                } else {
                    SZRD_JS.alert('本地日期错误');
                    return;
                }

                winCurrentDiff = currentDiff;

                if (currentDiff < -4) {
                    SZRD_JS.alert('本地日期错误');
                    return;
                }

                $('.perform_myHistory_tips').text('距离' + userInfo.cet + '级考试还有' + (25 - currentDiff) + '天');

                tds.each(function () {
                    if ($(this).attr('diff') == currentDiff) {
                        $(this).css({
                            'background': 'url(img/perform_calendar_today.png) no-repeat center center',
                            'background-size': '40% 60%'
                        }).attr('_hasDone','2');
                        return false;
                    }
                });
            } else {
                SZRD_JS.alert(data.msg);
            }
        });

        $(".perform_myHistory").show();
    });

    //点击我的历程
    $('.perform_myHistory td').on(EventStart, function () {
        if ($(this).attr('date')) {
            var date_no = $(this).attr('diff'),
                hasDone = $(this).attr('_hasDone'); //用来标记是补习还是做过，并且判断是否是当天

            if (date_no > winCurrentDiff) {
                return;
            }
            //如果是当天并且没有做过题就不要做任何动作
            if(hasDone == '2' && todayIsTest == 0) return;

            if(hasDone == '0' || hasDone == '2'){
                TempCache.setItem('myHistory', 1);
            }else{
                TempCache.removeItem('myHistory');
            }
            TempCache.removeItem('scoreForKingSoft');
            TempCache.setItem('date_no', date_no);
            window.location.href = 'apple.html';
        }
    });

    //我的榜单
    $('#rankBtn').on(EventEnd, function () {
        $(".perform, .perform_footer, #rankInfo li").hide();

        var json = {
            url: BaseUrl + 'getrank.php',
            type: 'POST',
            dataType: 'json',
            async: false,
            data: {
                cc: userInfo.cc,
                user_id: userInfo.user_id
            }
        };

        SZRD_JS.ajax(json, function (data) {
            if (data.status == 0) {
                results = data.result;

                var i,
                    len = results.length,
                    wrap = null,
                    result = null;

                for (i = 0; i < len; i++) {
                    wrap = $('#rankInfo li').eq(i).show();
                    result = results[i];

                    if (i == 5 && len == 6) {
                        if (len == 6) {
                            wrap.hide();
                            wrap = $('#rankInfo li').eq(i + 1).show().css('margin-top', '10px');
                        } else {
                            break;
                        }
                    }

                    if (i == 6) {
                        wrap = $('#rankInfo li').eq(i).show().css('margin-top', '0px');
                    }

                    if (i > 2) {
                        wrap.children('.rank-number').text(result.user_order);
                    }

                    wrap.children('.user-name').text(result.user_name);
                    wrap.children('.rank-integral').text(result.score);
                    wrap.children('.user-img').attr('src', result.user_head);
                }

                getScroleAndRand();
            } else {
                SZRD_JS.alert(data.msg);
            }
        });

        $('#rankInfo').show();
    });

    //点击分享
    $("#btnShare").on(EventEnd, function () {
        $(".perform, .perform_footer").hide();
        $("#performShare").show();
    });

    //关闭事件
    $(".perform_share_close").on(EventEnd, function () {
        $("#performShare").close();
    });

    $(".perform_myHistory_colse").on(EventEnd, function () {
        $(".perform_myHistory").close();
    });

    $(".perform_rankInfo_close").on(EventEnd, function () {
        $("#rankInfo").close();
    });

    $("#lotteryCloseBtn").on(EventEnd, function () {
        $("#lotteryWrap").close();
    });

    $('#qiandaoClose').on(EventEnd, function () {
        $("#qiandaoWrap").close();
    });

    //分享到QQ
    // $("#perform_share_QQZone").on(EventEnd, function () {
    //     var p = {
    //         url: location.href,
    //         showcount: '1', /*是否显示分享总数,显示：'1'，不显示：'0' */
    //         desc: '', /*默认分享理由(可选)*/
    //         summary: '你被CET搞疯了吗？！1200个高频词汇，300道考题例句，30天考前冲刺，11.20-12.19与词霸一起“玩”单词抽大奖，你也一起来吧~', /*分享摘要(可选)*/
    //         title: '词霸收获之旅', /*分享标题(可选)*/
    //         site: '金山词霸', /*分享来源 如：腾讯网(可选)*/
    //         pics: '', /*分享图片的路径(可选)*/
    //         style: '203',
    //         width: 98,
    //         height: 22
    //     };
    //     var s = [];
    //     for (var i in p) {
    //         s.push(i + '=' + encodeURIComponent(p[i] || ''));
    //     }

    //     window.location.href = "http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?" + s.join('&');

    //     // document.write(['<a version="1.0" class="qzOpenerDiv" href="http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?',s.join('&'),'" target="_blank">分享</a>'].join(''));
    // });

    //退出登录
    $('#exitBtn').on(EventStart, function () {
        SZRD_JS.exitApp($(this));
    });

    var prize_id = '',
        prize_type = '';
    //点击抽奖
    $('.apple-wrap img').on(EventStart, function () {
        //获取抽奖信息
        SZRD_JS.ajax({
            url: BaseUrl + 'getprize.php',
            type: 'POST',
            dataType: 'json',
            async: false,
            data: {
                cc: userInfo.cc,
                user_id: userInfo.user_id,
                date_no: SZRD_JS.Util().calcuDateDiffer()
            }
        }, function (data) {
            $('.apple-wrap, .lottery-description').hide();

            if (data.status == 0) {
                $('#noPrize').css('display', 'block');
            } else if (data.status == 99) {
                $("#lotteryWrap").close();
                SZRD_JS.alert(data.msg);
            } else {
                $('#congratulations, #getPrizeBtn').css('display', 'block');
                $('#prizeInfo').text(data.msg);
                prize_id = data.prize_id;
                prize_type = data.status;
            }
        });
    });

    $('#getPrizeBtn').on(EventStart, function () {
        $('#getPrizeBtn, #congratulations, #prizeInfo').hide();

        if (prize_type == 2) {
            $('#fillTelephone').show();
        } else if (prize_type == 3) {
            $("#lotteryWrap").close();
            //积分排名等信息
            getScroleAndRand();
        } else {
            $('#fillAddress').show();
        }
    });

    //获得充值卡
    $('#chongzhiBtn').on(EventStart, function () {
        var telephoneNum = $('#telephoneNum').val();

        if (telephoneNum == '') {
            SZRD_JS.alert('信息不能为空');
            return;
        }

        $('#fillTelephone').hide();

        SZRD_JS.ajax({
            url: BaseUrl + 'recordprize.php',
            type: 'POST',
            dataType: 'json',
            async: false,
            data: {
                cc: userInfo.cc,
                user_id: userInfo.user_id,
                date_no: SZRD_JS.Util().calcuDateDiffer(),
                phone: telephoneNum,
                real_name: '',
                addr: '',
                prize_id: ''
            }
        }, function (data) {
            if (data.status == 0) {
                $('#prizeNumWrap').show();
            } else if (data.status == 588) {
                $('#fillAddress').show();
                SZRD_JS.alert(data.msg);
            } else {
                SZRD_JS.alert(data.msg);
            }
        });
    });

    //获得实物奖品
    $('#shiwuBtn').on(EventStart, function () {
        var real_name = $('#namePrize').val(),
            telephoneNum = $('#telephonePrize').val(),
            addr = $('#addressPrize').val();

        if (real_name == '' || telephoneNum == '' || addr == '') {
            SZRD_JS.alert('信息不能为空');
            return;
        }

        $('#fillAddress').hide();

        SZRD_JS.ajax({
            url: BaseUrl + 'recordprize.php',
            type: 'POST',
            dataType: 'json',
            async: false,
            data: {
                cc: userInfo.cc,
                user_id: userInfo.user_id,
                date_no: SZRD_JS.Util().calcuDateDiffer(),
                isp: '',
                phone: telephoneNum,
                real_name: real_name,
                addr: addr,
                prize_id: prize_id
            }
        }, function (data) {
            if (data.status == 0) {
                $('#shiwuPrizeWrap').show();
            } else if (data.status == 588) {
                $('#fillAddress').show();
                SZRD_JS.alert(data.msg);
            } else {
                SZRD_JS.alert(data.msg);
            }
        });
    });

    //点击冲刺
    $('#chongciWrap').on(EventStart, function () {
        TempCache.removeItem('myHistory');
        TempCache.setItem('startChongci', 1);
        // 开始冲刺认为是当前今天的
        TempCache.setItem('date_no',SZRD_JS.Util().calcuDateDiffer());
        window.location.href = 'apple.html';
    });

    function showLottery() {
        $(".perform, .perform_footer").hide();
        $('#lotteryWrap').show();
    }

    //显示抽奖
    if (TempCache.getItem('onlineView') == 1 && TempCache.getItem('startChongci') == 1) {
        TempCache.removeItem('onlineView');
        TempCache.removeItem('startChongci');
        showLottery();
    } else {
        showQiandao();
    }

    //显示签到
    function showQiandao() {
        $(".perform, .perform_footer").hide();

        SZRD_JS.ajax({
            url: BaseUrl + 'getsign.php',
            type: 'POST',
            dataType: 'json',
            data: {
                cc: userInfo.cc,
                user_id: userInfo.user_id,
                date_no : TempCache.getItem('date_no') || SZRD_JS.Util().calcuDateDiffer()
            }
        }, function (data) {
            if (data.is_sign == 0) {
                var result = data.result;

                var i,
                    len = SZRD_JS.Util().calcuDateDiffer();
                $('#qiandaoWrap td[diff]').each(function (index) {
                    if (index == len) {
                        return false;
                    }
                    $(this).css({
                        'background': 'url(img/perform_calendar_fail.png) no-repeat center center',
                        'background-size': '40% 40%'
                    });
                });

                len = result.length;
                for (i = 0; i < len; i++) {
                    $('#qiandaoWrap td[diff]').each(function () {
                        if ($(this).attr('diff') == result[i].date_no) {
                            $(this).css({
                                'background': 'url(img/perform_calendar_success.png) no-repeat center center',
                                'background-size': '40% 40%'
                            });
                            return false;
                        }
                    });
                }

                if (data.serial % 7 == 0) {
                    $('.perform_myHistory_tips').text('已连续签到' + data.serial + '天');
                }

                var currentDate = new Date();
                currentDateY = currentDate.getFullYear();
                currentDateM = currentDate.getMonth() + 1;
                currentDateD = currentDate.getDate();

                if (currentDateM == 11) {
                    currentDiff = currentDateD - 20;
                } else if (currentDateM == 12) {
                    currentDiff = currentDateD + 10;
                } else {
                    SZRD_JS.alert('本地日期错误');
                    return;
                }

                if (currentDiff < -4) {
                    SZRD_JS.alert('本地日期错误');
                    return;
                }

                $('#qiandaoWrap td[diff]').each(function () {
                    if ($(this).attr('diff') == currentDiff) {
                        $(this).css({
                            'background': 'url(img/perform_calendar_today.png) no-repeat center center',
                            'background-size': '40% 60%'
                        });
                        return false;
                    }
                });

                $('#qiandaoWrap').show();
            } else {
                $('#qiandaoWrap').close();
            }
        });
    }

    // 分享
    window.bds_config = {
        'bdDes': '金山词霸',
        'bdText': ' 你被CET搞疯了吗？！1200个高频词汇，300道考题例句，30天考前冲刺，11.20-12.19与词霸一起“玩”单词抽大奖，你也一起来吧~',
        'bdPopTitle': '词霸收获之旅',
        'bdPic': 'http://46.iciba.com/img/shareImg.jpg'
    };
    document.getElementById("bdshell_js").src = "http://bdimg.share.baidu.com/static/js/shell_v2.js?cdnversion=" + Math.ceil(new Date() / 3600000);
};


$(function () {
    SZRD_JS.perform();
});

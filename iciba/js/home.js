$(function () {
    var intCet = 0,
        ENDEV = "ontouchstart" in window ? "touchend" : "click";

    $(".home-cet").bind(ENDEV, function () {
        var index = $(this).data("index");
        intCet = index;

        //设置按钮样式
        $("#btnStartPaly").css({
            'background': 'url(img/start-game-hover.png) no-repeat 0 0',
            'background-size': '100% 100%'
        });

        // 选中的改变背景图片
        $(this).attr({"src": "img/home-cetSelectd.png"});
        if (index == "4") {
            $(".home-cent-6").attr({"src": "img/home-cet6.png"});
        } else {
            $(".home-cent-4").attr({"src": "img/home-cet4.png"});
        }

        // $("#btnStartPaly").attr("src", "img/home-startPaly.png");
        // $("img").attr("src","test.jpg");
    });

    $("#btnStartPaly").bind(ENDEV, function () {
        if (intCet === 0) {

            alert("请选择您要学习的项目");
            return;
        }

        var userInfo = TempCache.getItem("userBaseInfoForKingSoft");
        userInfo.cet = intCet;
        TempCache.setItem("userBaseInfoForKingSoft", userInfo);

        var ajaxConfig = {
            type: 'POST',
            url: BaseUrl + "recordcet.php",
            data: {
                cc: userInfo.cc,
                user_id: userInfo.user_id,
                cet: intCet
            },
            success: function (data) {
                if (!data) return;
                data = JSON.parse(data);
                if (data.status == "0") {

                    // TempCache.setItem('selectView','1');
                    TempCache.setItem('startChongci','1');

                    window.location.href = 'apple.html';
                } else {
                    console.log(data.msg);
                }
            }
        };

        $.ajax(ajaxConfig);
    });

    function initPage() {

        var userInfo = TempCache.getItem("userBaseInfoForKingSoft");
        if (!userInfo) return;

        $("#homeUserHeaderImg").attr("src", userInfo.head_photo || "img/home-MLAO.png");
        $(".home-imgName").html(userInfo.nickname || "飞奔的马里奥");

        var ajaxConfig = {
            type: 'POST',
            url: BaseUrl + "getplayer.php",
            data: {
                cc: userInfo.cc,
                user_id: userInfo.user_id
            },
            success: function (data) {
                if (!data) return;
                data = JSON.parse(data);
                if (data.status == "99") {
                    console.log(data.msg);
                } else {
                    $("#home-people").html(data.result);
                }
            }
        };

        $.ajax(ajaxConfig);
    }

    initPage();

    //退出登录
    $('#exitBtn').on(EventStart, function () {
        SZRD_JS.exitApp($(this));
    });
});
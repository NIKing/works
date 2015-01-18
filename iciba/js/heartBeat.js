// 心跳
SZRD_JS.HeartBeat = function () {

    var heartbeat = null;

    function start() {
        var userInfo = TempCache.getItem("userBaseInfoForKingSoft");

        if (!userInfo) {
            window.location.href = "index.html";
            return;
        }

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
                if (data.status == 0) {
                    heartbeat = setTimeout(function () {
                        start();
                    }, 10000);  //心跳间隔
                } else {
                    if (heartbeat != null) clearTimeout(heartbeat);
                    TempCache.removeAllItem();
                    SZRD_JS.delCookie("cc");
                    SZRD_JS.delCookie("user_id");
                    window.location.href = "index.html";

                }
            }
        };

        $.ajax(ajaxConfig);
    }

    function resetDateNo(){
        
    }

    var init = {
        start: start
    };

    return init;
};

SZRD_JS.HeartBeat().start();
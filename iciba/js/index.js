/**
 * Created by SZRD_WEB on 2014/11/10.
 */
SZRD_JS.login = function () {
    function getLoginInfo() {
        var sessionId = SZRD_JS.Util("cc").getQueryString(),
            user_id = SZRD_JS.Util("user_id").getQueryString(),
            requstConfig = {
                cc: '607c9136272ee590f7831331850d5cdc'
            };

        //用户的信息，需要保存到SessionStorage里面
        var userBaseInfoForKingSoft = {
            cc: "",
            nickname: "",
            head_photo: "",
            phone: "",
            cet: ""
        };

        var ajaxConfig = {
            type: "GET",
            url: BaseUrl + "login.php",
            data: requstConfig,
            success: function (data) {
                if (!data) return;
                // alert(data);
                data = JSON.parse(data);

                if (data.status == "0") { //未登录
                    login(data.login_url);
                } else if (data.status == "1") {
                    userBaseInfoForKingSoft.nickname = data.nickname;
                    userBaseInfoForKingSoft.head_photo = data.head_photo;
                    userBaseInfoForKingSoft.phone = data.phone || "";
                    userBaseInfoForKingSoft.cet = data.cet || 0;
                    userBaseInfoForKingSoft.user_id = user_id || SZRD_JS.getCookie("user_id");
                    userBaseInfoForKingSoft.cc = sessionId || SZRD_JS.getCookie("cc");

                    userBaseInfoForKingSoft.cc = '607c9136272ee590f7831331850d5cdc';
                    userBaseInfoForKingSoft.user_id = '51315F2DFFCA4EE01F8047F7455F787E';

                    TempCache.setItem("userBaseInfoForKingSoft", userBaseInfoForKingSoft);
                    // alert(data.cet);
                    if (data.cet == "0") {
                        window.location.href = "telephone.html";
                    } else {
                        window.location.href = "perform.html";
                    }
                } else {
                    //报错
                }
            }
        };
        $.ajax(ajaxConfig);
    }

    function login(url) {
        $('#qqLogin').on(EventStart, function () {
            window.location.href = url;
        });
    }

    getLoginInfo();
};

$(function () {
    SZRD_JS.login();
    SZRD_JS.alert("内测版本，正式版本上线积分将被清空");
});

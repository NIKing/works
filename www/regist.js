/*
 注册页代码
 */
window.Goods_details = (function () {
    function start() {
        //只能输入数字
        RuiDa.Module.backUrl('index.html');
        $('#regist').bind('click',function(){
            window.location.href='user_agreement.html';
        });
        var isclick = false;

        var targetEl = $(".main");
        var loadingObj = new Loading(targetEl);

        // 获取验证码
        $('#getSeCode').on('touchstart', function () {

            if (isclick) return;
            // 控制60秒只能发送一次
            var _this = $(this),
                timenum = 60,
                phoneNum = $('#phoneNum').val();
            if (!phoneNum) {
                window.RuiDa.Alert.showAlert('手机号不能为空', '', '警告', '返回修改');
                return false;
            }
            if (!RuiDa.Check.isMHMobile(phoneNum)) {
                window.RuiDa.Alert.showAlert('手机号格式不正确', '', '警告', '返回修改');
                return false;
            }

            $('#getSeCode').text(timenum + '秒后重试');
            var timer = setInterval(function () {
                isclick = true;
                $('#getSeCode').text(--timenum + '秒后重试');
                if (timenum == 0) {
                    clearInterval(timer);
                    isclick = false;
                    $('#getSeCode').text('获取验证码');
                }
            }, 1000);

            $.ajax({
                url: localStorage.hostAddress + 'index.php?c=api&m=getcode',
                type: 'GET',
                dataType: 'jsonp',
                data: {
                    mobile: phoneNum
                }
            }).done(function (data) {
                    if (!data.result) {
                        window.RuiDa.Alert.showAlert(data.info, '', '失败', '确定');
                        if (data.info == '该手机号已经注册!') {
                            clearInterval(timer);
                            isclick = false;
                            $('#getSeCode').text('获取验证码');
                        }
                    } else {
                        localStorage.phoneNum = phoneNum;

                        window.RuiDa.Alert.showAlert('验证码已发送，请稍待', '', '成功', '确定');
                    }
                }).fail(function () {
                    window.RuiDa.Alert.showAlert('未知错误，请稍候再试', '', '失败', '确定');
                });
        });

        bindSubmit();
    }

    function bindSubmit() {
        //验证验证码
        $('#confirmBtn').on('touchstart', function () {

            var phoneNum = $('#phoneNum').val(),
                phoneNum_invite = $("#phoneNum_invite").val(),
                securityCode = $('#securityCode').val();

            if(!$('#registsure').attr('checked')){
                window.RuiDa.Alert.showAlert('请确认已阅读并同意米米的相关协议', '', '警告', '返回修改');
                return false;
            }

            if (phoneNum == '') {
                window.RuiDa.Alert.showAlert('手机号不能为空', '', '警告', '返回修改');
                return false;
            }

            if (!RuiDa.Check.isMHMobile(phoneNum)) {
                window.RuiDa.Alert.showAlert('手机号格式不正确', '', '警告', '返回修改');
                return false;
            }

            if (!securityCode || securityCode === '验证码') {
                window.RuiDa.Alert.showAlert('验证码不能为空', '', '警告', '返回修改');
                return false;
            }

            if (securityCode.length !== 6) {
                window.RuiDa.Alert.showAlert('验证码位数为6位', '', '警告', '返回修改');
                return false;
            }

            if (!phoneNum_invite){
                window.RuiDa.Alert.showConfirm('注册邀请码为空，如继续则默认为系统邀请人', '提示', function (btn) {
                   if(btn===2){
                       submitInfo('',securityCode);
                   }
                });
            }else{
                submitInfo(phoneNum_invite,securityCode,phoneNum);
            }
        });
    }
    function submitInfo(invitecode,securityCode,pNum){
        if(securityCode ==null || securityCode=="")return;

        $.ajax({
            url: localStorage.hostAddress + 'index.php?c=api&m=check_randcode',
            type: 'GET',
            dataType: 'jsonp',
            data: {
                yaoqingma: invitecode,
                randcode: securityCode
            }
        }).done(function (data) {

                if (!data.result) {
                    window.RuiDa.Alert.showAlert(data.info, '', '警告', '返回修改');
                } else {
                    window.location.href = 'password.html?type=reg&PNum='+pNum;
                }
            }).fail(function () {
                console.log("error");
            });
    }

    return {
        start: start
    }
})();
window.Goods_details.start();

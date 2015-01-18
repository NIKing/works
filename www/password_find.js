/*
 忘记密码页代码
 */
window.Goods_details=(function(){
    var isclicksubmit=false;
    function start(){
        //只能输入数字
        RuiDa.Module.backUrl('index.html');
        var isclick=false;
        // 获取验证码
        $('#getSeCode').bind('click', function() {
            if(isclick) return;
            isclicksubmit=true;
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
            //$(this).css('clicked');

            $('#getSeCode').text(timenum + '秒后重试');
            var timer = setInterval(function() {
                isclick=true;
                $('#getSeCode').text(--timenum + '秒后重试');
                if (timenum == 0) {
                    clearInterval(timer);
                    //_this.removeAttr('clicked');
                    isclick=false;
                    $('#getSeCode').text('获取验证码');
                }
            }, 1000);

            $.ajax({
                url: localStorage.hostAddress + 'index.php?c=api&m=getpass_getcode',
                type: 'GET',
                dataType: 'jsonp',
                data: {
                    mobile: phoneNum
                }
            }).done(function(data) {
                    if (!data.result) {
                        window.RuiDa.Alert.showAlert(data.info, '', '失败', '确定');
                    } else {
                        localStorage.phoneNum = phoneNum;
                        window.RuiDa.Alert.showAlert('验证码已发送，请稍待', '', '成功', '确定');
                    }
                }).fail(function() {
                    window.RuiDa.Alert.showAlert('未知错误，请稍候再试', '', '失败', '确定');
                });
        });

        bindSubmit();

    }

    function bindSubmit(){


        //验证验证码
        $('#confirmBtn').bind('click', function() {
            if(!isclicksubmit){
                window.RuiDa.Alert.showAlert('请先获取验证码', '', '成功', '确定');
                return;
            }
            var phoneNum = $('#phoneNum').val(),
                securityCode=$('#securityCode').val();
            if (phoneNum == '') {
                window.RuiDa.Alert.showAlert('手机号不能为空', '', '警告', '返回修改');
                return false;
            }
            if (!RuiDa.Check.isMHMobile(phoneNum)) {
                window.RuiDa.Alert.showAlert('手机号格式不正确', '', '警告', '返回修改');
                return false;
            }
            if(!securityCode||securityCode==='验证码') {
                window.RuiDa.Alert.showAlert('验证码不能为空', '', '警告', '返回修改');
                return false;
            }
            if(securityCode.length!==6) {
                window.RuiDa.Alert.showAlert('验证码位数为6位', '', '警告', '返回修改');
                return false;
            }

            $.ajax({
                url: localStorage.hostAddress + 'index.php?c=api&m=check_getpasscode',
                type: 'GET',
                dataType: 'jsonp',
                data: {
                    code: securityCode
                }
            }).done(function(data) {
                    if (!data.result) {
                        window.RuiDa.Alert.showAlert('验证码错误', '', '警告', '返回修改');
                    } else {
                        window.location.href = 'password.html';
                    }
                }).fail(function() {
                    console.log("error");
                });
        });
    }

    return {
        start:start
    }
})();
window.Goods_details.start();
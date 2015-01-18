/*
 设置密码页代码
 */
// 获取验证码
$('#confirmBtn').on('touchstart', function() {
    var password = $('#password').val(),
        rePassword = $('#rePassword').val(),
        Request=RuiDa.Tool.GetRequest(),
        type=Request['type'],
        PNum=Request['PNum'];

    if (password == '') {
        window.RuiDa.Alert.showAlert('密码不能为空', '', '警告', '返回修改');
        return;
    }
    if (rePassword == '') {
        window.RuiDa.Alert.showAlert('请输入二次密码', '', '警告', '返回修改');
        return;
    }
    if (password != rePassword) {
        window.RuiDa.Alert.showAlert('两次密码不一致', '', '警告', '返回修改');
        return;
    }
    var  para = type === 'reg'?'reg_add':'getpass_updatepass';
    $.ajax({
        url: localStorage.hostAddress + 'index.php?c=api&m='+para,
        type: 'GET',
        dataType: 'jsonp',
        data: {
            password: password
        }
    }).done(function(data) {
            if (!data.result) {
                window.RuiDa.Alert.showAlert(data.info, '', '警告', '确定');
            } else {
                var strtitle= type === 'reg'?'注册成功':'密码找回成功';
                RuiDa.Alert.showConfirm(strtitle,'成功',function(){
                    exit(data.data.id,data.data.affid);
                },'确定');
            }
        }).fail(function() {
            console.log("error");
        });
    function exit(userid,affid) {
        if(type === 'reg'){
            localStorage.phoneNum = PNum;
            localStorage.password = password;
            localStorage.userid=userid;
            localStorage.affid=affid;
            window.location.href = 'home.html';
        }else{
            localStorage.phoneNum = '';
            localStorage.password = '';
            localStorage.userid = '';
            window.location.href = 'index.html';
        }
    }

});

// 等待加载PhoneGap
RuiDa.Module.backUrl('regist.html');


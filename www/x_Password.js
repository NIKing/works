/*
	修改密码代码
*/

window.Ad_payoff=(function(){
    function start(){
        RuiDa.Module.backUrl('person.html');

        RuiDa.Module.bindClickBtn('.t_center','password_find.html');

        $('#submit').bind('click', function() {
            var strpwdold=$('#pwdold').val(),
                strpwdnew1=$('#pwdnew1').val(),
                strpwdnew2=$('#pwdnew2').val();
           if(strpwdold&&strpwdnew1&&(strpwdnew1===strpwdnew2)){
               getData(strpwdold,strpwdnew1);
           }else{
               window.RuiDa.Alert.showAlert('填写不完整，请确认', '', '警告', '确定');
           }
        });
        //$('#pwdold').focus();
    }
    function getData(pwdold,pwdnew){
        var url= localStorage.hostAddress +'index.php?c=api&m=update_password';
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'jsonp',
            data:{
                oldpassword:pwdold,
                password:pwdnew
            }
        }).done(function(res) {
                if(res.result){
                    window.RuiDa.Alert.showAlert('修改成功', '', '成功', '确定');
                    
                    window.location.href="person.html";
                }else{
                     window.RuiDa.Alert.showAlert(res.info, '', '警告', '确定');
                }
            }).fail(function() {
                console.log("error");
            });
    }

    return {
        start:start
    }
})();
window.Ad_payoff.start();
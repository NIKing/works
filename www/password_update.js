/*
	设置密码页代码
*/
// 获取验证码
$('#confirmBtn').on('touchstart', function() {
	var password = $('#password').val(),
		rePassword = $('#rePassword').val();

	if (password == '') {
		window.RuiDa.Alert.showAlert('密码不能为空', '', '警告', '返回修改');
		return;
	};
	if (rePassword == '') {
		window.RuiDa.Alert.showAlert('请输入二次密码', '', '警告', '返回修改');
		return;
	};
	if (password != rePassword) {
		window.RuiDa.Alert.showAlert('两次密码不一致', '', '警告', '返回修改');
		return;
	};
	$.ajax({
		url: localStorage.hostAddress + 'index.php?c=api&m=getpass_updatepass',
		type: 'GET',
		dataType: 'jsonp',
		data: {
			password: password
		}
	}).done(function(data) {
		if (!data.result) {
			window.RuiDa.Alert.showAlert(data.info, '', '失败', 'OK');
		} else {
			localStorage.password = password;
			window.RuiDa.Alert.showAlert('密码修改成功', '', '成功', 'OK');
			window.location.href = 'home.html';
		};
	}).fail(function() {
		window.RuiDa.Alert.showAlert('密码修改失败,请稍候再试', '', '失败', 'OK');
	});
});

RuiDa.Module.backUrl('regist.html');
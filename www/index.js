/*
	登录页代码
*/
/*localStorage.hostAddress = 'http://t1.wxwork.cn/'; //全局地址
localStorage.hostAddressINT='http://t1.wxwork.cn/index.php?c=api&userid='+localStorage.userid;
localStorage.f_news = 0; //消息提醒记录清零--王志飞*/

/*localStorage.hostAddress = 'http://mmm.fyhqy.com/'; //全局地址
localStorage.hostAddressINT='http://mmm.fyhqy.com/index.php?c=api&userid='+localStorage.userid;*/

localStorage.hostAddress = 'http://appapi.52mimi.cn/'; //全局地址
 localStorage.hostAddressINT='http://appapi.52mimi.cn/index.php?c=api&userid='+localStorage.userid;
localStorage.f_news = 0; //消息提醒记录清零--王志飞


RuiDa.Module.IsGuide();  //localStorage.isguide='0';//'0'表示刚下完并第一次登录,'1'表示已经导航过
//RuiDa.Module.Guide_Init();

sessionStorage.isfirstlogo="true";

var targetEl = $("body");
var loadingObj = new Loading(targetEl);
var beforePhoneNum='';
if(sessionStorage.isfirstlogo==='true'){
    $('.banner').show();
    setTimeout(function(){
        $('.banner').hide();
    },1200);
    sessionStorage.isfirstlogo='false';
}

if(sessionStorage.userinfo){
    var info=sessionStorage.userinfo.split('|');
    beforePhoneNum=info[0];
    $('#phoneNum').val(info[0]);
    $('#password').val(info[1]);
    sessionStorage.removeItem('userinfo');
}else{
    console.log('不是退出登录的');
}
//如果登录过则自动登录
if (localStorage.phoneNum && localStorage.password) {
	$.ajax({
		url: localStorage.hostAddress + 'index.php?c=api&m=checklogin',
		type: 'GET',
		dataType: 'jsonp',
		data: {
			username: localStorage.phoneNum,
			password: localStorage.password
		}
	}).done(function(data) {
		if (!data.result) {
			window.RuiDa.Alert.showAlert('自动登录失败，请重新重试', '', '失败', '返回登录');
		} else {
            localStorage.userid=data.data;
			window.location.href = 'home.html';
		}
	}).fail(function() {
		console.log("error");
	});
} else {
	$('#welcome').hide();
}

// 登录
$('#login').on('touchend', function() {
    console.log(123,localStorage.hostAddress);
	var phoneNum = $('#phoneNum').val(),
		password = $('#password').val();

	if (phoneNum == '') {
		window.RuiDa.Alert.showAlert('手机号不能为空', '', '警告', '返回修改');
		return;
	}
	if (!phoneNum.match(/\d{11}/)) {
		window.RuiDa.Alert.showAlert('手机号格式不正确', '', '警告', '返回修改');
		return;
	}
	if (password == '') {
		window.RuiDa.Alert.showAlert('请输入密码',"","提醒","确定");		return;
	}

    console.log(1113);

	$.ajax({
		url: localStorage.hostAddress + 'index.php?c=api&m=checklogin',
		type: 'GET',
		dataType: 'jsonp',
		data: {
			username: phoneNum,
			password: password
		}
	}).done(function(data) {
            console.log(4444,data);
		if (!data.result) {
			window.RuiDa.Alert.showAlert(data.info, '', '失败', '返回登录');
		} else {
            /*if(beforePhoneNum!==phoneNum){
                RuiDa.Module.Guide_Init();
            }*/
			localStorage.phoneNum = phoneNum;
			localStorage.password = password;
            localStorage.userid=data.data;
            localStorage.affid=data.affid;
			window.location.href = 'home.html';
		}
	}).fail(function() {
		console.log("error");
	});
});

$(window).resize(function() {
	if ($(window).height() < 500) {
		$('#forgetPassswordBtn').hide();
	} else {
		$('#forgetPassswordBtn').show();
	};
});

// 退出监听
function exitApp() {
	navigator.app.exitApp();
}

function confirmExit() {
	document.removeEventListener("backbutton", confirmExit, false);
	document.addEventListener("backbutton", exitApp, false);
	setTimeout(function() {
		document.removeEventListener('backbutton', exitApp, false);
		document.addEventListener("backbutton", confirmExit, false);
	}, 3000);
}

// 等待加载PhoneGap
document.addEventListener("deviceready", function() {
	document.addEventListener("backbutton", confirmExit, false);
}, false);



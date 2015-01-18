/*
	首页代码
*/
$('#closeBtn').on('touchstart', function() {
	window.location.href = 'fans.html';
});

$('#inviteBtn').on('touchstart', function() {
	window.location.href = 'fans_invite.html';
});

RuiDa.Module.initIScroll();
RuiDa.Module.backHistory();
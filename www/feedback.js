/*
	添加支付宝1页代码
*/
window.Feedback = (function() {

    function submit() {
        $('#m_top').bind('click', function() {
            getData();
        });

        RuiDa.Module.backUrl('messageSet.html');
    }

    function getData() {
        var content = $('textarea').val();
        if (!content || content === '请输入您的意见和建议...') {
            window.RuiDa.Alert.showAlert('请输入您的意见和建议', '', '提示', '确定');
            return;
        }
        var url = localStorage.hostAddress + 'index.php?c=api&m=suggestion_add&content=' + content;
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'jsonp'
        }).done(function(data) {
                if(data.result)
                    window.RuiDa.Alert.showAlert('提交成功', '', '成功', '确定');
                else
                    window.RuiDa.Alert.showAlert('提交失败', '', '失败', '确定');
        }).fail(function() {
            console.log("error");
        });
    }

    return {
        start: submit
    }
})();
window.Feedback.start();
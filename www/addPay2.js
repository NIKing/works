/*
	添加支付宝1页代码
*/
window.AddPay2=(function(){
    var  Request=RuiDa.Tool.GetRequest(),str=Request['str'];
    function start(){

        $('#submit').bind('touchstart', function() {
           if(str===$.trim($('#input').val())){
               getData();
           }else{
               $('#input').val('');
               
               window.RuiDa.Alert.showAlert('支付宝用户名不同，请再次输入', '', '警告', '确定');
           }
        });

        RuiDa.Module.backUrl('addPay1.html?id='+str);
    }
    function getData(){
        var url= localStorage.hostAddress +'index.php?c=api&m=update_zhifubao&zhifubao='+str;
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'jsonp'
        }).done(function(data) {
                if(data.result)
                    window.RuiDa.Alert.showAlert('添加失败', '', '失败', '确定');
                else
                    window.RuiDa.Alert.showAlert('添加成功', '', '成功', '确定');
            }).fail(function() {
                console.log("error");
            });
    }

    return {
        start:start
    }
})();
window.AddPay2.start();
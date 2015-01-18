/*
	添加支付宝1页代码
*/
window.AddPay1 = (function() {
    var  Request=RuiDa.Tool.GetRequest(),id=Request.hasOwnProperty('id')?Request['id']:false;
    var type  = Request['type'] ? Request['type'] : 2;
    var pageType = type;

    function start() {
        // RuiDa.Module.backUrl('my_pay.html');

       // var type = sessionLocation.money_manager_url;

        // new Loading();
       
        if(type && type == "1" || type == "3"){ //添加接口
            $("#title").html("添加支付宝");
            type = "1"; // 因为和后台约定好的，type =1是添加，没有type=3

        }else {
            $("#delete_alipay").css("display","block");
        }

        

        $("#backBtn").bind("touchend",function(){
            goToBackPage(pageType);
        })

        RuiDa.Module.backUrl_deviceBackButn(goToBackPage,pageType);
        $('#submit').bind('touchend', function() {
            var  alipayName1 = $.trim($('#input').val());
            var  alipayName2 = $.trim($("#alipayName").val());
            if(alipayName1 =="" || alipayName2==""){
                window.RuiDa.Alert.showAlert('支付宝账号为空', '', '警告', '确定');
                return;
            }
            if(alipayName1 !==alipayName2){
                 window.RuiDa.Alert.showAlert('支付宝用户名不同，请再次输入', '', '警告', '确定');
                return;
            }
            getData(id,alipayName1,type);
        });

        // 等待加载PhoneGap
        // document.addEventListener("deviceready", onDeviceReady, false); 
        onDeviceReady();
        // PhoneGap加载完毕
        function onDeviceReady() {

            $("#delete_alipay").bind("touchend",function(){
            //弹出确认框

                // showConfirm();
                RuiDa.Alert.showConfirm("确认删除？","删除支付宝",deleteAlipay);
            })
        }



    }
    function deleteAlipay(btnId){
        
        if(btnId == "1") return;

        var url_Delete= localStorage.hostAddress +'index.php?c=api&m=del_zhifubao&id='+id+"&rnd="+ Math.random();
        $.ajax({
            url: url_Delete,
            type: 'GET',
            dataType: 'jsonp'
        }).done(function(data) {
                // console.log('222222',data);
                if(data.result){
                     
                      window.location.href="my_pay.html"; 
                      window.RuiDa.Alert.showAlert('操作成功', '', '成功', '确定');
                }
                else{

                   window.RuiDa.Alert.showAlert(data.info, '', '失败', '确定');
                }
        })
    }

    function getData(id,alipayName,type){
        var url= localStorage.hostAddress +'index.php?c=api&m=update_zhifubao&zhifubao='+alipayName+'&type='+type+'&id='+id;
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'jsonp'
        }).done(function(data) {
                if(data.result){
                    RuiDa.Alert.showConfirm('支付宝添加成功','成功',function(){
                        goToBackPage(pageType);
                    },'确定');
                }
                else{

                   window.RuiDa.Alert.showAlert(data.info, '', '失败', '确定');
                    //window.location.href="my_pay.html"; 
                }
            }).fail(function() {
                console.log("error");
            });
    }

    function goToBackPage(pageType){
        
            if(pageType && pageType == "3"){
                window.location.href ="withdraw.html";
            }else{
                window.location.href ="my_pay.html";
            }
        }

    return {
        start: start
    }
})();
window.AddPay1.start();
/*
	资金管理代码
*/

window.Money_manager = (function() {
    var  Request=RuiDa.Tool.GetRequest(), type  = Request['type'] ? Request['type'] : 0;

    function start() {

        $("#backBtn").bind("touchend",function(){
            //1 首页
            //2 个人中心
            gotoNextPageBySesstion();

        });
        
        RuiDa.Module.backUrl_deviceBackButn(gotoNextPageBySesstion);

        function gotoNextPageBySesstion(){
            var type = sessionStorage.money_manager_url;
            console.log('2222222222222type',type);
            //return;
            if(type =="2"){
                window.location.href="home.html";

            }else if(type =="1"){
                window.location.href="person.html";
            }else if(type =="3"){
                window.location.href = "messageDistribution.html";
            }else{
                window.location.href="home.html";    
                RuiDa.Module.backUrl_deviceBackButn("home.html");
            }
        }

        RuiDa.Module.bindClickBtnByArr({
            'header span': 'paymentDetails.html',
            // '#withdrawBtn': 'withdraw.html',
            '#manage1':'paymentDetails.html?type=1',//收支明细
            '#manage2':'paymentDetails.html?type=2',
            '#manage3':'paymentDetails.html?type=3',
            '#manage4':'paymentDetails.html?type=4',
            '#manage5':'paymentDetails.html?type=5'
        });

        $("#withdrawBtn").bind("touchend",function(){
            window.location.href = "withdraw.html";
            sessionStorage.withdraw_urlType = 1;  //1:资金管理；2：首页
        });

        $("#askforandgive").bind("touchend",function(){
            window.location.href = "user_askforandgive.html";
            //sessionStorage.withdraw_urlType = 1;  //1:资金管理；2：首页
        });
        getData();
        setTimeout(function(){
            RuiDa.Module.initIScroll();
        },200)
    }

    function getData() {
        var url = localStorage.hostAddress + 'index.php?c=api&m=zijinguanli';
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'jsonp'
        }).done(function(data) {
                console.log(2222,data);
            $('#dangqian').text(data.dangqian||'0');
            $('#lishi').text(data.lishi||'0');
            $('#chaojifanli').text(data.chaojifanli||'0');
            $('#yaoqing').text(data.yaoqing||'0');
            $('#tuijian').text(data.tuijian||'0');
            $('#sendask').text((data.song||'0')+"|"+(data.yao||'0'));

            $('#guanggao').text(data.guanggao||'0');
            $('#tixian').text(data.tixian||'0');
        }).fail(function() {
            console.log("error");
        });
    }

    return {
        start: start
    }
})();
window.Money_manager.start();
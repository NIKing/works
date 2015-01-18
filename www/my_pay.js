/*
	首页代码
*/
window.Ad_payoff = (function() {
    var isscroll=false;
    function start() {
        //RuiDa.Module.backUrl('person.html');

        getData();
        RuiDa.Module.backUrl('person_list.html');

        $("#pay_add").bind("click",function(){
            window.location.href="addPay1.html?type=1"; //添加 ：type=1 ；编辑：type=2
        })
    }

    function getData() { //wodezhifubao
        var url = localStorage.hostAddress + 'index.php?c=api&m=zhifubao_list';
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'jsonp'
        }).done(function(data) {
            if(!data){
                alert("数据请求失败");
                return;
            }

            var dataList = data.list;
            var html ="";
            for(var i=0,listLen = dataList.length;i<listLen;i++){

                  var id = dataList[i].id;
                  var payId = dataList[i].zhifubao;
                  html +='<li>';
                  html +='<div class="my_pay" _id='+id+' >';
                  html +='<div class="dou">';
                  html +='  <img id="pic" src="images/myPay_alipayLogo.png"/>';
                  html +='  <span id="name">支付宝</span>';
                  html +='  <span style="padding-top:0;" class="color" id="zhifubao">'+payId+'</span>';
                  html +='</div>';
                  html +='</div>';
                  html +='</li>';
            }
            $("#dataList").append(html);
                setTimeout(function(){
                    if(!isscroll){
                        RuiDa.Module.initIScroll();
                    }else{
                        RuiDa.Module.refreshIScroll();
                    }
                },200);
            //编辑支付宝
            editAlipay();

            }).fail(function() {
            console.log("error");
        });
    }

    function editAlipay(){
        $(".my_pay").each(function(){
                $(this).click(function(){
                    // console.log("2");
                    var aliPayNr = $(this).attr("_id");
                    // sessionStorage.money_manager_url = "2";
                    window.location.href="addPay1.html?id="+aliPayNr+"&type=2";
                })
        })
    }

    return {
        start: start
    }
})();
window.Ad_payoff.start();
/*
    提现代码
*/
window.withDraw = (function() {

    var newIntegralSum = 0;
    var _minIntegralSum = 2000;

    function start() {
       

        //获取session字段
        $("#backBtn").bind("touchend",function(){
          gotoNextPageBySesstion();
        })

        RuiDa.Module.backUrl_deviceBackButn(gotoNextPageBySesstion);

        function gotoNextPageBySesstion(){
            var urlType = sessionStorage.withdraw_urlType;
           if(urlType == "1"){
                window.location.href = "money_manager.html";   
           }else if(urlType == "2"){
                window.location.href = "home.html";
           }else{
               RuiDa.Module.backHistory();  
           }
        }

        RuiDa.Tool.RuleNum('#integral');

        /*$("#integral").focus(function(){
           
        })*/

        getStartData();

        $('#confirm').on('touchstart', function() {
            var jifen = $('#integral').val(),
                zhifubao = $('#zhifubao').text();

            if (jifen && zhifubao) {

                console.log(1231313);
                if (parseInt(jifen) > parseInt(newIntegralSum)) {
                    window.RuiDa.Alert.showAlert('当前积分不足', '', '失败', '确定');
                } else if (parseInt(jifen) < _minIntegralSum) {
                    window.RuiDa.Alert.showAlert('每笔积分必须大于2000', '', '失败', '确定');
                } else {
                    getData(jifen, zhifubao);
                }
            } else{
                
               window.RuiDa.Alert.showAlert('米币或支付宝名称为空', '', '警告', '确定');
            }
        });

        $("#btn_showAlipay").toggle(function() {
            $(".aliPayList").css("display", "block");
            $("#showAlipayImg").css("transform", "rotateZ(90deg)");
        }, function() {
            hiddenAlipay();
        })
    }

    function toggleAliApy() {
        $(".aliPayList ul li").each(function() {
            $(this).click(function() {


                 // window.iScroll.refresh();

                var alipay = $(this).html();
                var id = $(this).attr("id") ? $(this).attr("id")  : null;
                if(id!=null && id =="0"){
                    window.location.href="addPay1.html?type=3";
                    return;
                }

                $("#zhifubao").html(alipay);
                $("#account").val(alipay);

                hiddenAlipay();
            })
        })
    }

    function getStartData() {
        var url = localStorage.hostAddress + 'index.php?c=api&m=tixian_html';
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'jsonp'
        }).done(function(data) {
            newIntegralSum = data.userinfo.jifen;

            $('#lishi').text(data.lishitixian || '0');

            var alipayList = data.list;
            var html = "";
            for (var i = 0, listLen = alipayList.length; i < listLen; i++) {

                var alipay = alipayList[i].zhifubao;

                if (i == 0) {

                    $('#zhifubao').text(alipay || '');
                    $('#account').val(alipay);

                }
                html += '<li>' + alipay + '</li>';
            }
             html +='<li id="0" onclick="onEvent(\'click\',\'tx_add_alipay\');" >添加支付宝</li>';
            $("#aliPayList").append(html);

            toggleAliApy();

        }).fail(function() {
            console.log("error");
        });
    }

    function getData(ji, zhi) {
        var url = localStorage.hostAddress + 'index.php?c=api&m=tixian&jifen=' + ji + '&zhifubao=' + zhi;
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'jsonp'
        }).done(function(data) {
            if (data.result) {
                //window.RuiDa.Alert.showAlert(data.info, '', '成功', '确定');
                RuiDa.Alert.showConfirm(data.info,'成功',function(){
                    setTimeout(function(){
                        window.location.href = 'money_manager.html';
                    },400);
                },'确定');
            } else {
                window.RuiDa.Alert.showAlert('提现失败', '', '失败', '确定');
            }
        }).fail(function() {
            console.log("error");
        });
    }

    function hiddenAlipay() {
        $(".aliPayList").css("display", "none");
        $("#showAlipayImg").css("transform", "rotateZ(-90deg)");
    }

    return {
        start: start
    }
})();

window.withDraw.start();

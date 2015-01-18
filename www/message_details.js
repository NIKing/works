/*
	站内信详情代码
*/
window.Message_details = (function() {
    var Request = new Object(),
        Request = RuiDa.Tool.GetRequest(),
        messageid = Request['id'];

    function start() {
        // 后退监听
        // RuiDa.Module.backUrl('letter.html');
        $("#backBtn").bind("touchend",function(){
            window.history.go(-1);
        })



        $("#cancel").bind("touchend",function(){
            hiddenMakLaout();
            $(this).removeAttr("style");
        })
        $("#maskLayout").bind("touchend",function(){
            hiddenMakLaout();
        })



       /* $('#delete').bind('touchend', function() {
            showMakLayout();
            //Delete();
        });
        $("#btn_Ok").bind("touchend",function(){
            Delete();
            $(this).removeAttr("style");
        })

        $("#btn_Ok").bind("touchstart",function(){
            $(this).css("background-color","#fb512d");
        })
        $("#cancel").bind("touchstart",function(){
            $(this).css("background-color","#fb512d");
        })*/



        getData();
    }

    function getData() {
        var url = localStorage.hostAddress + 'index.php?c=api&m=letter_info&id=' + messageid;
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'jsonp'
        }).done(function(data) {
            $('.name').text((data.info.nickname||data.info.mobile));
            $('.time').text(RuiDa.Tool.GetData(data.info.createtime || new Date().getDate(), true,8));
            $('.con').text(data.info.content);
            RuiDa.Module.bindClickBtn('#reply', 'f_letter.html?fansid=' + data.info.my_id + '&name=' + (data.info.nickname||data.info.mobile));
        }).fail(function() {
            console.log("error");
        });
    }

    function showMakLayout(){
        $(".maskLayout").css("display","block");
        $(".deleteAlert").css("display","block");
    }

    function hiddenMakLaout(){
        $(".maskLayout").css("display","none");
        $(".deleteAlert").css("display","none");
    }

    function Delete() {
        var url = localStorage.hostAddress + 'index.php?c=api&m=del_letter&id=' + messageid;
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'jsonp'
        }).done(function(datalist) {
            if (datalist.result)
                window.RuiDa.Alert.showAlert('删除成功', '', '成功', '确定');
                // alert('删除成功');
                window.history.go(-1);
        }).fail(function() {
            console.log("error");
        });
    }

    return {
        start: start
    }

    return {
        start: start
    }
})();
window.Message_details.start();
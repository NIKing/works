/*
    发布步奏一代码
*/
var issue_step2 = (function() {
    return {
        run: toRun
    };

    function toRun() {
        RuiDa.Module.backHistory();
        // RuiDa.Module.initIScroll();
    }
})();

issue_step2.run();

//商品描述
$('.goods_main').text(sessionStorage.issueGoodsDescription);
$('input[name=name]').val(sessionStorage.issueGoodsDescription);

//上传相片
$('#photoUpload').on('touchstart', function() {
    var imgLength = $('.photo_wrap > img').length;
    $('.input_wrap input').eq(imgLength).click();
});

$('.photo_wrap input').on('change', function() {
    if ($('.photo_wrap > img').eq($(this).index()).length != 0) {
        $('.photo_wrap > img').eq($(this).index()).after('<img src="' + window.webkitURL.createObjectURL(this.files[0]) + '" />').remove();
    } else {
        $('.photo_wrap > div').before('<img src="' + window.webkitURL.createObjectURL(this.files[0]) + '" />');
        if ($('.photo_wrap > img').length == 4) {
            $('.photo_wrap a').hide();
        }
    }
});

$('.photo_wrap').on('touchstart', ' > img', function() {
    $('.photo_wrap input').eq($(this).index()).click();
});

//完成
$('#complete').on('touchend', function() {
    var name = $('#goodsname').val(),
        price = $('input[name=price]').val(),
        description = $('#description').val(),
        url = $('input[name=url]').val(),
        pic = '',
        picinfo = [],
        data = {};
    $('.photo_wrap>img').each(function() {
        picinfo.push($(this).attr('src'));
    });
    pic = picinfo.join(',');
    if (!(name && price && description && picinfo)) {
        data = {
            name: name,
            price: price,
            description: description,
            url: url,
            pic: pic
        };
        //RuiDa.Alter.showAlert('请将数据填写完整', '', '警告', '确定');
        return;
    }

    $('.shadow').show();
    var ajax_option={
        url: localStorage.hostAddress + 'index.php?c=api&m=tuijian_fabu2',
        success: function(data) {
            $('.shadow').hide();
            //RuiDa.Alert.showAlert('上传成功','', '成功', '返回');
            sessionStorage.needReload = 'true';
            window.location.href="recommend.html";
        },error : function(data) {
            //RuiDa.Alert.showAlert('操作失败','', '提示', '返回');
        }
    };
    $('#goodsForm').ajaxSubmit(ajax_option);
    return;
    $('#goodsForm').ajaxSubmit({
        url: localStorage.hostAddress + 'index.php?c=api&m=tuijian_fabu2',
        success: function(data) {
            $('.shadow').hide();
            sessionStorage.needReload = 'true';
            window.location.href="recommend.html";
        },
        error: function(data) {
            //window.RuiDa.Alert.showAlert('上传失败', '', '失败', '返回重试');
        }
    });
});

/* $('#goodsname').focus();*/


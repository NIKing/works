/*
	首页代码
*/
window.Fans_contact = (function() {
    function start() {

        RuiDa.Module.backHistory();
        RuiDa.Module.initIScroll();

        getData();
        //加载失败则添加默认图片
        RuiDa.Tool.getDefpicInit();
    }

    function getData() {
        var url = localStorage.hostAddress + 'index.php?c=api&m=guanlianfensi';
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'jsonp'
        }).done(function(datalist) {
                var html='',str=['','直接','二级','三级'],strtype=['','one','two','three'];
                function getHtml(data,strlevel,num){
                    html+='<div class="fans_info"><span class="title">'+strlevel+'邀请</span><span class="num Num-type">'+num+'人</span></div>';
                    html+='<div class="user"><img src="'+RuiDa.Module.getPic(data.headpic,'img/fans.png')+'"/><span>'+(data.nickname||'')+'</span></div>';
                }
                html+=' <div class="user"><img src="'+RuiDa.Module.getPic(datalist.info.headpic,'img/fans.png')+'"/><span>'+(datalist.info.nickname||'')+'</span></div>';
                for(var key in strtype) if(strtype[key]){
                    if(datalist.hasOwnProperty(strtype[key])&&parseInt(datalist[strtype[key]])>0){
                        getHtml(datalist['info'+key],str[key],datalist[strtype[key]]);
                    }
                }
                $('#iScrollInner').empty().append(html);
        }).fail(function() {
            console.log("error");
        });
    }



    return {
        start: start
    }
})();

window.Fans_contact.start();
/*
	广告任务
*/
window.Ad_task=(function(){
    function start(){
        getData();
    }
    function getData(){
        var url= localStorage.hostAddress +'index.php?c=api&m=gg_list';
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'jsonp'
        }).done(function(datalist) {
                var html='',data=datalist.list,strstyle='';
                for(var key in data){
                    strstyle=key==='0'?'padding-top: 0':'margin-top: 0';
                    html+='<li style="'+strstyle+'"><img src="'+RuiDa.Module.getPic(data[key].pic,'img/img.png')+'"/>';
                    html+='<p><span>点击得到<b>'+(data[key].jifen||'0')+'</b>积分</span><em>';
                    html+='<img src="images/diamond.png"/>分享</em></p></li>';
                }
                $('#content').empty().append(html);
            }).fail(function() {
                console.log("error");
            });
    }

    return {
        start:start
    }
})();
window.Ad_task.start();
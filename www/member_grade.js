/*
    成长记录代码
*/
window.Member_grade=(function(){
    //铁牌会员，铜牌会员，银牌会员，金牌会员，白金会员，铂金会员，钻石会员
    var arrlevel={'1':'铁牌会员','2':'铜牌会员','3':'银冠会员','4':'金牌会员','5':'白金会员','6':'铂金会员','7':'钻石会员'};
    function start(){
        getData();
        RuiDa.Module.initIScroll();
        RuiDa.Module.backUrl('person.html');
    }
    function getData(){
        var url= localStorage.hostAddress +'index.php?c=api&m=chengzhangjilu';
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'jsonp'
        }).done(function(data) {
                var strlevel=data.level;
                $('#member_pic').attr('src','images/t_vip0'+strlevel+'.png');
                $('#member_name').text(arrlevel[strlevel]);
                if(strlevel===1){
                    $('#other').remove();
                }else{
                    $('#next_num').text(data.distance);
                    $('#next_pic').attr('src','images/t_vip0'+(parseInt(strlevel)-1)+'.png');
                    $('#next_type').text(arrlevel[parseInt(strlevel)-1]);
                }
            }).fail(function() {
                console.log("error");
            });
    }

    return {
        start:start
    }
})();
window.Member_grade.start();

/*
	首页代码
*/
window.Ad_payoff = (function() {
    var strnotice = {
            '打开': '1',
            '关闭': '2'
        },
        arrnoeice={'1':'关闭','2':'打开'},
        infochange = {
            '打开': '关闭',
            '关闭': '打开'
        },
        isclear=true;


    function start() {
        RuiDa.Module.initIScroll();
        getInitData();
        $('#InfoNotice').bind('click', function() {
            var str=$(this).text();
            getData(str);
        });

        $('#Check').bind('click', function() {
            getVersion();
        });

        $('#clear').bind('click', function() {
            if(!isclear) return;
            isclear=false;
            $(this).text('清除中...');
            function GetRandomNum(Min,Max)
            {
                var Range = Max - Min;
                var Rand = Math.random();
                return(Min + Math.round(Rand * Range));
            }
            var num = GetRandomNum(20,50);
            setTimeout(function(){
                $('#clear').text('清除完成');
                setTimeout(function(){
                    $('#clear').text('清除');
                    isclear=true;
                },2000)
            },parseInt(num+'00'))
        });

        var arr = {
            '#feedback': 'feedback.html',
            '#about': 'about_zhongle.html'
        };
        RuiDa.Module.bindClickBtnByArr(arr);
        RuiDa.Module.backUrl('messageDistribution.html');
    }

    function getInitData(){
        var url= localStorage.hostAddress +'index.php?c=api&m=getmessagestatus';
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'jsonp'
        }).done(function(datalist) {
                $('#InfoNotice').text(arrnoeice[datalist.message]);
            }).fail(function() {
                console.log("error");
            });
    }

    function getVersion(){
        var version='1.0.0.0',
            type={'android':'1','ios':'2'},
            getversion = RuiDa.Tool.deviceType(),
            url= localStorage.hostAddress +'index.php?c=api&m=versions&type='+type[getversion];
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'jsonp'
        }).done(function(data) {
                //versions
                if(data.versions==version){
                    $('#Check').text('当前已为最新版本');
                    $('#Check').unbind('click').css('color','blue');
                }else{
                   // alert(data.versions);
                   // window.location.href=localStorage.hostAddress+'data.versions';
                   window.open(data.url,"_system");
                }
            }).fail(function() {
                console.log("error");
            });
    }

    function getData(value) {
        var url = localStorage.hostAddress + 'index.php?c=api&m=setmessage&message=' + strnotice[value];
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'jsonp'
        }).done(function(datalist) {
            if (datalist.result) {
                $('#InfoNotice').text(infochange[value]);
            }
        }).fail(function() {
            console.log("error");
        });
    }



    return {
        start: start
    }
})();
window.Ad_payoff.start();
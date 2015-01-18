/*
    广告赚钱代码
*/
window.Ad_payoff = (function() {
    function guide(){
        //RuiDa.Module.Guide_Init();
        //localStorage.guide_adpayoff1='1';
        if(localStorage.isguide==='1'){
            $('#guide1,#guide2').hide();
        }else{
            if(screen.availHeight>500){
                //console.log('手机为5s');
                $('#img1').attr('src','img/index_3.png');
                $('#img2').attr('src','img/index_4.png');
            }else{
                //console.log('手机为4');
                $('#img1').attr('src','img/index_33.png');
                $('#img2').attr('src','img/index_44.png');
            }
            if(localStorage.guide_adpayoff1==='0'){
                $('#guide1').show();
                $('#guide2').hide();
                $('#guide_next1').bind('click',function() {
                    localStorage.guide_adpayoff1='1';
                    $('#guide1').hide();
                    $('#experienceBtn1').click();
                });
            }else if(localStorage.guide_adpayoff2==='0'){
                $('#guide1').hide();
                $('#guide2').show();
                $('#guide_next2').click(function() {
                    localStorage.guide_adpayoff2='1';
                    $('#guide2').hide();
                    $('#experienceBtn3').click();
                });
            }else{
                $('#guide1,#guide2').hide();
            }
            RuiDa.Module.GetGuide();
        }
    }

    function start() {


        RuiDa.Module.initIScroll();
        RuiDa.Module.initBottomNav();
        RuiDa.Module.backHome();

        // 体验应用
        $('#experienceBtn1').on('click', function() {
            console.log(1212);
            cordova.exec(function() {}, function() {}, 'RndPlugin', 'duomeng', []);
            // Cordova.exec(function() {}, function() {}, "ASPlugin", 'duomeng', []); //IOS
        });

        // 体验应用2
        $('#experienceBtn2').on('click', function() {
            cordova.exec(function() {}, function() {}, 'RndPlugin', 'limei', []);
            // Cordova.exec(function() {}, function() {}, "ASPlugin", 'limei', []); //IOS
        });

        RuiDa.Module.bindClickBtn('#experienceBtn3','share_goods.html');



       /* $('#adImg').on('touchstart', function() {
            cordova.exec(function() {}, function() {}, 'RndPlugin', 'limei', []);
            // Cordova.exec(function() {}, function() {}, "ASPlugin", 'limei', []); //IOS
        });*/

        // 规则
        $('.rule').on('click', function() {
            window.location.href = 'ad_rule.html';
        });

        // 个人信息
        $('#personBtn').on('click', function() {
            sessionStorage.backUrl = window.location.href;
            window.location.href = 'personalData.html';
        });

        getData();

        //导航
        guide();
    }

    function getData() {
        var url = localStorage.hostAddress + 'index.php?c=api&m=gg';
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'jsonp'
        }).done(function(datalist) {
            $('#adImg').attr('src', RuiDa.Module.getPic(datalist.banner[0].pic, 'img/ad_payoff.jpg'));
            $('.desc_wrap').append(datalist.content.content);
            $('.desc_wrap p').addClass('description');
            RuiDa.Module.refreshIScroll();
        }).fail(function() {
            console.log("error");
        });
    }

    return {
        start: start
    }
})();

window.Ad_payoff.start();
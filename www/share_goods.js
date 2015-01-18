/*
 分享商品代码
 */
window.Share_goods = (function () {
    var shareids = [],
        currentid = '',
        binitScroll = 0,
        sharegoodslist = {};
    /*share_name='',
     share_url='',
     share_pic='';*/

    function guide() {
        //RuiDa.Module.Guide_Init();
        if (localStorage.isguide === '1') {
            $('#guide').hide();
        } else {
            if (localStorage.guide_share_goods === '0') {
                $('#guide').show();
                $('#guide_next').click(function () {
                    localStorage.guide_share_goods = '1';
                    $('#guide').hide();
                    $("#weixin_invite").click();
                });
            } else {
                $('#guide').hide();
            }
            RuiDa.Module.GetGuide();
        }
    }

    function start() {


        RuiDa.Module.backUrl('ad_payoff.html');

        //取消
        $("#shareBtn").on('click', function (event) {

            setTimeout(function(){
                 $('.shadow,.share_wrap').hide();
            },500)
           
            currentid = '';

            return false;
        });



        getData();

        //导航
        guide();

    }

    function getData() {
        var url = localStorage.hostAddress + 'index.php?c=api&m=cpc_goods';
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'jsonp'
        }).done(function (datalist) {
                console.log(22222, datalist);
                var html = '',
                    data = datalist.list,
                    // strids = {},
                    goodinfo = {};
                for (var key in data) {
                    html += '';
                    html += '<li id="' + data[key].id + '">';
                    //html += '    <span><img id="pic_' + data[key].id + '" src="' + RuiDa.Module.getPic(data[key].pic, 'img/goods_01.jpg') + '" /></span>';
                    html += '    <span><img  src="' + data[key].pic + '" /></span>';
                    html += '    <span>';
                    html += '        <h1>' + RuiDa.Tool.getString(data[key].name, 10) + '</h1>';
                    html += '        <p class="z_da"><img id="yang" src="images/yang.png"/>' + data[key].price + '</p>';
                    html += '       <p><img id="diamond" src="images/diamond.png"/>' + data[key].fenxiang + '人分享</p>';
                    html += '   </span>';
                    html += '    <span class="s_right">';
                    html += '         <p>分享得积分<b>' + data[key].cjifen + '</b></p>';
                    html += '        <p><button class="share" id="'+ data[key].id + '" onclick="onEvent(\'click\',\'fxsp_share_'+ data[key].name +'\');">分享</button></p>';
                    html += '     </span>';
                    html += '  </li>';
                    shareids.push('#share_' + data[key].id);
                    // strids['#pic_' + data[key].id] = 'goods_details.html?id=' + data[key].id;
                    goodinfo = {
                        share_name: data[key].name,
                        share_url :data[key].url,
                        share_pic: data[key].pic,
                        share_cjifen:data[key].cjifen
                    };
                    sharegoodslist[data[key].id]=goodinfo;
                }
                console.log('商品信息',sharegoodslist);
                $('.goods_share').empty().append(html);

                if(binitScroll === 0){
                    RuiDa.Module.initIScroll();

                    binitScroll === 1;
                }else{
                    RuiDa.Module.refreshIScroll();
                }

                

                //bindShare();
                bindShares()
                share();

                bindClickLI();

                //RuiDa.Module.bindClickDelayArr(strids);
            }).fail(function () {
                console.log("error");
            });
    }
    function bindShares(){
        $(".share").bind("touchstart",function(event){
                var id = $(this).attr("id");

                            
                currentid = id;

                limitShare(id);

            
                return false;

        })

         $(".share").click(function(event){
             return false;
         })
    }
    function bindShare() {

        if (shareids.length > 0) {
            for (var key in shareids) {
                // 分享赚钱
                //bindclick(shareids[key]);
            }
        }

    }

    function bindClickLI(){
        $(".goods_share li").click(function(){
                var id = $(this).attr("id");
                window.location.href="goods_details.html?id="+id;
                return false;
         })
    }

    function bindclick(id) {
        $(id).one('click',function () {
            currentid = id.split('_')[1];
            //$('.shadow,.share_wrap').show();
            //limitShare(currentid);
        });
    }


    function limitShare(id) {

        var url = localStorage.hostAddress + 'index.php?c=api&m=cpc_limit';
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'jsonp',
            data: {
                goods_id: id
            }
        }).done(function (datalist) {
                //console.log('222222',datalist);
                if (datalist.result) {
                    //console.log('可以分享');
                    $('.shadow,.share_wrap').show();
                    //bindclick(id);
                } else {

                    RuiDa.Alert.showAlert('分享次数已用完',function(){},'提示','确定');
                   // RuiDa.Alert.showConfirm('您已分享该商品', '警告','', '确定');
                    //alert("您已分享该商品");
                }
            }).fail(function () {
                console.log("error");
            });

    }

    function share() {
        var inviteType = 0; // 0:QQ空间；1：新浪微博；2：腾讯微博；3：微信朋友圈；4：人人;5：微信好友；6：通讯录好友；7：腾讯QQ
        //邀请微信好友
        $("#weixin_invite").bind('click', function () {
            inviteType = 5;
            postInviteByCordova(inviteType);
        });

        // 通讯录好友
        $("#phone_invite").bind('click', function () {
            inviteType = 6;
            postInviteByCordova(inviteType);
        });
        // 3：微信朋友圈
        $("#friend_share").bind('click', function () {
            inviteType = 3;
            postInviteByCordova(inviteType);
        });
        // 1：新浪微博
        $("#sina_share").bind('click', function () {
            inviteType = 1;
            postInviteByCordova(inviteType);
        });
        // 0:QQ空间
        $("#QQKJ_share").bind('click', function () {
            inviteType = 0;
            postInviteByCordova(inviteType);
        });
        // 7：腾讯QQ
        $("#QQ_share").bind('click', function () {
            inviteType = 7;
            postInviteByCordova(inviteType);
        });
        // 2：腾讯微博
        $("#QQWB_share").bind('click', function () {
            inviteType = 2;
            postInviteByCordova(inviteType);
        });
        // 4：人人
        $("#renren_share").bind('click', function () {
            inviteType = 4;
            postInviteByCordova(inviteType);
        });
    }



    function postInviteByCordova(type) {
        if (type < 0)return;

        //var content =  ["米米，这软件我每天上下班用，能赚个水电费钱。强烈推荐你也可以下个试试","","",type];
        //var content = ["米米上逛一圈，发现一款好商品，大牌的品质地摊的价格，亲，你也看看? http://182.92.183.18/  ,邀请码为：" + localStorage.phoneNum, "", "http://182.92.183.18", type];
        var content=[sharegoodslist[currentid].share_name,sharegoodslist[currentid].share_pic,sharegoodslist[currentid].share_url,type];//currentid
        if(type===5){//http://mmm.fyhqy.com/index.php?c=api&m=goods_info&goods_id=2157
            content=[sharegoodslist[currentid].share_name,sharegoodslist[currentid].share_pic,"http://appapi.52mimi.cn/index.php?c=api&m=goods_info&goods_id="+currentid,type];
        }else if(type === 6){
            content=[sharegoodslist[currentid].share_name,'',sharegoodslist[currentid].share_url,type];
        }
        
        console.log(type,currentid,content,type===5);

        //成功之后会调用后台
       cordova.exec(function() {
            //window.RuiDa.Alert.showAlert('分享失败', '', '警告', '确定');

            $.ajax({
                url: localStorage.hostAddress + 'index.php?c=api&m=cpc_share',
                type: 'GET',
                dataType: 'jsonp',
                data: {
                    goods_id: currentid,
                    type: type,
                    jifen:sharegoodslist[currentid].share_cjifen
                }
            }).done(function () {}).fail(function () {});

            window.RuiDa.Alert.showAlert('分享成功', '', '成功', '确定');
            $('.shadow,.share_wrap').hide();
        }, function() {
            window.RuiDa.Alert.showAlert('分享失败', '', '提示', '确定');
        }, 'SharePlugin', 'share',content);
    }

    return {
        start: start
    }
})();
window.Share_goods.start();

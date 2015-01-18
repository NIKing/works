/*
 商品详情代码
 */
window.Goods_details = (function () {
    var Request = new Object(),
        Request = RuiDa.Tool.GetRequest(),
        goodsid = Request['id'],
        picarr = {'1': 'images/collect.png', '2': 'images/collect_hover.png'},
        picstr = {'1': '2', '2': '1'},
        isShoucang = false,
        share_name = '',
        share_url = '',
        share_pic = '';


    function start() {


        RuiDa.Module.initBottomNav();
        RuiDa.Module.backHistory();

        // 分享赚钱
        $('#shareMoney').on('click', function () {
            setTimeout(function(){
                $('.shadow,.share_wrap').show();
				  onEvent('click', 'spxq_share_clk');
            }, 400);
        });

        $("#shareBtn").on('touchstart', function (event) {
            $('.shadow,.share_wrap').hide();
        });
        getData();


    }

    function getData() {
        var url = localStorage.hostAddress + 'index.php?c=api&m=details&id=' + goodsid;
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'jsonp'
        }).done(function (datalist) {
                console.log(2222, datalist);
                share_name = datalist.info.name;
                share_url = datalist.info.url;
                share_pic = datalist.info.pic;
                console.log('名称和链接', share_name, share_url);

                $('#goodsImg').attr('src', RuiDa.Module.getPic(datalist.info.bigpic, 'img/goods_big.jpg'));
                $('.decription').text(datalist.info.name);
                $('.money').text(parseFloat(datalist.info.price || '0').toFixed(2));
                $('.discount').text((datalist.info.zhekou || '不打') + '折');
                $('.share_number').text((datalist.info.fenxiang || '0') + '人分享');
                if (datalist.info.status === '0') {
                    $('.btn_wrap').empty().append('<span class="short_btn btn_gray">该产品已下架</span>');
                }

                var shopContent = datalist.info.content;
                if (shopContent != null && shopContent != "") {
                    $('.seller_say').html(shopContent.replace(/src="\/js/g, 'src="' + localStorage.hostAddress + 'js'));//replace(/src="\/js/g,'src="'+site_url+'js')
                }
                getIsShoucang(datalist.info.id);
                // console.log(datalist.info.url);

                $('#Buy').on('click', function () {   
                    setTimeout(function(){        
                        cordova.exec(
						         function () {}, 
								  function () {}, 
								  'RndPlugin', 
								  'taobao', 
								  [datalist.info.url] );
                    },  400);
					  onEvnet('click', 'spxq_buy_'+datalist.info.name);
                });

                clickCollect();

                Bindshare();

                getgoodsas();
                setTimeout(RuiDa.Module.initIScroll, 100);

                //需要对每个图片设置监听事件
                $(".seller_say img").load(function(){
                    setTimeout(function(){
                        window.iScroll.refresh();
                        console.log("2");
                    },1000)
                })

            }).fail(function () {
                console.log("error");
            });
    }

    function getIsShoucang(id) {
        var url = localStorage.hostAddress + 'index.php?c=api&m=ifshoucang&id=' + id;
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'jsonp'
        }).done(function (Ressc) {
                console.log(333312, Ressc);
                $('.love').attr('src', Ressc.result ? picarr["2"] : picarr["1"]);
                isShoucang = Ressc.result;
            }).fail(function () {
                console.log("error");
            });
    }
    //var isoper = false;
    function clickCollect(){
        $('#aiscollect').one('click', function () {
                 clickCollect1();
        });
    }
    function clickCollect1() {
            var m = isShoucang ? 'qxshoucang' : 'shoucang';
            $.ajax({
                url: localStorage.hostAddress + 'index.php?c=api&m='+m,
                type: 'GET',
                dataType: 'jsonp',
                data: {
                    id: goodsid
                }
            }).done(function () {
                    $('.love').attr('src', isShoucang ? picarr["1"] : picarr["2"]);
                    if (isShoucang) {
                        //clickCollect();
                        RuiDa.Alert.showConfirm('取消收藏成功','成功',function(){
                            clickCollect();
                        },'确定');
                    } else {
                        //clickCollect();
                        RuiDa.Alert.showConfirm('收藏成功','成功',function(){
                            clickCollect();
                        },'确定');
                    }
                    isShoucang = !isShoucang;
                }).fail(function () {
                    console.log("error");
                });
    }
   /* function clickCollect() {
        var isoper = false;
        $('#aiscollect').one('click', function () {
            //alert('点击了aiscollect');
            var m = isShoucang ? 'qxshoucang' : 'shoucang';
            console.log(goodsid,m);
            //setTimeout(function(){
            if(isoper) return;
                $.ajax({
                    url: localStorage.hostAddress + 'index.php?c=api&m='+m,
                    type: 'GET',
                    dataType: 'jsonp',
                    data: {
                        id: goodsid
                    }
                }).done(function (datalist) {//images/love.png
                        //alert(isoper);
                        console.log(datalist);

                        $('.love').attr('src', isShoucang ? picarr["1"] : picarr["2"]);
                        if (isShoucang) {
                            console.log('取消收藏成功');
                            //RuiDa.Alert.showAlert('取消收藏成功', '', '成功', '确定');
                            RuiDa.Alert.showConfirm('取消收藏成功','成功',function(){
                                isoper = false;
                            },'确定');
                        } else {
                            console.log('收藏成功');
                            //RuiDa.Alert.showAlert('收藏成功', '', '成功', '确定');
                            RuiDa.Alert.showConfirm('收藏成功','成功',function(){
                                isoper = false;
                            },'确定');
                        }
                        isShoucang = !isShoucang;
                    }).fail(function () {
                        console.log("error");
                    });
            //},200)
        });
    }*/

    function getgoodsas() {
        var url = localStorage.hostAddress + 'index.php?c=api&m=goods_samp';
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'jsonp',
            data: {
                id: goodsid
            }
        }).done(function (datalist) {
                console.log('44444444', datalist);
                var data = datalist.list,
                    i = 1,
                    arr = {},
                    html = '',
                    id = '';

                for (var key in data) {
                    id = data[key].id;
                    if (i % 2 === 1) {
                        html += '<ul class="inner_border_ul">';
                    }
                    html += '<li>';
                    html += '    <div onclick="onEvent(\'click\',\'spxq_tuijian_'+data[key].name+'\');" class="inner_border" id="goods_' + id + '">';
                    html += '        <img src="' + RuiDa.Module.getPic(data[key].pic, 'img/goods.jpg') + '" class="goods_image" />';
                    html += ' <div class="description">' + data[key].name + '</div>';
                    html += ' <div class="goods_info">';
                    html += '     <span class="money">' + parseFloat(data[key].price).toFixed(2) + '</span>';
                    html += ' </div>';
                    html += '</div>';
                    html += ' </li>';
                    if (i % 2 === 0 || i === data.length) {
                        html += '</ul>';
                    }
                    i++;
                    arr['#goods_' + id] = "goods_details.html?id=" + id;
                }
                $('#oneClassIScroll').empty().append(html);
                RuiDa.Module.bindClickBtnByArr(arr);

            }).fail(function () {
                console.log("error");
            });
    }

    //绑定各分享
    function Bindshare() {
        var inviteType = 0; // 0:QQ空间；1：新浪微博；2：腾讯微博；3：微信朋友圈；4：人人;5：微信好友；6：通讯录好友；7：腾讯QQ
        //邀请微信好友
        $("#weixin_invite").bind('touchstart', function () {
            inviteType = 5;
            postInviteByCordova(inviteType);
        });
        // 通讯录好友
        $("#phone_invite").bind('touchstart', function () {
            inviteType = 6;
            postInviteByCordova(inviteType);
        });
        // 3：微信朋友圈
        $("#friend_share").bind('touchstart', function () {
            inviteType = 3;
            postInviteByCordova(inviteType);
        });
        // 1：新浪微博
        $("#sina_share").bind('touchstart', function () {
            inviteType = 1;
            postInviteByCordova(inviteType);
        });
        // 0:QQ空间
        $("#QQKJ_share").bind('touchstart', function () {
            inviteType = 0;
            postInviteByCordova(inviteType);
        });
        // 7：腾讯QQ
        $("#QQ_share").bind('touchstart', function () {
            inviteType = 7;
            postInviteByCordova(inviteType);
        });
        // 2：腾讯微博
        $("#QQWB_share").bind('touchstart', function () {
            inviteType = 2;
            postInviteByCordova(inviteType);
        });
        // 4：人人
        $("#renren_share").bind('touchstart', function () {
            inviteType = 4;
            postInviteByCordova(inviteType);
        });
    }

    function postInviteByCordova(type) {
        if (type < 0)return;

        //var content =  ["米米，这软件我每天上下班用，能赚个水电费钱。强烈推荐你也可以下个试试","","",type];
        var content='';
        //var content =  [share_name,"",share_url,type];
        if(type===5||type===3){//微信或朋友圈
            content = [share_name, share_pic, "http://appapi.52mimi.cn/index.php?c=api&m=goods_info&goods_id=" + goodsid, type];
        }else if(type === 6){//通讯录
            content = [share_name+" "+share_url, "",share_url, type];
        }else{
            content = [share_name+' '+share_url, share_pic, share_url, type];
        }

        console.log('11111111111content', content);
        cordova.exec(function () {
            //成功之后会调用后台
            $.ajax({
                url: localStorage.hostAddress + 'index.php?c=api&m=share_add',
                type: 'GET',
                dataType: 'jsonp',
                data: {
                    goods_id: goodsid,
                    type: type
                }
            }).done(function (result) {//images/love.png
                    console.log(11111, result);

                }).fail(function () {
                });
            window.RuiDa.Alert.showAlert('分享成功', '', '成功', '确定');
        }, function () {
            window.RuiDa.Alert.showAlert('分享失败', '', '提示', '确定');
        }, 'SharePlugin', 'share', content);
    }


    return {
        start: start
    }
})();
window.Goods_details.start();

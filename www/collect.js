/*
 推荐页代码
 */
window.Collect = (function () {
    var page = 1;

    var myScroll,
        pullDownEl, pullDownOffset,
        pullUpEl, pullUpOffset,
        generatedCount = 0;

    function loaded() {
        /*  pullDownEl = document.getElementById('pullDown');
         pullDownOffset = pullDownEl.offsetHeight;*/
        pullUpEl = document.getElementById('pullUp'),
            pullUpOffset = pullUpEl.offsetHeight;

        myScroll = new iScroll('iScroll', {
            // useTransition: true,
            vScrollbar: false,
            topOffset: pullDownOffset,
            onRefresh: function () {
                /*      if (pullDownEl.className.match('loading')) {
                 pullDownEl.className = '';
                 pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Pull down to refresh...';
                 } else */
                if (pullUpEl.className.match('loading')) {
                    pullUpEl.className = '';
                    pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉加载更多...';
                }
            },
            onScrollMove: function () {
                /*if (this.y > 5 && !pullDownEl.className.match('flip')) {
                 pullDownEl.className = 'flip';
                 pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Release to refresh...';
                 this.minScrollY = 0;
                 } else if (this.y < 5 && pullDownEl.className.match('flip')) {
                 pullDownEl.className = '';
                 pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Pull down to refresh...';
                 this.minScrollY = -pullDownOffset;
                 } else*/
                if (this.y < (this.maxScrollY - 5) && !pullUpEl.className.match('flip')) {
                    pullUpEl.className = 'flip';
                    pullUpEl.querySelector('.pullUpLabel').innerHTML = '松开立即刷新...';
                    this.maxScrollY = this.maxScrollY;
                } else if (this.y > (this.maxScrollY + 5) && pullUpEl.className.match('flip')) {
                    pullUpEl.className = '';
                    pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉加载更多...';
                    this.maxScrollY = pullUpOffset;
                }
            },
            onScrollEnd: function () {
                /*if (pullDownEl.className.match('flip')) {
                 pullDownEl.className = 'loading';
                 pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Loading...';
                 pullDownAction();  // Execute custom function (ajax call?)
                 } else */
                if (pullUpEl.className.match('flip')) {
                    pullUpEl.className = 'loading';
                    pullUpEl.querySelector('.pullUpLabel').innerHTML = '正在加载...';
                    /* pullUpAction();  // Execute custom function (ajax call?)*/
                    //sortEvent(2, '&page=' + page + '&as=' + as);
                    getData(2);
                }
            }
        });

        //setTimeout(function () { document.getElementById('wrapper').style.left = '0'; }, 800);
    }


    function start() {
        //RuiDa.Module.initIScroll();
        RuiDa.Module.initBottomNav();
        RuiDa.Module.backHistory();
        getData(1);

        // 退出监听
        function exitApp() {
            navigator.app.exitApp();
        }

        function confirmExit() {
            document.removeEventListener("backbutton", confirmExit, false);
            document.addEventListener("backbutton", exitApp, false);
            setTimeout(function() {
                document.removeEventListener('backbutton', exitApp, false);
                document.addEventListener("backbutton", confirmExit, false);
            }, 3000);
        }

// 等待加载PhoneGap
        document.addEventListener("deviceready", function() {
            document.addEventListener("backbutton", confirmExit, false);
        }, false);

    }

    function getData(type) {
        var url = localStorage.hostAddress + 'index.php?c=api&m=wodeshoucang&page=' + page;
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'jsonp'
        }).done(function (datalist) {
                var html = '', data = datalist.list, i = 1;
                if (!data.length) {
                    reScroll();

                    if(pullUpEl){
                        pullUpEl.className = '';
                        pullUpEl.querySelector('.pullUpLabel').innerHTML = '已经是最后一页';
                    }
                    
                    return;
                }
                for (var key in data) {
                    if (i % 2 === 1) {
                        html += '<ul>';
                    }
                    html += '<li id="li_' + data[key].id + '"><div class="inner_border" >';
                    html += '<img id="' + data[key].id + '" src="' + RuiDa.Module.getPic(data[key].pic, 'img/goods.jpg') + '" class="goods_image" />';
                    html += '<div class="description">' + data[key].name + '</div>';
                    html += '<div class="goods_info"><span class="money Num-type">' + parseFloat(data[key].price || '0').toFixed(2) + '</span>';
                    html += '<img src="images/collect_hover.png" id="' + data[key].id + '" class="love" /></div>';
                    html += '<div class="share_number">' + (data[key].fenxiang || '0') + '人分享</div></div></li>';
                    if (i % 2 === 0) {
                        html += '</ul>';
                    }
                    i++;
                }

                if (type === 1) {
                    $('.scrollInner ul').remove();
                }
                $('#pullUp').before(html);

                reScroll();
                bindDetails();


                page++;
                cancellCollect();
                //RuiDa.Module.refreshIScroll();
            }).fail(function () {
                console.log("error");
            });
    }

    function bindDetails() {
        $('#iScroll .inner_border img').each(function () {
            var id = $(this).attr('id');
            RuiDa.Module.binClick('#' + id, 'goods_details.html?id=' + id);
        });
    }

    var loadScroll = null;
    var loadScrollRefresh = null;

    function reScroll() {
        if (page === 1) {
            loadScroll = setTimeout(function () {
                loaded();
            }, 1)
        } else {
            if (loadScroll != null) clearTimeout(loadScroll);
            if (loadScrollRefresh != null) clearTimeout(loadScrollRefresh);

            loadScrollRefresh = setTimeout(function () {
                myScroll.refresh()
            }, 1);
        }
    }

    function cancellCollect() {
        //var isShoucang=true;
        $('.love').each(function () {
            $(this).bind('touchstart', function () {
                var m = 'qxshoucang',
                    picarr = {'1': 'images/collect.png', '2': 'images/collect_hover.png'},
                    obj = $(this),
                    id = $(this).attr('id');
                $.ajax({
                    url: localStorage.hostAddress + 'index.php?c=api',
                    type: 'GET',
                    dataType: 'jsonp',
                    data: {
                        id: id,
                        m: m
                    }
                }).done(function (data) {//images/love.png
                        if (data.result) {
                            obj.attr('src', picarr["2"]);
                            RuiDa.Alert.showConfirm('取消收藏成功','成功',function(){
                                location.reload();
                            },'确定');
                           /* window.RuiDa.Alter.showAlert('取消收藏成功', '', '成功', '确定');
                            location.reload();*/
                        } else
                            console.log("error");
                    }).fail(function () {
                        console.log("error");
                    });
            });
        });
    }

    return {
        start: start
    }
})();
window.Collect.start();
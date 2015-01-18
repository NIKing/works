/*
 直接粉丝代码
 */

window.Fans_direct = (function () {
    var pageIndex = 1, strquery = '';

    var myScroll,
        pullDownEl, pullDownOffset,
        pullUpEl, pullUpOffset,
        generatedCount = 0;

    function loaded() {
        /*  pullDownEl = document.getElementById('pullDown');
         pullDownOffset = pullDownEl.offsetHeight;*/
        pullUpEl = document.getElementById('pullUp');
        pullUpOffset = pullUpEl.offsetHeight;

        myScroll = new iScroll('iScroll', {
            useTransition: true,
            vScrollbar: false,
            topOffset: pullDownOffset,
            onRefresh: function() {
                /*      if (pullDownEl.className.match('loading')) {
                 pullDownEl.className = '';
                 pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Pull down to refresh...';
                 } else */
                if (pullUpEl.className.match('loading')) {
                    pullUpEl.className = '';
                    //pullUpEl.querySelector('.pullUpLabel').innerHTML = '加载完毕...';
                    pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉加载更多...';
                }
            },
            onScrollMove: function() {
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
            onScrollEnd: function() {
                /*if (pullDownEl.className.match('flip')) {
                 pullDownEl.className = 'loading';
                 pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Loading...';
                 pullDownAction();  // Execute custom function (ajax call?)
                 } else */
                if (pullUpEl.className.match('flip')) {
                    pullUpEl.className = 'loading';
                    pullUpEl.querySelector('.pullUpLabel').innerHTML = '正在加载...';
                    /* pullUpAction();  // Execute custom function (ajax call?)*/
                    getData(strquery, 2);
                    //sortEvent(2, '&page=' + page + '&as=' + as);
                }
            }
        });

        //setTimeout(function () { document.getElementById('wrapper').style.left = '0'; }, 800);
    }

    var bInitScorll = 0; //iscroll是否被初始化 0：未，1：有

    var loadScroll = null;
    var loadScrollRefresh = null;

    function reScroll() {
        if (bInitScorll === 0) {
            loadScroll = setTimeout(function () {
                //console.log('分类进来了');
                loaded();
                bInitScorll = 1;
            }, 100)
        } else {
            loadScrollRefresh = setTimeout(function () {
                myScroll.refresh()
            }, 100);
        }
    }

   /* function bindUrl(arr) {
        var arr = {
            '.btn_wrap .btn1': 'rebate.html',
            '.btn_wrap .btn2': 'ad_payoff.html'
        };
        RuiDa.Module.bindClickBtnByArr(arr);
    }*/


    function start() {
       // RuiDa.Module.initIScroll();
        //RuiDa.Module.backHistory();
        if(sessionStorage.home_allfans === "1"){
            sessionStorage.home_allfans ="0";
            RuiDa.Module.backUrl('home.html');
        }else{
            RuiDa.Module.backUrl('fans.html');
        }

        // $("#backBtn").bind("touchend",function(){
        //     window.history.go(-1);
        // })
        sessionStorage.fans_info = '2';

        $('#searchBtn').click(function () {
             strquery = $('#searchContent').val();
            //console.log(strquery);

            if (strquery && strquery !== '请输入关键字') {

                pageIndex = 1;
                getData(strquery, 1);
            }
        });

        getData('', 1);
        //加载失败则添加默认图片
        RuiDa.Tool.getDefpicInit();
    }



    function getData(para, type) {
        console.log(123123, para)
        var url = localStorage.hostAddress + 'index.php?c=api&m=zhijiefensi' + (para && '&key=' + para);
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'jsonp',
            data: {
                page: pageIndex
            }
        }).done(function (datalist) {
                console.log(222, datalist);
                var html = '',
                    data = datalist.list,
                    pic = '',
                    name = '',
                    from = '',
                    id = '',
                    arr = {};
                /*  if(!data.length){
                 $('.seek').empty().append('<li>暂无结果</li>');
                 return;
                 }*/

               // console.log(type,data.length);
                if ( type === 1 && (datalist.length == 0 || data.length == 0)){
                    $("#theListForFans").empty();
                    $('.seek ul').empty().append('<li>暂无结果</li>');

                    pullUpEl.className = '';
                    pullUpEl.querySelector('.pullUpLabel').innerHTML = '已经是最后一页';
                    return;
                }

                if (!data.length) {

                    pullUpEl.className = '';
                    pullUpEl.querySelector('.pullUpLabel').innerHTML = '已经是最后一页';

                    reScroll();
                    return;
                }
                for (var key in data) {
                    id = data[key].id;
                    pic = RuiDa.Module.getPic(data[key].headpic, 'img/default.gif');
                    name = data[key].nickname || '';
                    if (name.indexOf("暂无昵称") >= 0) {
                        name = data[key].mobile;
                    }

                    from = data[key].from || '';
                    html += '<li><div id="fan_' + id + '"><img src="' + pic + '" class="user_pic" />';
                    html += '<div class="info_wrap">';
                    html += '<span class="name">' + RuiDa.Tool.getString(name, 8) + '</span>';
                    html += '<span class="description">' + from + '</span></div></div>';
                    html += '<div class="send_message" id="send_' + id + '">站内信</div></li>';
                    arr['#fan_' + id] = 'fans_details.html?fansid=' + id;
                    arr['#send_' + id] = 'f_letter.html?fansid=' + id + '&name=' + name;
                }
                if(type === 1){
                    $("#theListForFans").empty();
                }

                $("#theListForFans").append(html);

                // console.log(22222222, arr);
                RuiDa.Module.bindClickBtnByArr(arr);
                reScroll();


                pageIndex++;

            }).fail(function () {
                console.log("error");
            });
    }

    return {
        start: start
    }
})();
window.Fans_direct.start();
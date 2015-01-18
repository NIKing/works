/*
    发起记录代码
*/
window.Rw_record=(function(){
    var pageIndex=1;

    var myScroll,
        pullDownEl, pullDownOffset,
        pullUpEl, pullUpOffset,
        generatedCount = 0;
    var bInitScorll = 0; //iscroll是否被初始化 0：未，1：有

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
                    getData(2);
                    //sortEvent(2, '&page=' + page + '&as=' + as);
                }
            }
        });

        //setTimeout(function () { document.getElementById('wrapper').style.left = '0'; }, 800);
    }

    var loadScroll = null;
    var loadScrollRefresh = null;
    function reScroll(){
        if (bInitScorll === 0) {
            loadScroll = setTimeout(function() {
                loaded();

                bInitScorll = 1;
            }, 200)
        } else {
            loadScrollRefresh = setTimeout(function() {
                myScroll.refresh()
            }, 200);
        }
    }

    function start(){
        RuiDa.Module.backUrl('growth.html');

        getData(1);
    }
    function getData(type){
        var url= localStorage.hostAddress +'index.php?c=api&m=rewujilu';
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'jsonp',
            data: {
                page: pageIndex
            }
        }).done(function(datalist) {
                console.log(2222,datalist,pageIndex);
                var data=datalist.list,html='';

                if(!data.length){
                    reScroll();
                    pullUpEl.className = '';
                    pullUpEl.querySelector('.pullUpLabel').innerHTML = '已经是最后一页';
                    return;
                }

                for(var key in data){
                    html+='<li><span class="red_bg"></span>';
                    html+='<p>'+RuiDa.Tool.GetData(data[key].createtime,true,8)+'</p><div>'+data[key].description+'</div></li>';
                }

                if(type===1){
                    $('.record').empty();
                }
                $('.record').append(html);

                reScroll();
                pageIndex++;
               // RuiDa.Module.initIScroll();
            }).fail(function() {
                console.log("error");
            });
    }

    return {
        start:start
    }
})();
window.Rw_record.start();

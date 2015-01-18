/*
 推荐页代码
 */
var iScroll;
window.Recommend=(function(){
    var pageIndex = 1,picstr={'0':'love','1':'love_hover'},piczan={};

    var myScroll,
        pullDownEl, pullDownOffset,
        pullUpEl, pullUpOffset,
        generatedCount = 0;

    var parse_Nj = "";

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
                    getData(2,parse_Nj);
                    //sortEvent(2, '&page=' + page + '&as=' + as);
                }
            }
        });

        //setTimeout(function () { document.getElementById('wrapper').style.left = '0'; }, 800);
    }

    var sortF={
        as:'desc',
        stras:{
            'desc': 'asc',
            'asc': 'desc'
        },
        list:{},
        getlist:function(){
            $('.top_nav nav').each(function(i){
                if($(this).text()){
                    sortF.list[$(this).text()]=i;
                }
            });
        },
        listimg:{'0':'rank_desc','1':'rank_asc','2':'rank_asc'},
        listsort:{'1':'0','2':'180'},
        objindex:0,
        index:0,
        iscurrent:function(value){
          return  this.objindex===this.list[value];
        },
        getobjnextindex:function(value){
            if(!this.iscurrent(value)){
                sortF.as='desc';
                this.objindex=this.list[value];
                this.index=0;
                $('.top_nav img').each(function(){
                    if($(this).text()!==value){
                        $(this).attr('src','images/rank_desc.png').css('transform', 'rotateZ(0deg)');
                    }
                });
            }
            sortF.as=sortF.stras[sortF.as];
            sortF.index=sortF.index=== 1 ? 2 : 1;
            return sortF.index;
        },
        getobjnextimg:function(value){
            this.getobjnextindex(value);
           return this.listimg[this.index];
        },
        getobjdu:function(){
            return this.listsort[this.index];
        }
    };

    function start(){
        //RuiDa.Module.initIScroll();
        RuiDa.Module.initBottomNav();
        RuiDa.Module.backHome();

        if(sessionStorage.rebateCloneEl_recommend != null && sessionStorage.rebateCloneEl_recommend != ""){
            $(".scrollInner").html(sessionStorage.rebateCloneEl_recommend);

            //绑定事件
            bindDetails();
            //添加滚动
            reScroll();

            //设置位移
            var rebateSearchCondition = JSON.parse(sessionStorage.rebateSearchCondition_recommend);
            setTimeout( function(){
                $(".scrollInner").css("-webkit-transform","translate(0px,"+Number(rebateSearchCondition.matrix)+"px)");
            },300)

            //设置查询条件
            pageIndex = rebateSearchCondition.page;
            parse_Nj = rebateSearchCondition.parse_Nj;


        }else{
            //sortEvent(1, '&page=' + page + '&as=' + sortF.as);
            //sortEvent(1, '&page=' + page + '&as=desc');
            getData(1,'');
        }

        //发布
        $('#issueBtn').on('click', function(event) {
            window.location.href = 'issue_step2.html';
        });
        $('#rule').on('click', function() {
            window.location.href = 'rule.html';
        });

        

        sortF.getlist();
        $('.top_nav nav').each(function(){
           /* var as = 'desc',
                stras = {
                    'desc': 'asc',
                    'asc': 'desc'
                }; //asc*/
            var sortarr = {
                '最新': 'id',
                '热度': 'zan'
                },para='',name='';

            $(this).bind('click',function(){
                name=$(this).text();
                para='&order='+sortarr[name]+'&as='+sortF.stras[sortF.as];

                parse_Nj = para; //用于返回保存数据

                pageIndex  =1;

                getData(1,para);

                $(this).find('img').first().attr('src', 'images/'+sortF.getobjnextimg(name)+'.png').css('transform', 'rotateZ('+sortF.getobjdu()+'deg)');
            });
        });

    }

    function getData(type,para) {
        var  url='';
        if(para) {
            url=para;
        }

        //return;
        $.ajax({
            url: localStorage.hostAddress + 'index.php?c=api&m=tuijian_list'+url,
            type: 'GET',
            dataType: 'jsonp',
            data: {
                page: pageIndex
            }
        }).done(function(datalist) {
                console.log(222222,datalist);
                var html='',data=datalist.list,strarr={},
                    name='';

                //return;
                if(!data.length){
                    reScroll();
                    pullUpEl.className = '';
                    pullUpEl.querySelector('.pullUpLabel').innerHTML = '已经是最后一页';
                    return;
                }
                for(var key in data){
                    if(data[key].nickname){
                        name=RuiDa.Tool.getString(data[key].nickname,8);
                    }else{
                        name=RuiDa.Tool.getSafeData(data[key].mobile);
                    }
                    html+='<ul><li><div class="inner_border"><img _id='+data[key].id+' id="pic_'+data[key].id+'" src="'+RuiDa.Module.getPic(data[key].pic1_thumb,'img/portrait.png')+'" class="goods_image" onclick="onEvent(\'click\',\'wytj_goods_'+ data[key].name +'\');"/>';
                    html+='<div class="goods_info"><span class="g_left">发布人&nbsp;<em>'+name+'</em></span>';
                    html+='<span class="money Num-type">￥'+parseFloat(data[key].price||'0').toFixed(2)+'</span>';
                    html+='<span class="time"><img id="zan_'+data[key].id+'" src="images/'+(data[key].ifzan===1?picstr[1]:picstr[0])+'.png" /><em id="zannum_'+data[key].id+'">'+data[key].zan+'</em></span>';
                    html+='</div></div></li></ul>';

                    strarr['#pic_'+data[key].id]='goods_introduce.html?id='+data[key].id;
                    piczan['zan_'+data[key].id]=data[key].ifzan;
                }
                if(type===1){
                    $('.scrollInner ul').each(function() {
                        $(this).remove();
                    });
                }
                $('#pullUp').before(html);


                bindDetails();
                reScroll();
                pageIndex++;
            }).fail(function() {
                console.log("error");
            });
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

    function bindzan(){
        //var picinit='love';
        console.log(111111,piczan);
        $('img[id^=zan]').each(function(){
           var  pid=$(this).attr('id'),id=pid.split('_')[1],zan_num=$('#zannum_'+id).text();
            console.log('pid',pid,zan_num);
            if(piczan[pid]===1){
                $(this).unbind('click');
            }else{
                $(this).bind('click',function(){
                    console.log('pid',pid,zan_num);
                    $(this).attr('src','images/'+picstr['1']+'.png');
                    $('#zannum_'+id).text(parseInt(zan_num)+1);
                    getZan(id);
                    $('#zan_'+id).unbind('click');
                });
            }

        });
    }

    function getZan(id){
        var url= localStorage.hostAddress +'index.php?c=api&m=dianzan&id='+id;
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'jsonp'
        }).done(function(datalist) {
            }).fail(function() {
                console.log("error");
            });
		 onEvent('click', 'wytj_zan_'+id);
    }

    function bindDetails() {
        $('#iScroll .inner_border>img').each(function() {
            $(this).click(function(){
                    

                var html = $(".scrollInner").html();
                      //pullUpIndex = html.indexOf("pullUp");
                      //数据截取 减去9是因为获取 Pullup所在的下标，并不能完全等到有效的元素,
                      //html = html.substring(0,(pullUpIndex-9));

                 //记录当前文本节点到session
                 sessionStorage.rebateCloneEl_recommend = html;   

                 //matrix(1, 0, 0, 1, 0, -3674.5810546875) 加上2是因为后面有空格，减去1是因为前面有冒号
                 var matrix = $(".scrollInner").css("webkitTransform");
                     matrix_h = matrix.substring(matrix.lastIndexOf(",")+2,matrix.lastIndexOf(")")).trim();
                 //得到位移


                 //记录当前的筛选条件到session
                 var rebateSearchCondition = {"page":pageIndex,"matrix":matrix_h,"parse_Nj":parse_Nj};
                 sessionStorage.rebateSearchCondition_recommend = JSON.stringify(rebateSearchCondition);


                 var id = $(this).attr('_id');
                 window.location.href="goods_introduce.html?id="+id;
            })
        });
        bindzan();
    }

    return {
        start:start
    }
})();
window.Recommend.start();

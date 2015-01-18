/*
 返利代码
 */
window.Rebate = (function() {
    var page = 1,
        //as = 'asc',
        //orderKey ="price",
        orderKey ="",
        menusid = "",
        currentas='desc';
    var sortarr = {
        '价格': 'price',
        '销量': 'xiaoliang',
        '分享': 'fenxiang',
        '收藏': 'shoucang'
    };

    var myScroll,
        pullDownEl, pullDownOffset,
        pullUpEl, pullUpOffset,
        generatedCount = 0;

    function loaded() {
        /*  pullDownEl = document.getElementById('pullDown');
         pullDownOffset = pullDownEl.offsetHeight;*/
        pullUpEl = document.getElementById('pullUp');
        pullUpOffset = pullUpEl.offsetHeight;
        // console.log('$$$$$$$$$$$$$$$$');p

        myScroll = new iScroll('iScroll', {
            vScrollbar: false,
            topOffset: pullDownOffset,
            onRefresh: function() {
                /*      if (pullDownEl.className.match('loading')) {
                 pullDownEl.className = '';
                 pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Pull down to refresh...';
                 } else */
                if (pullUpEl.className.match('loading')) {
                    pullUpEl.className = '';
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
                    pullUpEl.querySelector('.pullUpLabel').innerHTML = '松开立即刷新';
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
                    //console.log('orderKey',orderKey,!orderKey,orderKey==='');

                    //if(orderKey){
                        sortEvent(2, '&page=' + page + '&as=' + currentas+"&classid="+menusid+"&order="+orderKey);//orderKey
                    // }else{
                    //     sortEvent(2, '&page=' + page + '&as=desc');
                    // }
                }
            }
        });

        //setTimeout(function () { document.getElementById('wrapper').style.left = '0'; }, 800);

        document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
    }


    //排序流程
    var sortF={
        isgosort:false,
        as:'asc',
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
            console.log(12121,sortF.list);
        },
        init:function(){
            console.log('进来了么？',sortF.isgosort);
            if(sortF.isgosort){
                console.log('对');
                sortF.as='asc';
                objindex=0;
                index=0;
                $('.top_nav nav>img').each(function(i){
                    $(this).attr('src', 'images/rank_desc.png');
                });
                sortF.isgosort=false;
            }
            //$(this).find('img').first().attr('src', 'images/'+sortF.getobjnextimg(name)+'.png').css('transform', 'rotateZ('+sortF.getobjdu()+'deg)');
        },
        listimg:{'0':'rank_desc','1':'rank_asc','2':'rank_asc'},
        listsort:{'1':'0','2':'180'},
        objindex:0,
        index:0,
        iscurrent:function(value){
            return  this.objindex===this.list[value];
        },
        initgo:function(value){

            if(!this.iscurrent(value)){
                sortF.as='asc';
                this.objindex=this.list[value];
                /*if(this.index===1){
                    sortF.as=sortF.stras[sortF.as];
                }*/
                this.index=0;
                $('.top_nav img').each(function(){
                    if($(this).text()!==value){
                        $(this).attr('src','images/rank_desc.png').css('transform', 'rotateZ(0deg)');
                    }
                });
                return false;
            }
            return true;
        },
        getobjnextindex:function(value){
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

    function start() {

        //加载ajax事件监听
        //new Loading();

        $('.clearIcons').bind('click',function(){
            $('.shadow,.classify_wrap').hide();
        });
        //RuiDa.Module.initIScroll();
        RuiDa.Module.initBottomNav();
        $("#backBtn").bind("touchstart",function(){
              //清除返利页面留下的数据
                RuiDa.Tool.removeSessionItem_rebate();
        });


        RuiDa.Module.backHome();
        sortF.getlist();

        if(sessionStorage.rebateCloneEl != null && sessionStorage.rebateCloneEl != ""){
            $(".scrollInner").html(sessionStorage.rebateCloneEl);
            //绑定事件
            bindDetails();
            //添加滚动
            reScroll();

            //设置位移
            var rebateSearchCondition = JSON.parse(sessionStorage.rebateSearchCondition);
            setTimeout( function(){
                $(".scrollInner").css("-webkit-transform","translate(0px,"+Number(rebateSearchCondition.matrix)+"px)");
            },300);

            //设置查询条件
            page = rebateSearchCondition.page;
            menusid = rebateSearchCondition.classid;
            orderKey = rebateSearchCondition.order;
            sortF.as =  rebateSearchCondition.as;

        }else{
            //sortEvent(1, '&page=' + page + '&as=' + sortF.as);
            console.log('第一次');
            sortEvent(1, '&page=' + page + '&as=desc');
        }
        sortClick();  

        /*$("#moreBtn").bind('touchstart', function() {
            sortEvent(2, '&page=' + page + '&as=' + as);
        });*/

        document.addEventListener('touchmove', function(e) {
            e.preventDefault();
        }, false);

        $("#header_searchIcon").bind("touchend",function(){

            sessionStorage.removeItem("rebateCloneEl_Search");
            sessionStorage.removeItem("rebateSearchCondition_Search");

            window.location.href="rebate_search.html";
        });

        setTimeout(function() {
            window.oneClassIScroll = new iScroll('oneClassIScroll', {
                vScrollbar: false
            });
            window.twoClassIScroll = new iScroll('twoClassIScroll', {
                vScrollbar: false
            });
        }, 200);

        $('#classifyBtn').on('touchend', function() {
            $('.shadow,.classify_wrap').show();
            $('.classify_one').animate({
                left: 0
            }, 100);

             //二级菜单显示
            $('.classify_two').show().animate({
                width: '50%'
            }, 100);

            //点击隐藏分类
            $('header,.shadow').on('touchend', function() {
                hideMenusSort();
            });



            $.ajax({
                url: localStorage.hostAddress + 'index.php?c=api&m=myclass',
                type: 'GET',
                dataType: 'jsonp'
            }).done(function(data) {
                var arrs = [],
                    ids = [];
                for (var i in data.class) {
                    arrs.push(data.class[i].name);
                    ids.push(data.class[i].id);
                }
                var dom = createOneDom(arrs, ids);
                $('.classify_one ul').html(dom);
                setTimeout(function() {
                    oneClassIScroll.refresh();
                }, 200);
            }).fail(function() {
                console.log("error");
            });
        });

        $('.classify_one').on('click', 'li', function() {
            var id = $(this).attr('_id'),
                _this = $(this);


            var el = $(this);
            resetOneMenusClass(el);
            //给选定的菜单加颜色
            setSelectMenusClass(el);
            


            $.ajax({
                url: localStorage.hostAddress + 'index.php?c=api&m=myclass',
                type: 'GET',
                dataType: 'jsonp',
                data: {
                    parentid: id
                }
            }).done(function(data) {
                var arrs = [],
                    ids = [];

                //如果class数组没有的话，就认为没有三级菜单
                if(data.class.length <=0){
                    var id = _this.attr('_id');

                    getShopInfoByMenus(id);
                    return;
                    
                }

                for (var i in data.class) {
                    arrs.push(data.class[i].name);
                    ids.push(data.class[i].id);
                }

                var dom = createTwoDom(arrs, ids);
                $('.classify_two ul').html(dom);

                addEventToTwoMensus();


                setTimeout(function() {
                    twoClassIScroll.refresh();
                }, 200);

            }).fail(function() {
                console.log("error");
            });

        });

    }

    function addEventToTwoMensus(){

        $('.classify_two ul > li').each(function(){
            $(this).bind('click', function() {
                var id = $(this).attr('_id'),
                    _this = $(this);

                    $.ajax({
                        url: localStorage.hostAddress + 'index.php?c=api&m=myclass',
                        type: 'GET',
                        dataType: 'jsonp',
                        data: {
                            parentid: id
                        }
                    }).done(function(data) {
                        var arrs = [],
                            ids = [];

                        //如果class数组没有的话，就认为没有三级菜单
                        if(data.class.length <=0){
                           var id = _this.attr('_id');

                            getShopInfoByMenus(id);

                            return;
                        }

                        for (var i in data.class) {
                            arrs.push(data.class[i].name);
                            ids.push(data.class[i].id);
                        }

			             $('.classify_three').remove();

                        var dom = createThreeDom(arrs, ids);
                        _this.after(dom);

                        //设置二级分类
                        resetTwoMenusClass();
                        setTwoMenusClass(_this);

                        setTimeout(function() {
                            twoClassIScroll.refresh();
                        }, 200);

                        // 点击查询商品
                        $('.classify_three li').each(function(){
				            $(this).bind('click',function() {
                            	var id = $(this).attr('_id');

                            	getShopInfoByMenus(id);

                        	});
			            })
                    }).fail(function() {
                        console.log("error");
                    });
          
            });
        }) 
    }

    /*function vScroRefresh() {
        setTimeout(function() {
            iScroll.refresh();
        }, 200);
    }*/

    var _bRequest = 0; //0：未请求，1已请求
    function sortEvent(type, para) {
        var strurl = 'index.php?c=api&m=goods' + (para || '');
        $.ajax({
            url: localStorage.hostAddress + strurl,
            type: 'GET',
            dataType: 'jsonp'
        }).done(function(datalist) {
            var data = datalist.list,
                html = '',
                i = 1;


            if (!data.length) {

                if (type === 1) {
                    $('.scrollInner ul').each(function() {
                            $(this).remove();
                    });
                }

                reScroll();

                pullUpEl.className = '';
                pullUpEl.querySelector('.pullUpLabel').innerHTML = '已经是最后一页';
                    // this.maxScrollY = pullUpOffset;
                return;
            }
            for (var res in data) {
                if (i % 2 === 1) {
                    html += '<ul class="inner_border_ul">';
                }
                html += '<li><div class="inner_border" id="' + data[res].id + '">';
                html += '<img id="img_' + data[res].id + '" src="' + RuiDa.Module.getPic(data[res].pic, 'img/goods.jpg') + '" class="goods_image" onclick="onEvent(\'click\',\'zdm_googds_'+data[res].name+'\');"/>';
                html += '<div class="description">' + data[res].name + '</div>';
                html += '<div class="goods_info">';
                html += '<span class="money Num-type">' + parseFloat(data[res].price).toFixed(2) + '</span>';
                html += '<span class="discount">' + (data[res].zhekou || '不打') + '折</span>';
                html += '</div>';

                html += '<div class="share_number">' + (data[res].fenxiang || '0') + '人分享</div></div></li>';
                if (i % 2 === 0 || i === data.length) {
                    html += '</ul>';
                }
                i++;
            }
            if (type === 1) {
                $('.scrollInner ul').each(function() {
                    $(this).remove();
                });
            }
            $('#pullUp').before(html);

            bindDetails();
            reScroll();

            //需要对每个图片设置监听事件
                $(".scrollInner img").load(function(){
                    setTimeout(function(){
                        myScroll.refresh();

                    },600)
                })

            page++;

            //vScroRefresh();
        }).fail(function() {
            console.log("error");
        });
    }

    var loadScroll = null;
    var loadScrollRefresh = null;
    function reScroll(){

        if (_bRequest === 0) {
            loadScroll = setTimeout(function() {
                loaded();

                _bRequest = 1;
            }, 100)
        } else {
            //if (loadScroll != null) clearTimeout(loadScroll);
            //if (loadScrollRefresh != null) clearTimeout(loadScrollRefresh);

            //loadScrollRefresh = setTimeout(function() {
                myScroll.refresh();
            //}, 100);
        }


    }

    function getShopInfoByMenus(id){
        setTimeout(function(){
            getShopInfoByMenus1(id);
        },300);
    }

    function getShopInfoByMenus1(id){
        if(id ==null || id=="")return;

        orderKey = ""; //设置排序为空

        page = 1;
        menusid = id;
        currentas='desc';

        sortF.isgosort=true;
        console.log('设置了么', sortF.isgosort);
        sortF.init();
        //sortEvent(1, '&page=' + page + '&as=' + sortF.as +'&classid='+id);
        sortEvent(1, '&page=' + page + '&as=' + currentas +'&classid='+id);

        //移除现有的筛选条件
        hideMenusSort();

        //移除排序条件
        removeNavSort();
    }

    function bindDetails() {
        $('#iScroll .inner_border img').each(function() {
            $(this).click(function(){
                    

                var html = $(".scrollInner").html();
                      //pullUpIndex = html.indexOf("pullUp");
                      //数据截取 减去9是因为获取 Pullup所在的下标，并不能完全等到有效的元素,
                      //html = html.substring(0,(pullUpIndex-9));

                 //记录当前文本节点到session
                 sessionStorage.rebateCloneEl = html;   

                 //matrix(1, 0, 0, 1, 0, -3674.5810546875) 加上2是因为后面有空格，减去1是因为前面有冒号
                 var matrix = $(".scrollInner").css("webkitTransform");
                     matrix_h = matrix.substring(matrix.lastIndexOf(",")+2,matrix.lastIndexOf(")")).trim();
                 //得到位移


                 //记录当前的筛选条件到session
                 var rebateSearchCondition = {"page":page,"as":sortF.as,"classid":menusid,"matrix":matrix_h,"order":orderKey};
                 sessionStorage.rebateSearchCondition = JSON.stringify(rebateSearchCondition);


                 var id = $(this).attr('id').split('_')[1];
                 window.location.href="goods_details.html?id="+id;


                 // RuiDa.Module.binClick('#' + id, 'goods_details.html?id=' + id);
            })
        });
    }

    var bSort = 0,
        oldValue = "";
    function sortClick() {
        $(".top_nav nav").each(function() {
            $(this).bind('click', function() {
                var value = $(this).text().replace(/(^\s*)|(\s*$)/g, ""),
                    name=$(this).text(),
                    //strpara = '&page=1&as=' + (sortF.initgo(name)? sortF.stras[sortF.as]:sortF.stras[sortF.as]) + '&order=',
                    strpara='',
                    strpic = {
                        '1': '2',
                        '2': '1'
                    };
                //console.log(12321313,sortF.as);
                console.log('name',name);
                sortF.initgo(name);
                strpara = '&page=1&as=' + sortF.stras[sortF.as] + '&order=';
                currentas=sortF.stras[sortF.as];



                $(this).find('img').first().attr('src', 'images/'+sortF.getobjnextimg(name)+'.png').css('transform', 'rotateZ('+sortF.getobjdu()+'deg)');
                page = 1; //重新取值
                menusid = "";
                if (value) {
                    orderKey = sortarr[value];
                    strpara += orderKey;

                    sortEvent(1, strpara);
                }
            });
        });
    }

    function removeNavSort(){
        $(".top_nav nav").each(function() {
            $(this).find('img').first().attr('src', 'images/rank_desc.png');
            // $(this).find('img').first().css('transform', 'rotateZ(0deg)');
        });

        bSort = 0;
        oldValue = "";
    }
    function hideMenusSort(){
                $('header,.shadow').off();
                $('.shadow,.classify_wrap').hide();
                $('.classify_one ul,.classify_two ul').html('');
                $('.classify_one').css('left', '-160px');
                $('.classify_two').css('width', '0');
       
    }

    function resetOneMenusClass(){

        var oneMenus = $('.classify_one li span');
        for(var i=0,oneMenusLen = oneMenus.length;i<oneMenusLen;i++){
             if($(oneMenus[i]).attr("style")){
                    $(oneMenus[i]).removeAttr("style");

                    //移除父元素style
                    $(oneMenus[i].parentElement).removeAttr("style");
                }
        }
    }

    function resetTwoMenusClass(){
        var oneMenus = $('.classify_two li span');
        for(var i=0,oneMenusLen = oneMenus.length;i<oneMenusLen;i++){
             if($(oneMenus[i]).attr("style")){
                    $(oneMenus[i]).removeAttr("style");

                    //移除父元素style
                    // $(oneMenus[i].parentElement).removeAttr("style");
                }
        }
    }
    function setTwoMenusClass(el){
        if(el ==null)return;
       el.context.firstChild.style.color ="#fb512d";  //rebate_showThreeMenus
       el.context.firstChild.style.background = "url(images/rebate_showThreeMenus.png) no-repeat 95% center";
    }

    function setSelectMenusClass(el){
        if(el ==null)return;
        el.css("background-color","rgba(203, 203, 203, 0.8)");
        el.context.firstChild.style.color ="#fb512d";
        el.context.firstChild.style.background = "url(images/next_selecter.png) no-repeat 95%";
    }

    var createOneDom = function(arrs, ids) {
        var lis = '';
        for (var i in arrs) {
            lis += '<li _id="' + ids[i] + '"><span>' + arrs[i] + '</span></li>';
        }

        return lis;
    }

    var createTwoDom = function(arrs, ids) {
        var lis = '';
        for (var i in arrs) {
            lis += '<li _id="' + ids[i] + '"><span>' + arrs[i] + '</span></li>';
        }

        return lis;
    }

    var createThreeDom = function(arrs, ids) {
        var lis = '';
        for (var i in arrs) {
            lis += '<li _id="' + ids[i] + '"><span>' + arrs[i] + '</span></li>';
        }

        var dom =
            '<div class="classify_three">' +
            '<ul>' +
            lis +
            '</ul>' +
            '</div>';

        return dom;
    }

    return {
        start: start
    }
})();
window.Rebate.start();

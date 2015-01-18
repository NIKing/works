window.rebate_search = (function() {

    var myScroll,
        pullDownEl, pullDownOffset,
        pullUpEl, pullUpOffset,
        generatedCount = 0,
        page = 1;

    var keyWord = "";


    function start() {
        init();
        //显示关键字
        showKeyWordByAjax();
        //添加事件
        addEvent();
    }

    function init() {


        if (sessionStorage.rebateCloneEl_Search != null && sessionStorage.rebateCloneEl_Search != "") {

            $(".scrollInner").html(sessionStorage.rebateCloneEl_Search);

            hideKeyWord();

            //绑定事件
            addEvent();

            bindDetails();

            //添加滚动
            reScroll();

            //设置位移
            var rebateSearchCondition = JSON.parse(sessionStorage.rebateSearchCondition_Search);
            setTimeout(function() {
                $(".scrollInner").css("-webkit-transform", "translate(0px," + Number(rebateSearchCondition.matrix) + "px)");
            }, 300)

            //设置查询条件
            page = rebateSearchCondition.page;
            keyWord = rebateSearchCondition.keyWord;

        }

        $("#pullUp").addClass("hide_class");

        $("#backBtn").bind("touchend", function() {
            window.location.href = "rebate.html";
        })
    }



    function loaded() {
        /*  pullDownEl = document.getElementById('pullDown');
         pullDownOffset = pullDownEl.offsetHeight;*/
        pullUpEl = document.getElementById('pullUp'),
        pullUpOffset = pullUpEl.offsetHeight;
        // console.log('$$$$$$$$$$$$$$$$');

        myScroll = new iScroll('warpper', {
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
                    pullUpEl.querySelector('.pullUpLabel').innerHTML = 'Pull up to load more...';
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
                    page++;

                    getSearchInfoByKey(keyWord, page);
                }
            }
        });

        //setTimeout(function () { document.getElementById('wrapper').style.left = '0'; }, 800);
    }

    function showKeyWordByAjax() {
        var showKey_setting = {
            url: localStorage.hostAddress + "index.php?c=api&m=key_list",
            type: 'GET',
            dataType: 'jsonp',
            success: function(result) {
                if (result == null || result == "") {
                    hideKeyWord();
                    return;
                }
                var keyWordLen = result.list.length;
                if (keyWordLen <= 0) {
                    hideKeyWord();
                    return;
                }

                var html_keyWord = "";
                for (var i = 0; i < keyWordLen; i++) {
                    var keyWordList = result.list[i];

                    html_keyWord += " <li>" + keyWordList.name + "</li>";
                }

                $("#searchKeyWordsList").append(html_keyWord);

                //给每一个元素绑定事件
                addEventEveryEl();
            }
        }

        $.ajax(showKey_setting);
    }

    function addEvent() {
        $("#btn_search").bind("touchend", function() {
            keyWord = $("#keyWord").val();

            if (keyWord == null || keyWord == "") {
                console.log("请输入关键字");
                return;
            }

            $("#thenList").empty();

            getSearchInfoByKey(keyWord, 1);
        })
    }

    function hideKeyWord() {
        $(".search_key").addClass("hide_class");
    }

    function getSearchInfoByKey(key, page) {
        //console.log('进来了么？');
        if (key == null || key == "") return;

        var strurl = 'index.php?c=api&m=goods&key=' + key + "&page=" + page;

        $.ajax({
            url: localStorage.hostAddress + strurl,
            type: 'GET',
            dataType: 'jsonp'
        }).done(function(datalist) {
             console.log("数据", datalist);
            var data = datalist.list,
                html = '',
                i = 1;
            if (!data.length) {
                //console.log('一条数据也没有1');
                $('#searchKeyWordsList').hide();
                $('#nores').show();
                reScroll();
                return;
            }else{
                //console.log('一条数据也没有2');
                $('#searchKeyWordsList').show();
                $('#nores').hide();
            }
            // console.log('执行！');
            for (var res in data) {
                if (i % 2 === 1) {
                    html += '<ul>';
                }
                html += '<li><div class="inner_border" id="' + data[res].id + '">';
                html += '<img src="' + RuiDa.Module.getPic(data[res].pic, 'img/goods.jpg') + '" class="goods_image" />';
                html += '<div class="description">' + data[res].name + '</div>';
                html += '<div class="goods_info">';
                html += '<span class="money">' + data[res].price + '</span>';
                html += '<span class="discount">' + (data[res].zhekou || '不打') + '折</span>';
                html += '</div>';

                html += '<div class="share_number">' + (data[res].fenxiang || '0') + '人分享</div></div></li>';
                if (i % 2 === 0 || i === data.length) {
                    html += '</ul>';
                }
                i++;
            }
            $('#thenList').append(html);

            $("#pullUp").removeClass("hide_class");

            hideKeyWord();

            bindDetails();
            reScroll();
        }).fail(function() {
            console.log("error");
        });
    }

    var loadScroll = null;
    var loadScrollRefresh = null;
    var _bRequest = 0; //0：未请求，1已请求
    function reScroll() {

        if (_bRequest === 0) {
            loadScroll = setTimeout(function() {
                loaded();

                _bRequest = 1;
            }, 1)
        } else {
            if (loadScroll != null) clearTimeout(loadScroll);
            if (loadScrollRefresh != null) clearTimeout(loadScrollRefresh);

            loadScrollRefresh = setTimeout(function() {
                myScroll.refresh();
            }, 1);
        }
    }

    function addEventEveryEl() {
        $("#searchKeyWordsList li").each(function() {
            $(this).bind("click", function() {
                var keyVal = $(this).html();
                keyWord = keyVal;

                getSearchInfoByKey(keyVal, 1);
            })
        })
    }


    function bindDetails() {
        $('#iScroll .inner_border img').each(function() {
            $(this).click(function() {


                var html = $(".scrollInner").html();
                //数据截取 减去9是因为获取 Pullup所在的下标，并不能完全等到有效的元素,
                //html = html.substring(0,(pullUpIndex-9));

                //记录当前文本节点到session
                sessionStorage.rebateCloneEl_Search = html;

                //matrix(1, 0, 0, 1, 0, -3674.5810546875) 加上2是因为后面有空格，减去1是因为前面有冒号
                var matrix = $(".scrollInner").css("webkitTransform");
                matrix_h = matrix.substring(matrix.lastIndexOf(",") + 2, matrix.lastIndexOf(")")).trim();
                //得到位移


                //记录当前的筛选条件到session
                var rebateSearchCondition = {
                    "keyWord": keyWord,
                    "matrix": matrix_h,
                    "page": page
                };
                sessionStorage.rebateSearchCondition_Search = JSON.stringify(rebateSearchCondition);


                var id = $(this).parent().attr('id');
                console.log(121212,id);

                window.location.href = "goods_details.html?id=" + id;


                // RuiDa.Module.binClick('#' + id, 'goods_details.html?id=' + id);
            })
        });
    }

    return {
        start: start
    }
})();
rebate_search.start();

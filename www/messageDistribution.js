/*
 收支明细
 */
window.MessageDistribution = (function () {
    var typearr = {
            'type1': '1',
            'type2': '1',
            'type3': '0'
        },
        isscroll = true,
        delarr = [],
        sendaskarr=[];



    function start() {
        $('ul li').each(function () {
            $(this).bind('touchend', function () {
                $(this).addClass("light").siblings().removeClass("light");
                var objid = $(this).attr('id');
                getData(typearr[objid], objid);
            });
        });
        RuiDa.Module.bindClickBtn('#set', 'messageSet.html');
        getData(typearr['type1'],'type1');
        RuiDa.Module.backUrl('person.html');
        sessionStorage.money_manager_url = "3";
        sessionStorage.fans_info='1';

    }

    //type:0管理员发送1系统自动发送
    //type=1时，type2的类型：积分：1邀请好友2获得乐币　站内信：3收到站内信
    function getData(type, strobjid) {
        delarr=[];
        var url = localStorage.hostAddress + 'index.php?c=api&m=news_list&type=' + type;
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'jsonp',
            async: false
        }).done(function (datalist) {
                console.log(2222,datalist);
                var html = '',
                    data = datalist.list,
                    arr = {},
                    strurl = {
                        '0': '无',
                        '1': 'fans_details.html',
                        '2': 'money_manager.html',
                        '3': 'message_details.html'
                    },
                    id = '',
                    touserid = '';
                //积分&好友type2
                if (type === '1') {
                    $('#iScrollInner').attr('class', 'iScrollInner ol1');
                } else {
                    $('#iScrollInner').attr('class', 'iScrollInner ol2');
                }

                for (var key in data) {
                    id = data[key].id;
                    touserid = data[key].type2_id;
                   // var readStatus = data[key].open;  //0：未读，1：已读
                   //var readStatus = '0';  //0：未读，1：已读

                    if (type === '1') {
                        if(strobjid === 'type1'){
                           /* if(data[key].type2 === '4'){
                                html += '<li class="li1" id="li_' + id + '"><i class="i1" id="look' + id + '" _id=' + id + '>' + data[key].title + '</i>';
                                html += '<em id="delete_' + id + '">同意</em><p class="p1">' + RuiDa.Tool.GetData(data[key].createtime || new Date().getDate(), true, 8) + '</p></li>';
                                delarr.push('#delete_' + id);
                                //arr['#look' + id] =strurl[data[key].type2]+(data[key].type2==='1' ?('?fansid='+touserid):'');
                            }*/
                            if(data[key].type2 === '4'){
                                var htmlbtn='';
                                if(data[key].tx==='0'){
                                    htmlbtn ='<div class="sendask" id="refuse_' + touserid + '_'+id+'">拒绝</div><div class="sendask" id="agree_' + touserid + '_'+id+'">同意</div>';
                                    sendaskarr.push('#refuse_' + touserid+'_'+id);
                                    sendaskarr.push('#agree_' + touserid+'_'+id);
                                    delarr.push('#delete_' + id);
                                }else{
                                    htmlbtn='<em id="delete_' + id + '">删除</em>';
                                    delarr.push('#delete_' + id);
                                }
                                html += '<li class="li1" id="li_' + id + '"><i class="i1" id="look' + id + '" _id=' + id + '>' + data[key].title + '</i>';
                                html += htmlbtn+'<br/><p class="p1">' + RuiDa.Tool.GetData(data[key].createtime || new Date().getDate(), true, 8) + '</p></li>';


                                //arr['#look' + id] =strurl[data[key].type2]+(data[key].type2==='1' ?('?fansid='+touserid):'');
                            }

                            if(data[key].type2 === '1'||data[key].type2 === '2'){
                                html += '<li class="li1" id="li_' + id + '"><i class="i1" id="look' + id + '" _id=' + id + '>' + data[key].title + '</i>';
                                html += '<em id="delete_' + id + '">删除</em><p class="p1">' + RuiDa.Tool.GetData(data[key].createtime || new Date().getDate(), true, 8) + '</p></li>';
                                delarr.push('#delete_' + id);
                                arr['#look' + id] =strurl[data[key].type2]+(data[key].type2==='1' ?('?fansid='+touserid):'');
                            }
                        }else if(strobjid === 'type2'){
                            if(data[key].type2 === '3'){
                                html += '<li class="li1" id="li_' + id + '"><i class="i1" id="look' + id + '" _id=' + id + '>' + data[key].title + '</i>';
                                html += '<em id="delete_' + id + '">删除</em><p class="p1">' + RuiDa.Tool.GetData(data[key].createtime || new Date().getDate(), true, 8) + '</p></li>';
                                delarr.push('#delete_' + id);
                                arr['#look' + id] = strurl[data[key].type2] + "?id=" + touserid;
                            }
                        }
                    } else if(type === '0') {
                        html += '<li class="li2"><i class="i2">' + data[key].content + '</i>';
                        html += '<p class="p2">' + RuiDa.Tool.GetData(data[key].createtime || new Date().getDate(), true, 8) + '</p> </li>';
                    }
                }
                html += '</ol>';
                $('#iScrollInner').empty().append(html);
                alterReadStatus();
                RuiDa.Module.bindClickBtnByArr(arr);
                setTimeout(function () {
                    if (isscroll) {
                        setTimeout(RuiDa.Module.initIScroll, 100);
                        isscroll = false;
                    } else {
                        setTimeout(RuiDa.Module.refreshIScroll, 100);
                    }
                }, 100);

                //setTimeout(delArr,200);// delArr();//删除
                delArr();

                //同意或拒绝
                sendArr();
            }).fail(function () {
                console.log("error");
            });
    }

    function delArr() {
        for (var ikey in delarr) {
            delData(delarr[ikey]);
        }
        delarr=[];
    }

    function sendArr(){
        console.log(123123123,sendaskarr);
        for (var jkey in sendaskarr) {
            sendandask(sendaskarr[jkey]);
        }
        sendaskarr=[];
    }

    function sendandask(keyid){
        var idarr=keyid.split('_'),
            strcontent=idarr[0]==='#agree'?'同意么':'拒绝么',
            status=idarr[0]==='#agree'?'1': 2,
            sid =idarr[1],
            id=idarr[2];
        console.log(123121312,idarr[0],status);

        $(keyid).bind('touchend', function () {
            //sendaks();
            window.RuiDa.Alert.showConfirm('您确定'+strcontent, '提示', function (btn) {
                if(btn===2) sendaks();
            });
        });
        function sendaks(){
            var url = localStorage.hostAddress + 'index.php?c=api&m=jifen_to_user_apped';
            $.ajax({
                url: url,
                type: 'GET',
                dataType: 'jsonp',
                //async: false,
                data:{
                    sid:sid,
                    status:status
                }
            }).done(function (data) {
                    console.log(88888888888,data);
                    if (data.result) {
                        window.RuiDa.Alert.showConfirm('成功', '提示', function () {
                            $(keyid).parent().find('p').first().before('<em id="delete_' + id + '">删除</em>');
                            $(keyid).parent().find('div').each(function(){
                                $(this).remove();
                            });
                            delData("#delete_"+id);
                        },'确定');
                    }else{
                        RuiDa.Alert.showAlert(data.info, '', '提示', '确定');
                    }
                    //setTimeout(RuiDa.Module.refreshIScroll, 100);
                }).fail(function () {
                    console.log("error");
                });
        }
    }

    function delData(infoid) {
        console.log('删除进来了',infoid);
        var delid = infoid.split('_')[1];
        $(infoid).bind('touchend', function () {
            console.log('hsdlfsjfl点了么');
            window.RuiDa.Alert.showConfirm('您确定删除该站内信么？', '提示', function (btn) {
             if(btn===2) deleteletter();
             });
        });
        function deleteletter(){
            var url = localStorage.hostAddress + 'index.php?c=api&m=del_news&id=' + delid;
            $.ajax({
                url: url,
                type: 'GET',
                dataType: 'jsonp',
                async: false
            }).done(function (data) {
                    if (data.result) {
                        $('#li_' + delid).remove();
                    }
                    setTimeout(RuiDa.Module.refreshIScroll, 100);
                }).fail(function () {
                    console.log("error");
                });
        }
    }


    function alterReadStatus() {
        // if(id =="" || id ==null) return;

        $(".iScrollInner li i").each(function () {

            $(this).bind("touchend", function () {
                var _id = $(this).attr("_id");

                alterReadStatus_ajax(_id);
            })

        })
    }

    function alterReadStatus_ajax(id) {
        if (id == null || id == "")return;

        var alterReadStatus_Ajax = {
            url: localStorage.hostAddress + "index.php?c=api&m=update_news_open&id=" + id,
            type: 'GET',
            dataType: 'jsonp',
            success: function (data) {
                console.log(data);
            }
        };

        $.ajax(alterReadStatus_Ajax);
    }

    return {
        start: start
    }
})();
window.MessageDistribution.start();


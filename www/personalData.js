/*
 个人资料页面代码
 */
// sessionStorage.historyLength = sessionStorage.historyLength || -1;
window.PersonalData = (function() {
    function start() {
        RuiDa.Module.backHistory();
        RuiDa.Module.initIScroll();

        getData();

        //加载失败则添加默认图片
        RuiDa.Tool.getDefpicInit();

        //选择省
        //点击X时的事件
        $(".s_xian>p").click(function() {
            $(".s_xian").css({
                "display": "none"
            });
        });

        var AreaInfo = {};
        //点击省
        $('#sheng').bind('click', function() {
            var html = '';
            getProvince(function() {
                for (var key in AreaInfo) {
                    html += '<li id="pro_' + key + '">' + AreaInfo[key].province + '</li>';
                }
                $('.area').empty().append(html);
                $(".s_xian").css({
                    "display": "block"
                });
                $("#maskLayout").removeClass("maskLayoutHidder");
                //实现滚动
                //loaded();
                //refreshIScroll();

                $(".area > li").bind('click', function() {
                    $("#sheng").attr('pid', $(this).attr('id'));
                    $("#sheng").text($(this).text());
                    $('#shi').text('市');
                    $(".s_xian").css({
                        "display": "none"
                    });
                });
                RuiDa.Module.refreshIScroll();
            });
        });

        function getProvince(fn) {
            var url = localStorage.hostAddress + 'index.php?c=api&m=get_all_city';
            $.ajax({
                url: url,
                type: 'GET',
                dataType: 'jsonp'
            }).done(function(datalist) {
                var data = datalist.res,
                    AreaCity = {};
                for (var keyp in data) {
                    AreaCity = {};
                    AreaInfo[keyp] = {
                        'city': {},
                        province: data[keyp].province
                    };
                    for (var keyc in data[keyp].city) {
                        AreaCity[data[keyp].city[keyc].cityID] = data[keyp].city[keyc].city;
                    }
                    AreaInfo[keyp]['city'] = AreaCity;
                }
                fn();
            }).fail(function() {
                console.log("error");
            });
        }

        function getCity() {

            var url = localStorage.hostAddress + 'index.php?c=api&m=get_province';
            $.ajax({
                url: url,
                type: 'GET',
                dataType: 'jsonp'
            }).done(function(datalist) {
                console.log('222222province', datalist);
            }).fail(function() {
                console.log("error");
            });
        }

        //点击市
        $('#shi').bind('click', function() {
            var html = '',
                strid = $('#sheng').attr('pid'),
                pid = '',
                citylist = {};
            if (strid) {
                pid = strid.split('_')[1];
                //citylist = cityArr[pid];
                citylist = AreaInfo[pid].city;
            } else {
                return;
            }
            console.log('pid', pid);
            for (var key in citylist) {
                html += '<li id="city_' + key + '">' + citylist[key] + '</li>';
            }
            console.log(html);
            $('.area').empty().append(html);
            $(".s_xian").css({
                "display": "block"
            });
            $("#maskLayout").removeClass("maskLayoutHidder");

            //实现滚动
            //refreshIScroll();
            RuiDa.Module.refreshIScroll();
            //loaded();

            $(".area>li").bind('click', function() {
                $("#shi").attr('cid', $(this).attr('id'));
                $("#shi").text($(this).text());
                $(".s_xian").css({
                    "display": "none"
                });
            });
        });

        $('.modify_btn').on('touchstart', function() {
            $(this).hide().next().show().next().show();
            $('input[type=text]').removeAttr('disabled');
            $('em').hide().next().show();
            $('.s_ShiFiled').hide();
            $('.s_Shi').show();
            var strqianming = $('#qianming').val();
            if (strqianming === '这家伙很懒，什么都没写') {
                $('#qianming').val('');
            }
        });

        $('.cancel_btn').on('touchstart', function() {
            getData();
            $(this).hide().prev().hide().prev().show();
            $('input[type=text]').attr('disabled', 'disabled');
            $('em').show().next().hide();
            $('.s_ShiFiled').show();
            $('.s_Shi').hide();
        });


        $('.sure_btn').on('touchstart', function() {
            console.log('点击了确定');
            var nickname = $('#nickname').val(),
                sheng = $('#sheng').text(),
                shi = $('#shi').text(),
                shiid = '',
                area = $('#area').val(),
                sex = getRadioValue("sex"),
                qianming = $('#qianming').val();
            console.log('数据', nickname, sheng, shi, area, sex, qianming);

            if (!nickname || nickname === '暂无昵称') {
                console.log('昵称不能为空');
                window.RuiDa.Alert.showAlert('昵称不能为空', '', '警告', '返回');
                return;
            }

            if (sheng === '省' || shi === '市') {
                console.log('省或市不能为空');
                window.RuiDa.Alert.showAlert('省或市不能为空', '', '警告', '返回');
                return;
            } else {
                shiid = $('#shi').attr('cid').split('_')[1];
            }

           /* if (!area) {
                console.log('居住地不能为空');
                window.RuiDa.Alert.showAlert('居住地不能为空', '', '警告', '返回');
                return;
            }*/

            if (!qianming) {
                qianming = '这家伙很懒，什么都没写';
                //return;
            }

            $.ajax({
                //url: localStorage.hostAddress + 'index.php?c=api&m=update_nickname',
                url: localStorage.hostAddress + 'index.php?c=api&m=update_nickname',
                type: 'GET',
                dataType: 'jsonp',
                data: {
                    nickname: nickname,
                    city: shiid,
                    diqu: area,
                    sex: sex,
                    qianming: qianming
                }
            }).done(function(data) {
                window.RuiDa.Alert.showAlert('修改成功', '', '成功', '返回');
                getData();
                $('.cancel_btn').hide().prev().hide().prev().show();
                $('input[type=text]').attr('disabled', 'disabled');
                $('em').show().next().hide();
                $('.s_ShiFiled').show();
                $('.s_Shi').hide();
            }).fail(function() {
                window.RuiDa.Alert.showAlert('修改失败', '', '失败', '返回重试');
            });
        });

        $('#imgInput').on('change', function() {
            if ($('#imgInput').val() == 0) {
                window.RuiDa.Alert.showAlert('请选择图片', '', '警告', '返回');
                return;
            }
            $('.wait_shadow').show();
            $("#imgModify").ajaxSubmit({
                url: localStorage.hostAddress + "index.php?c=api&m=upload_headpic",
                success: function(data) {
                    if (data == "ok") {
                        getData();
                        window.RuiDa.Alert.showAlert('上传成功', '', '成功', '返回');
                    } else {
                        window.RuiDa.Alert.showAlert('上传失败', '', '失败', '返回重试');
                    }
                    $('.wait_shadow').hide();
                },
                error: function() {
                    window.RuiDa.Alert.showAlert('上传失败', '', '失败', '返回重试');
                }
            });
        });
    }

    function photos() {

        $("#clearMaskLayout").click(function() {
            addMaskLayout();
        });
        $("#maskLayout").click(function() {
            addMaskLayout();
        });
        $("#pic").click(function() {
            removeMaskLayout();
            $("#alterHeadPortrait").removeClass("maskLayoutHidder");
        });

        function removeMaskLayout() {
            $("#maskLayout").removeClass("maskLayoutHidder");
            $("#clearMaskLayout").removeClass("maskLayoutHidder");
        }

        function addMaskLayout() {
            $("#maskLayout").addClass("maskLayoutHidder");
            $("#payList").addClass("maskLayoutHidder");
            $("#clearMaskLayout").addClass("maskLayoutHidder");
            $("#alterHeadPortrait").addClass("maskLayoutHidder");
        }

        var pictureSource; //图片来源
        var destinationType; //返回的图片数据格式
        var pictureSourceStatus = 0; //0来自相册，1来自拍照

        document.addEventListener("deviceready", onDeviceReady, false);
        // onDeviceReady();
        // 设备初始化之后调用
        function onDeviceReady() {
            pictureSource = navigator.camera.PictureSourceType;
            destinationType = navigator.camera.DestinationType;
            //拍照
            $("#photograph").click(function() {
                takePicture().then(uploadPicture).then(deletePictureFromCache);
            });

            //从相册选择
            $("#PhotoSelect").click(function() {
                //getPhoto(pictureSource.SAVEDPHOTOALBUM);
                //addMaskLayout();
                selectPhoto_Picture().then(uploadPicture).then(deletePictureFromCache);
            });
        }

        //相册选择上传
        function selectPhoto_Picture() {
            var deferred = when.defer(),
                destinationType = navigator.camera.DestinationType,
                options = {
                    quality: 100,
                    destinationType: destinationType.FILE_URI,
                    sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                    //cameraDirection: Camera.Direction.FRONT,
                    targetWidth: 240,
                    targetHeight: 320,
                    correctOrientation: true
                };
            navigator.camera.getPicture(function(data) {
                deferred.resolve(data);
            }, null, options);
            pictureSourceStatus = 0;
            return deferred.promise
        }

        // 打开摄像头拍照
        function takePicture() {
            var deferred = when.defer(),
                destinationType = navigator.camera.DestinationType,
                options = {
                    quality: 100,
                    destinationType: destinationType.FILE_URI,
                    //sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                    //cameraDirection: Camera.Direction.FRONT,
                    targetWidth: 240,
                    targetHeight: 320,
                    correctOrientation: true
                };
            navigator.camera.getPicture(function(data) {
                deferred.resolve(data);
            }, null, options);
            pictureSourceStatus = 1;
            return deferred.promise
        }

        // 上传图片到服务器
        function uploadPicture(imageURI) {
            var deferred = when.defer(),
                newDate = new Date(),
                options = new FileUploadOptions();
            var imgName = pictureSourceStatus === 1 ? imageURI.substring(imageURI.lastIndexOf("/") + 1) : newDate.getTime() + ".jpg";
            options.fileKey = "headpic";
            options.fileName = imgName;
            options.mimeType = "image/jpeg";
            var ft = new FileTransfer();

            // 上传回调
            ft.onprogress = showUploadingProgress;
            var url = localStorage.hostAddress + "index.php?c=api&m=upload_headpic";
            //alert(url);
            ft.upload(imageURI, encodeURI(url), function(r) {
                $("#pic").attr("src", imageURI);
                $('.wait_shadow').hide();
                addMaskLayout();
                deferred.resolve(imageURI);
                window.RuiDa.Alert.showAlert('上传成功', '', '提醒', '完成');
            }, null, options);
            return deferred.promise;
        }

        function showUploadingProgress() {
            //alert("上传中");
            $('.wait_shadow').show();

        }

        // 从缓存中删除图片
        function deletePictureFromCache(imageURI) {
            window.resolveLocalFileSystemURI(imageURI, function(fileEntry) {
                // alert("33");
                fileEntry.remove();
            }, null);
        }
    }

    function getRadioValue(name) {
        var radioes = document.getElementsByName(name);
        for (var i = 0; i < radioes.length; i++) {
            if (radioes[i].checked) {
                return radioes[i].value;
            }
        }
        return false;
    }

    function getData() {
        var url = localStorage.hostAddress + 'index.php?c=api&m=userinfo';
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'jsonp'
        }).done(function(datalist) {
            var headImg = datalist.headpic ? datalist.headpic : 'img/goods.jpg',
                areainfo = datalist.info.city;
            $('#pic').attr('src', RuiDa.Module.getPic(datalist.info.headpic, 'img/goods.jpg'));
            $('#nickname').val(datalist.info.nickname);
            $('#area').val(datalist.info.diqu);
            $('#sex').html(RuiDa.Module.getSex(datalist.info.sex));
            $('#qianming').val(datalist.info.qianming || '');
            if (areainfo) {
                $('.s_ShiFiled').empty().append('<a>' + areainfo.province + '</a><a>' + areainfo.city + '</a>');
                $('#sheng').attr('pid', 'pro_' + areainfo.provinceID).text(areainfo.province);
                $('#shi').attr('cid', 'pro_' + areainfo.cityID).text(areainfo.city);
            } else {
                $('.s_ShiFiled').empty().append('<a>未填</a><a>未填</a>');
            }
        }).fail(function() {
            console.log("error");
        });
    }

    return {
        photos: photos,
        start: start
    }
})();

window.PersonalData.photos();
window.PersonalData.start();

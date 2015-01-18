/*
    个人资料页面代码
*/
// sessionStorage.historyLength = sessionStorage.historyLength || -1;
window.PersonalData = (function() {

        function start() {
            // RuiDa.Module.backReloadHistory();
            RuiDa.Module.backHistory();
            getData();


            //iscroll 滚动

            //选择省
            var cityArr = ["北京", "上海", "天津", "重庆", " 河北省", "山西省", "黑龙江省", "吉林省", "辽宁省",
                           " 陕西省", "甘肃省", " 青海省", " 山东省", "河南省", "江苏省", "浙江省", "安徽省", " 江西省", 
                           "福建省", "台湾省", "湖北省", " 湖南省", "广东省", "海南省", "四川省", "云南省", " 贵州省", ]
            $('#sheng').focus(function(){
                //console.log("e333");   
                $(".s_xian").css({"display":"block"});
                //实现滚动
                //
                $("#city>li").click(function(){
                    $("#sheng").val($(this).html());
                    $(".s_xian").css({"display":"none"});
                });
            });
            $(".s_xian>p").click(function(){
                $(".s_xian").css({"display":"none"});
            });

            /*$('#shi').focus(function(){
                // alert("aa")
                console.log("e333");
                $(".s_xian").css({"display":"block"});
            });*/  


            /*=============*/
            $('.modify_btn').on('touchstart', function() {
                $(this).hide().next().show().next().show();
                $('input[type=text]').removeAttr('disabled');
                $('em').hide().next().show();
                var strqianming=$('#qianming').val();
                if(strqianming==='这家伙很懒，什么都没写'){
                    $('#qianming').val('');
                }
            });

            $('.cancel_btn').on('touchstart', function() {
                getData();
                $(this).hide().prev().hide().prev().show();
                $('input[type=text]').attr('disabled', 'disabled');
                $('em').show().next().hide();
            });


            $('.sure_btn').on('touchstart', function() {
                console.log('点击了确定');
                var nickname = $('#nickname').val(),
                    area = $('#area').val(),
                    sex = getRadioValue("sex"),                
                    qianming = $('#qianming').val();
                    
                console.log('数据',nickname,area,sex,qianming);
                if (!nickname) {
                    console.log('昵称不能为空');
                    window.RuiDa.Alert.showAlert('昵称不能为空', '', '成功', '返回');
                    return;
                }

                if (!area) {
                    console.log('居住地不能为空');
                    window.RuiDa.Alert.showAlert('居住地不能为空', '', '成功', '返回');
                    return;
                }

                if (!qianming) {
                    console.log('这家伙很懒，什么都没写');
                    qianming = '这家伙很懒，什么都没写';
                    //return;
                }

                $.ajax({
                    url: localStorage.hostAddress + 'index.php?c=api&m=update_nickname',
                    type: 'GET',
                    dataType: 'jsonp',
                    data: {
                        nickname: nickname,
                        diqu: area,
                        sex: sex,
                        qianming: qianming
                    }
                }).done(function(data) {
                    console.log(222222,data);
                    console.log('修改成功');
                    window.RuiDa.Alert.showAlert('修改成功', '', '成功', '返回');
                    getData();
                    $('.cancel_btn').hide().prev().hide().prev().show();
                    $('input[type=text]').attr('disabled', 'disabled');
                    $('em').show().next().hide();
                }).fail(function() {
                        console.log(11111,'修改失败');
                    window.RuiDa.Alert.showAlert('修改失败', '', '失败', '返回重试');
                });
            });

            $('#imgInput').on('change', function() {
                if ($('#imgInput').val() == 0) {
                    window.RuiDa.Alert.showAlert('请选择图片', '', '警告', '返回');
                    return;
                };

                $('.wait_shadow').show();

                $("#imgModify").ajaxSubmit({
                    url: localStorage.hostAddress + "index.php?c=api&m=upload_headpic",
                    success: function(data) {
                        if(data =="ok"){
                            getData();    
                            window.RuiDa.Alert.showAlert('上传成功', '', '成功', '返回');
                        }else{
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

        function photos(){

            $("#clearMaskLayout").click(function(){
                addMaskLayout();
            })
            $("#maskLayout").click(function(){
                addMaskLayout();
            })

            $("#pic").click(function(){
                removeMaskLayout();
                $("#alterHeadPortrait").removeClass("maskLayoutHidder");
            })


            function removeMaskLayout(){
                $("#maskLayout").removeClass("maskLayoutHidder");
                $("#clearMaskLayout").removeClass("maskLayoutHidder");
            }
            function addMaskLayout(){
                $("#maskLayout").addClass("maskLayoutHidder");
                $("#payList").addClass("maskLayoutHidder");
                $("#clearMaskLayout").addClass("maskLayoutHidder");
                $("#alterHeadPortrait").addClass("maskLayoutHidder");
            }
            

            var pictureSource;  //图片来源
            var destinationType; //返回的图片数据格式

            var pictureSourceStatus = 0; //0来自相册，1来自拍照
              
              
            document.addEventListener("deviceready",onDeviceReady,false);
              // 设备初始化之后调用
            function onDeviceReady() {
                pictureSource=navigator.camera.PictureSourceType;
                destinationType=navigator.camera.DestinationType;

                    //拍照
                $("#photograph").click(function(){

                    takePicture().then(uploadPicture).then(deletePictureFromCache);
                });  


                //从相册选择
               $("#PhotoSelect").click(function(){
                    //getPhoto(pictureSource.SAVEDPHOTOALBUM);
                    //addMaskLayout();
                    selectPhoto_Picture().then(uploadPicture).then(deletePictureFromCache);

                });

            }
         

            //相册选择上传
            function selectPhoto_Picture(){
                    var deferred  = when.defer(),
                    destinationType=navigator.camera.DestinationType,
                    options = {
                        quality: 100,
                        destinationType: destinationType.FILE_URI,
                        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                        //cameraDirection: Camera.Direction.FRONT,
                        targetWidth: 240,
                        targetHeight: 320,
                        correctOrientation: true
                    };
                
                    navigator.camera.getPicture(function(data){
                        deferred.resolve(data);
                    }, null, options);

                    pictureSourceStatus = 0;
                    
                    return deferred.promise
            }    
            // 打开摄像头拍照
            function takePicture() {
                var deferred  = when.defer(),
                    destinationType=navigator.camera.DestinationType,
                    options = {
                        quality: 100,
                        destinationType: destinationType.FILE_URI,
                        //sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                        //cameraDirection: Camera.Direction.FRONT,
                        targetWidth: 240,
                        targetHeight: 320,
                        correctOrientation: true
                };
                
                navigator.camera.getPicture(function(data){
                    deferred.resolve(data);
                }, null, options);
                
                pictureSourceStatus = 1;

                return deferred.promise
            }
            
            // 上传图片到服务器
            function uploadPicture( imageURI ){
                alert(imageURI);

                var deferred  = when.defer(),
                    newDate = new Date(),
                    options = new FileUploadOptions();

                    var imgName = pictureSourceStatus === 1 ?  imageURI.substring(imageURI.lastIndexOf("/")+1) : newDate.getTime()+".jpg";
                    options.fileKey = "headpic";
                    options.fileName = imgName;
                    options.mimeType = "image/jpeg";

                var ft = new FileTransfer();

                alert(imgName);

                // 上传回调
                ft.onprogress = showUploadingProgress;
                //alert("2");

                var url = localStorage.hostAddress + "index.php?c=api&m=upload_headpic";
                //alert(url);
                ft.upload( imageURI, encodeURI(url), function(r){ 

                    //alert(r);
                    $("#pic").attr("src",imageURI);
                    alert($("#pic").attr("src"));
                    /*
                    var response = r.response;
                    var result = JSON.parse(response);
                    
                    if(result.status === "001"){
                        alert("上传成功");
                        $("#userInfo_section_topHeadPortrait").attr("src",imageURI);
                    }else{
                        alert("上传失败，我要再试一次。");
                    }*/

                    // $("#uploadProgress").addClass("hiddenProgress");

                    deferred.resolve( imageURI );
                } , null, options);

                //alert("3");
                return deferred.promise;
            }

            function showUploadingProgress(){
                //alert("上传中");
            }
            

            
            // 从缓存中删除图片
            function deletePictureFromCache( imageURI ){
                window.resolveLocalFileSystemURI(imageURI, function( fileEntry ){
                    // alert("33");
                    fileEntry.remove();
                }, null);
            }
        }


        function getRadioValue(name){
            var radioes = document.getElementsByName(name);
                 for(var i=0;i<radioes.length;i++){
                      if(radioes[i].checked){
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
                var headImg = datalist.headpic ? datalist.headpic : 'img/goods.jpg';
                $('#pic').attr('src', RuiDa.Module.getPic(datalist.info.headpic,'img/goods.jpg'));
                $('#nickname').val(datalist.info.nickname);
                $('#area').val(datalist.info.diqu);
                $('#sex').html(RuiDa.Module.getSex(datalist.info.sex));
                $('#qianming').val(datalist.info.qianming || '');
            }).fail(function() {
                console.log("error");
            });
        }



    return {
        start: start,
        photos:photos
    }
})();
window.PersonalData.start();
window.PersonalData.photos();

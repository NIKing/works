

// 上传图片
function UploadImg(){
	this.picSum = 1;

	this.init();
	this.addEvent();
}

UploadImg.prototype={
	construction:UploadImg,
	init:function(){
		 RuiDa.Module.backHistory();
	},
	addEvent:function(){
		var _this = this;

		$("#complete").bind("touchend",function(){
			_this.upload();
		})

		$('#photoUpload').on('touchend', function() {
		    var imgLength = $('.photo_wrap > img').length;
		    $('.input_wrap input').eq(imgLength).click();
		});


		   $('.photo_wrap input').on('change', function() {
		   		// alert($(this).index()+"index");
		   		
		   			//因为个别手机（m2）不兼容base64位数据的方式，就采用 路径的方式显示照片。
		   			//var imgUrl = window.webkitURL.createObjectURL(this.files[0]); 
		   			//webkitURL.createObjectURL 创建路径

 					var	imgHtml = '<img src="' + window.webkitURL.createObjectURL(this.files[0]) + '" />';

 						//console.log(imgUrl);
 						
						$(".photo_wrap").append(imgHtml);

						_this.picSum ++;

						if(_this.picSum ==5){
					   		$('#photoUpload').css("display","none");
					  	}

		   		//_this.picEveryBinChange();
		   })



	},
	picEveryBinChange:function(){
			var _this = this;

			_this.startRead();
			_this.picSum ++;

			if(_this.picSum ==5){
		   		$('#photoUpload').css("display","none");
		  	}
	
	},
 	upload:function(){
		if(window.FormData){

			var formData = new FormData();

			this.picSum = this.picSum < 4 ? this.picSum : 4;

			for(var i=1;i<=this.picSum;i++){
				formData.append("pic"+i,document.getElementById("pic"+i).files[0]);
			}

			var name = $("#goodsname").val(),
				price = $("#price").val(),
				url = $("#url").val(),
				description = $("#description").val();

			if( this.picSum == 1 || !this.verifyIsNull(name) || !this.verifyIsNull(price) || !this.verifyIsNull(description)){
				window.RuiDa.Alert.showAlert('数据填写不完整', '', '提醒', '返回修改');
				return;
			}

			formData.append("name",name);
            formData.append("price",price);
            formData.append("url",url);
            formData.append("description",description);


			var xhr = new XMLHttpRequest();
				xhr.open("post",localStorage.hostAddress + 'index.php?c=api&m=tuijian_fabu2');

			//显示进度条
			$(".shadow").css("display","block");
			xhr.upload.onprogress = function(ev){
				if(ev.lengthComputable){
					var complete = (ev.loaded / ev.total *100 |0);
					//var progress = document.getElementById("uploadProgress");
					//progress.value = progress.innerHTML = complete;
				}
			}

			xhr.onload = function(){
				if(xhr.status === 200){
					// console.log("上传成功");
					$(".shadow").css("display","none");
					 window.RuiDa.Alert.showAlert('上传成功', '', '提醒', '完成');
					
				}else{
					console.log("上传失败");
				}
			}

			xhr.send(formData);
		}
	},
	startRead:function(){

		if(typeof FileReader != 'undefined'){
			var acceptedTypes = {
				'image/png' : true,
				'image/jpeg':true,
				'image/gif':true
			}
			var file = document.getElementById("pic"+this.picSum).files[0];
			if(file == undefined || file =="undefined") return;

			console.log(file);

			if(acceptedTypes[file.type] === true){
					var reader = new FileReader();

					reader.readAsDataURL(file);

					reader.onload = function(event){
						var image = new Image();
						image.src = event.target.result;
						image.width = 100;

						$(".photo_wrap").append(image);
					}


					reader.onprogress = this.updateProgress;
					// reader.readAsText(readFile,"UTF-16");	
			}
		}
	},
	updateProgress:function(evt) {
	  if (evt.lengthComputable) {
	    // evt.loaded and evt.total are ProgressEvent properties
	    var loaded = (evt.loaded / evt.total *100 | 0);
	    if (loaded < 1) {
	    	console.log(loaded);
	      // Increase the prog bar length
	      // style.width = (loaded * 200) + "px";
	    }
	  }
	},
	verifyIsNull:function(str){
		return str !=null && str != "" && str != "undefined";
	}
}

new UploadImg();
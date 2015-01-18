/*
	发布步奏一代码
*/
var searchList = []; //搜索的历史,保证商品描述是规范的

var issue_step1 = (function() {

	return {
		run: toRun
	};

	function toRun() {
		// 搜索
		$('#searchBtn').on('touchstart', function() {
			var searchContent = $('#searchContent').val();
			if (searchContent == '') {
				window.RuiDa.Alert.showAlert('内容不能为空', '', '警告', '返回');
				return;
			};

			$.ajax({
				url: localStorage.hostAddress + '/index.php?c=api&m=tuijian_fabu1',
				type: 'GET',
				dataType: 'jsonp',
				data: {
					key: searchContent
				}
			}).done(function(data) {
				$('.search_list ul').html('');
				for (var i = 0, len = data.list.length; i < len; i++) {
					$('.search_list ul').append('<li>' + data.list[i].name + '</li>');
					searchList.push(data.list[i].name);
				};
			}).fail(function() {
				console.log("error");
			});
		});

		//滚动
		RuiDa.Module.initIScroll();
		RuiDa.Module.backHistory();

		// 选择事件
		$('.search_list').on('touchstart', 'li', function(event) {
			var pageYStart = event.originalEvent.targetTouches[0].pageY;
			$(this).on('touchend', function(event) {
				var pageYEnd = event.originalEvent.changedTouches[0].pageY;
				if (Math.abs(pageYStart - pageYEnd) < 30) {
					$('#searchContent').val($(this).text());
					$('.search_list ul').html('');
				};
			});
		});

		//下一步
		$('#nextBtn').on('touchstart', function() {
			var selectContent = $('#searchContent').val();
			if (selectContent){
                sessionStorage.issueGoodsDescription = selectContent;
                window.location.href = 'issue_step2.html';
            }else{
                alert('请输入商品关键字');
            }
		});
	}
}());

issue_step1.run();
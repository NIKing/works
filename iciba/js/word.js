SZRD_JS.word = function () {

    var result = "incorrect",
        bAnswer = 0;
    var checkRadio = function () {
        var answer = $("input[name='word1']:checked").val();
        // console.log(answer);
        setWordPageStyle();
        if (result === answer) {
            //setWordPageStyleTrue();
            showSuccessResult();
            bAnswer = 1;
        } else {
            //setWordPageStyleFalse();
            showErrorResult();
            bAnswer = 0;
        }
    };
    // 设置单词页面的样式
    function setWordPageStyle() {
        $("#wordAnswerList").hide();
        $(".word-tips").hide();
        //$(".word-wrapQuestions").css({
        //    "height": "auto",
        //    "padding-bottom": '50px'
        //});
        //$('.word-questions').css({
        //    'min-height': '89px'
        //});

        //$('.question-iPhone-css')
        $('.new-question-wrap').addClass('new-add-question');
    }

    // 成功之后
    function showSuccessResult() {
        $(".word-result-img").attr("src", "img/word-success.png");
        $("#word-result-tips").css("color", "#339933").addClass("word-resultSuccess-tips").html("恭喜你，回答正确！");
        $("#word-resultError-tips").hide();
        $("#btnNext").css({
            "background": "url(img/next-true.png) no-repeat 0 0",
            "background-size": "100% 100%"
        });

        //setTimeout(function () {
        //    $(".word-result").show();
        //}, 200);
        $(".word-result").show();
    }

    //失败之后
    function showErrorResult() {

        $(".word-result-img").attr("src", "img/word-error.png");
        $("#word-resultError-tips").html("正确答案：" + result).show();
        $("#word-result-tips").css("color", "#ff3333").removeClass("word-resultSuccess-tips").html("%&gt;_&lt;%  不对呦～");

        $("#btnNext").css({
            "background": "url(img/next-false.png) no-repeat 0 0",
            "background-size": "100% 100%"
        });
        //setTimeout(function () {
        //    $(".word-result").show();
        //}, 200)
        $(".word-result").show();
    }

    var ENDEV = "ontouchstart" in window ? "touchend" : "mousedown";
    //ENDEV = "click"

    //单选选中
    $("#wordAnswerList").delegate("input[name='word1']", "click", function () {
        setTimeout(function () {
            checkRadio();
        }, 100)
    });

    //点击播放声音
    $(".word-questions").delegate("#wordQuestionsPaly", ENDEV, function () {
        // var audio = new Audio();
        // audio.src = $(this).data('src');
        // audio.play();
        var _this = $(this);
        window.player.play(_this.data('src'));

        // $('video')[0].play();
        // $('video')[0].addEventListener('ended', function () {
        //     this.removeEventListener('ended', arguments.callee, false);
        //     $('video').remove();
        //     $('body').append('<video src ="' + _this.data('src') + '" />');
        // }, false);
    });

    var bCurrentTest = 0; //当前题目有没有做过？0：未做过，1：做过
    //下步
    $('#btnNext').bind(ENDEV, function () {

        var currentQuestionSumInt = operateQuestionSum(1);
        //到连线题
        if (currentQuestionSumInt >= resultList.length) {
            //加分
            calcuScore(currentQuestionSumInt);
            
            //开始连线的题目
            SZRD_JS.online();
            // window.location.href="online.html";
            $("#wrap-word").hide();
            $("#wrap-onlien").show();

        } else {  //当前关卡是第几题
            //加分
            calcuScore(currentQuestionSumInt);
            //显示分
            getScore();
            //显示下一题
            showQuestionToUI(currentQuestionSumInt);
        }
    })

    function operateQuestionSum(type) {

        var currentQuestionSum = TempCache.getItem('currentQuestionSum') || 0,
            currentQuestionSumInt = parseInt(currentQuestionSum),
            currentQuestionSumInt = type == 1 ? currentQuestionSumInt + 1 : currentQuestionSumInt - 1;
        TempCache.setItem('currentQuestionSum',currentQuestionSumInt);

        return currentQuestionSumInt;
    }

    //$("#wordAnswerList").delegate("li label",ENDEV,checkRadio);

    var resultList = [];
    //获取问题信息
    function getQuestionsData() {

        var userInfo = TempCache.getItem("userBaseInfoForKingSoft");
        if (!userInfo) return;

        var differ = TempCache.getItem('date_no') || SZRD_JS.Util().calcuDateDiffer();

        var ajaxConfig = {
            type: 'POST',
            url: BaseUrl + "getexam2.php",
            data: {
                cc: userInfo.cc,
                user_id: userInfo.user_id,
                cet: userInfo.cet,
                date_no: differ,
                type: 1
            },
            success: function (data) {
                if (!data) return;
                data = JSON.parse(data);
                if (data.status == 0) {

                    resultList = JSON.parse(data.result);
                    // console.log(resultList[0].exams);
                    // var userScore = TempCache.getItem("scoreForKingSoft"),
                    // userLevel = parseInt(userScore.level);

                    showQuestionToUI(TempCache.getItem('currentQuestionSum') || 0);

                    var resultLng = resultList.length;
                    $(".word-title").empty().html("共" + resultLng + "题   " + resultLng * 2 + "分");
                    getScore();
                } else {
                    console.log(data.msg);
                }
            }
        };

        $.ajax(ajaxConfig);
    }

    //根据问题索引,显示问题数据到界面
    function showQuestionToUI(index) {
        if (!resultList.length && index < 0) return;
        var resultObj = resultList[index],
            questionHtml = "";

        if (!resultObj || resultObj == undefined) return;

        if (resultObj.type == 1) { //选择题
            questionHtml = (parseInt(index) + 1) + ". " + resultObj.exam;
        } else {
            questionHtml = (parseInt(index) + 1) + '. 点击发音按钮选择正确单词：<span id="wordQuestionsPaly" data-src=' + MP3Url + resultObj.voice + ' class="word-questions-paly"></span>';
        }

        var item = resultObj.item,
            id = 1,
            html = "";
        for (var key in item) {

            var value = item[key];
            html += "<li>";
            html += '<input  type="radio" name="word1" value="' + value + '"  id="answer' + id + '" /> <label for="answer' + id + '"> ' + value + '</label>';
            html += '</li>';

            if (resultObj.answer == key) result = value;
            id++;
        }

        $(".word-result").hide();
        // $(".word-tips").show();
        //$(".word-wrapQuestions").css({
        //    "height": "48%",
        //    "padding-bottom": "0px"
        //});
        $(".word-questions").empty().append(questionHtml);
        $("#wordAnswerList").show().empty().append(html);

        $('.new-question-wrap').removeClass('new-add-question');

        if(resultObj.type != 1){
            window.player.init($('audio')[0])
            window.player.play(MP3Url + resultObj.voice);
        }

        // $('video').remove();
        // $('body').append('<video autoplay="true" src="' + MP3Url + resultObj.voice + '" />');

    }



    function getScore() {

        var userScore = TempCache.getItem("scoreForKingSoft");
        $("#gamePlan").empty().html("已收获" + userScore.score + "分");
    }

    function setScoreForKingSoft() {
        var userScore = TempCache.getItem("scoreForKingSoft");
        userScore.option = 2;
        userScore.level = 0;
        TempCache.setItem("scoreForKingSoft", userScore);
    }

    function calcuScore(curLevel) {

        //这个存放到apple.html页面去
        // var scoreConfig = {
        //     option : 1,  //选项
        //     level : 1,    //关卡
        //     score : 0
        // }

        //当前选项为1，并且记录关卡小于当前关卡

        var userScore = TempCache.getItem("scoreForKingSoft");
        // if(userScore.option == 1 && userScore.level < curLevel){

        //     userScore.level += 1;
        //     if(bAnswer == 1){ userScore.score += 2;}

        //     TempCache.setItem("scoreForKingSoft",userScore);
        // }

        if (bAnswer === 1) {
            userScore.score += 2;
        }
        TempCache.setItem("scoreForKingSoft", userScore);
    }

    getQuestionsData();
    if (TempCache.getItem('myHistory')){
        $('#gamePlan').hide();
    }
};

$(function () {
    var questionNr = TempCache.getItem('currentQuestionSum') || 0;
    if (questionNr >= 0 && questionNr < 10) {
        SZRD_JS.word();
    } else {
        SZRD_JS.online();
        $("#wrap-word").hide();
        $("#wrap-onlien").show();
    }
});
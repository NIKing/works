SZRD_JS.online = function () {
    var hasTouch = "ontouchstart" in window,
        ENDEV = hasTouch ? "touchend" : "mousedown",
        MOVESTART = hasTouch ? "touchstart" : "mouseup",

        bStart = 0, //开始画线
        bEnd = 0,
        x1 = 0,
        y1 = 0,
        x2 = 0,
        y2 = 0;

    var oneAnswer = [],	//存储用户每组联系的答案
        answerSum = []; //用于存储用户选择的答案的数组，识别释义是否被选中

    $(".online-word").delegate("li span", MOVESTART, function (e) {

        var index = $(this).data("index");

        //再次点击取消,已经被点击选中，并且选择答案中没有自己，并且上次选择的还是自己的时候
        if (bStart === 1 && !bSelect(1, index) && oneAnswer[0] == index) {  //已选中

            $(this).css("color", "#663300");

            bStart = 0;
            oneAnswer = [];

        } else if (bStart === 0 && bSelect(1, index)) {  //当前开始画线，并且已经画过的可以删除线条

            removeLine(1, index);
            clearFontColorAddAnswer(1, index);

        } else if (bStart == 0 && !bSelect(1, index) && oneAnswer) {

            $(this).css("color", "#ff9900");

            var currentClickPoi = getCurrentClickPoint(e, 0);
            x1 = currentClickPoi.x;
            y1 = currentClickPoi.y;

            bStart = 1;
            oneAnswer.push(index);
        }
    });

    $(".online-wordNote").delegate("li span", ENDEV, function (e) {
        //简单的判读，如果已经着色了，就代表已经选中
        var index = $(this).data('index');
        if (bStart === 1 && !bSelect(2, index)) {
            $(this).css("color", "#ff9900");

            var currentClickPoi = getCurrentClickPoint(e, 1);
            x2 = currentClickPoi.x;
            y2 = currentClickPoi.y;
            // console.log(x2 +","+y2);

            oneAnswer.push(index);
            // console.log(oneAnswer);

            answerSum.push(oneAnswer); //把每组的结果存到结果数组中形成二维数组
            // console.log(answerSum);

            //直接计算结果
            //把链接的答案组合成线条的ID
            var lineId = "line" + index;
            var line = new Line(x1, y1, x2, y2, lineId);
            $("#wrap-onlien").append(line.div);
            console.log("线条ID" + lineId + "结果集合" + answerSum);
            oneAnswer = [];
            bStart = 0;
        } else if (bStart === 0 && bSelect(2, index)) {	//如果已经画过，就要取消画线
            removeLine(2, index);
            clearFontColorAddAnswer(2, index);
            bStart = 0;
        }
        if (answerSum.length >= 5) {
            //$("#btnNext").css({"background":"url(img/next-true.png) 0 0 no-repeat","background-size":"100% 100%"});
            // console.log(answerSum);
        }
    });

    var btnNextStatus = 0; //当前按钮的状态，为0表示提交，1表示下一题
    //提交
    $("#wrap-onlien").delegate("#btnNext", ENDEV, function () {
        if (answerSum.length < 5) return;

        if (btnNextStatus === 0) {	//提交
            // window.location.href="perform.html";
            updateBtnBG(btnNextStatus);
            calcuResultAndShow();
            // $(".online-result").fadeIn("slow");

            $(".online-tips").hide();
            btnNextStatus = 1;

            var currentQuestionSum = TempCache.getItem('currentQuestionSum') || 0,
                currentQuestionSumInt = parseInt(currentQuestionSum),
                currentQuestionSumInt = currentQuestionSumInt + 1;
            TempCache.setItem('currentQuestionSum',currentQuestionSumInt);

            // var userScore = TempCache.getItem("scoreForKingSoft"),
            //     userLevel = parseInt(userScore.level);
            // var level = userLevel + 1;

            calcuScore(currentQuestionSumInt);
            getScore();
        } else {		//下一题
            var currentQuestionSum = TempCache.getItem('currentQuestionSum');
            if (currentQuestionSum >= 12) {
                postRecordScore();
            } else {
                updateBtnBG(btnNextStatus);

                $(".online-result").hide();
                // $(this).css("background-color","#999999").html("提 交");
                // $(".online-tips").show();

                removeAllLine();
                answerSum = [];
                btnNextStatus = 0;
                cureentScore = 0; //上一题的结果清零

                var group = resultList.slice(5, 10);
                showQuestionToUIByResult(group);

                resultList = [];
            }
        }
    });

    //提交结果
    function postRecordScore() {

        var userInfo = TempCache.getItem("userBaseInfoForKingSoft"),
            userScore = TempCache.getItem("scoreForKingSoft");
        if (!userInfo) return;

        var differ = TempCache.getItem('date_no') || SZRD_JS.Util().calcuDateDiffer();
        var ajaxConfig = {
            type: 'POST',
            url: BaseUrl + "recordscore.php",
            data: {
                cc: userInfo.cc,
                user_id: userInfo.user_id,
                score: userScore.score,
                date_no: differ
            },
            success: function (data) {
                if (!data) return;
                data = JSON.parse(data);
                if(data.status == "99"){
                    SZRD_JS.alert(data.msg);
                }else{
                    TempCache.setItem('onlineView','1');
                    TempCache.removeItem('appleOver');
                    window.location.href = "perform.html";
                }
            }
        };

        $.ajax(ajaxConfig);
    }

    var cureentScore = 0;  //当前连线题的分数，根据计算结果得出
    //计算出结果
    function calcuResultAndShow() {
        if (!answerSum.length)return;
        var wordList = $("#onlineWord li span");
        var resultHtml = "";
        for (var j = 0; j < wordList.length; j++) {
            //当前元素的id，根据这个来进行答案排序
            var currentElID = $(wordList[j]).data("index");

            for (var i = 0, len = answerSum.length; i < len; i++) {
                //获取当前单词编号，就是二维数组中每个数组的第一个
                var wordId = answerSum[i][0],
                    wordNote = answerSum[i][1],
                    img = "img/perform_calendar_success.png";

                if (wordId == currentElID) {
                    if (wordId === wordNote) {
                        img = "img/perform_calendar_success.png";
                        cureentScore += 2;
                    } else {
                        img = "img/perform_calendar_fail.png";
                    }
                    resultHtml += "<li><img src=" + img + "></li>";
                }
            }
        }
        $("#onlineResult").empty().append(resultHtml).fadeIn("slow");
    }

    //跟新按钮样式
    function updateBtnBG(type) {
        if (type < 0)return;

        var cssText = {
             "background": type == 0 ? "url(img/next-true.png) 0 0 no-repeat" : "url(img/submit.png) 0 0 no-repeat",
               
            "background-size": "100% 100%"
        }
        $(".online-result-btnNext").css(cssText);

    }

    //是否已被选中
    function bSelect(type, index) {
        if (index < 0) return;

        var result = false;
        for (var i = 0, len = answerSum.length; i < len; i++) {
            // var answer =;
            if (type === 1) {	// 是单词
                if (answerSum[i][0] === index) {
                    result = true;
                    break;
                }
            } else {	//
                if (answerSum[i][1] === index) {
                    result = true;
                    break;
                }
            }
        }

        return result;
    }

    //获取问题信息
    var resultList = [];

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
                type: 2
            },
            success: function (data) {
                if (!data) return;
                data = JSON.parse(data);
                if (data.status == 0) {

                    getScore();
                    resultList = JSON.parse(data.result);

                    //分裂
                    var questionNr = TempCache.getItem('currentQuestionSum');
                    var group = resultList.slice(0, 5);
                    if (questionNr >= 11) {
                        group = resultList.slice(5, 10);
                    }
                    showQuestionToUIByResult(group);
                }
            }
        };
        $.ajax(ajaxConfig);
    }

    function showQuestionToUIByResult(resultList) {
        if (!resultList.length) return;
        var wordHtml = [],
            wordNoteHtml = [];

        for (var i = 0, len = resultList.length; i < len; i++) {
            var result = resultList[i];
            var index = (i + 1);
            wordHtml.push('<li><span id="wordId_' + index + '" data-index="' + index + '">' + result.word + '</span></li>');

            wordNoteHtml.push('<li><span id="wordNoteId_' + index + '" data-index="' + index + '">' + result.meaning + '</span></li>');
        }

        wordHtml.sort(function () {
            return 0.5 - Math.random()
        });
        wordNoteHtml.sort(function () {
            return 0.5 - Math.random()
        });

        $("#onlineWord").empty().append(wordHtml.join(''));
        $("#onlineWordNote").empty().append(wordNoteHtml.join(''));
    }

    //清除所有线条
    function removeAllLine() {
        $(".lineOnly").remove();
        $("#onlineWord li span").css("color", "#663300");
        $("#onlineWordNote li span").css("color", "#663300");
    }

    //type : 单词为 1 ； 释义为：2
    //id : 单词或则释义的id
    function removeLine(type, id) {

        if (id < 0)return;
        if (type === 1) {
            //根据单词的ID找到释义的ID
            for (var i = 0, len = answerSum.length; i < len; i++) {
                if (answerSum[i][0] == id) {
                    id = answerSum[i][1];
                    break;
                }
            }
        }
        //因为线条和释义绑定在一起来
        $("#line" + id).remove();

    }

    //目前根据释义来取消画线和选择状态
    //type : 单词为 1 ； 释义为：2
    //id : 单词或则释义的id
    function clearFontColorAddAnswer(type, id) {
        if (id < 0) return;
        for (var i = 0, len = answerSum.length; i < len; i++) {

            // console.log(answerSum[i][1])
            //根据释义的ID来找到单词的ID
            if (type === 1) {
                if (answerSum[i][0] == id) {
                    var wordNoteId = answerSum[i][1];
                    $("#wordId_" + id).css("color", "#663300");
                    $("#wordNoteId_" + wordNoteId).css("color", "#663300");

                    answerSum.splice(i, 1);
                    break;
                }
            } else {

                if (answerSum[i][1] == id) {
                    var wordId = answerSum[i][0];
                    $("#wordId_" + wordId).css("color", "#663300");
                    $("#wordNoteId_" + id).css("color", "#663300");

                    answerSum.splice(i, 1);
                    break;
                }
            }
        }
    }

    function getScore() {
        var userScore = TempCache.getItem("scoreForKingSoft");
        $("#gamePlan").empty().html("已收获" + userScore.score + "分");
    }

    function calcuScore(curLevel) {

        //当前选项为1，并且记录关卡小于当前关卡
        var userScore = TempCache.getItem("scoreForKingSoft");
        // if(userScore.option == 2 && userScore.level < curLevel && curLevel <= 2){

        //     userScore.level += 1;
        //     userScore.score += cureentScore;

        //     TempCache.setItem("scoreForKingSoft",userScore);
        // }
        userScore.score += cureentScore;
        TempCache.setItem("scoreForKingSoft", userScore);
    }

    //获取当前点击的位置，用于画线使用
    function getCurrentClickPoint(e, elType) {
        // var wrapPoi = $(".online-wrapQuestions").position(), //发现这个不可用
        //document.body.clientHeight * 0.27,
        //top: 267.6px;
        //left: 55.36px

        var wrapTop = $(".online-wrapQuestions").position().top,
            wrapLeft = document.body.clientWidth * 0.03,
            currentEl = e.target,
            top = currentEl.offsetTop,
            left = currentEl.offsetLeft,
            width = currentEl.offsetWidth,
            height = currentEl.offsetHeight;
        // console.log(wrapTop)
        // console.log("wraptop"+wrapTop+".left="+left+",ss"+width);
        return {
            x: wrapLeft + left + ( elType === 0 ? width : 0 ),
            y: wrapTop + top + (height / 2)
        }
    }

    //画线的对象，根据两点的位置计算
    function Line(x1, y1, x2, y2, id) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.id = id;

        this.init();
        this.draw();
    }

    Line.prototype = {
        constructor: Line,
        init: function () {

            var div = this.div = document.createElement("div");
            div.className = "lineOnly";
            div.id = this.id;
            this.div.style.cssText = "height:1px;background-color:#ff9900;position:absolute;";

            // return div;
        },
        draw: function () {

            var slope = Math.atan2(this.y2 - this.y1, this.x2 - this.x1), //斜率
                angle = 180 * slope / Math.PI;	//转为角度
            // console.log(slope);

            var x = Math.abs(this.x2 - this.x1),
                y = Math.abs(this.y2 - this.y1),
                lineWidth = Math.sqrt((x * x) + (y * y));
            // console.log(lineWidth);

            // this.div.style.height = lineWidth + "px";
            this.div.style.width = lineWidth + "px";
            this.div.style.left = this.x1 + "px";
            this.div.style.top = this.y1 + "px";

            this.div.style['webkitTransform'] = "rotate(" + angle + "deg)";
            this.div.style['webkitTransformOrigin'] = "0px 0px";

            return this.div;
        }
    };

    getQuestionsData();
};
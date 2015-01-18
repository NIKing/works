//消息提醒
$(document).ready(function() {
    tixing();
    setInterval(function() {
        tixing();
    }, 5000);
});

//消息提醒
function tixing() {
    $.ajax({
        url: localStorage.hostAddress + 'index.php?c=api&m=newscount',
        type: 'GET',
        dataType: 'jsonp'
    }).done(function(data) {
        $(".message_num").html(data.count);
        $("#f_newscount").html(data.count);
        if (data.count > localStorage.f_news) {
            var audio = new Audio('wav/news.mp3');
            audio.play();
            localStorage.f_news = data.count;
        }
    }).fail(function() {
        console.log("error");
    });
}
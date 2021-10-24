var scheme   = 'ws://';
if((new URL(window.location.href).protocol) == 'https:'){
  scheme = 'wss://';
}
var uri = scheme + window.document.location.host + "/";
var ws  = new WebSocket(uri);

ws.onmessage = function(message) {
  var data = JSON.parse(message.data);

  console.log(data);

  if(data['body']){
    $("#now-question").html(
      '<p>' + data['body'] + '</p><p>' + data['choices'].join('<br>') + '</p>'
    );
    $("#now-answer").html('...');
    $("#your-answer").html('...');

    var answer_html = '';
    for(i=0;i<data['choices'].length;i++){
      answer_html += '<option value=' + i + '>' + data['choices'][i] + '</option>';
    }
    $("#answer").html(answer_html)
  }
  else if(data['answer']){
    $("#now-answer").html(
      '<p>' + data['answer'] + '</p>'
    );
    // 解答欄を消す
    $("#answer").html('...');
  }

  //$("#chat-text").stop().animate({
  //  scrollTop: $('#chat-text')[0].scrollHeight
  //}, 800);
};

$("#answer-form").on("submit", function(event) {
  event.preventDefault();
  var handle = $("#input-handle").val();
  var answer = $("#answer").val();
  var answer_text = $("#answer option[value="+answer+"]").text();

  // 回答がセットされてたら送信
  if(answer_text != ''){
    $('#your-answer').text(answer_text);
    var data = { handle: handle, answer: answer };
    console.log(data);
    ws.send(JSON.stringify(data));
  }
});

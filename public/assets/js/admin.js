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
  }
  else if(data['answer']){
    $("#now-answer").html(
      '<p>' + data['answer'] + '</p>'
    );
  }
};

$("#questions").on("submit", function(event) {
  event.preventDefault();

  var qid     = $('#ready-go').val();
  var body    = $('#'+qid+' .body').text()
  var choices = $('#'+qid+' .choices').text().split('/');

  var data = {
    from: 'ADMIN',
    kind: 'question',
    qid: qid,
    body: body,
    choices: choices,
  };
  console.log(data);

  ws.send(JSON.stringify(data));
});

$("#answers").on("submit", function(event) {
  event.preventDefault();

  var qid = $('#answers .answer').val();
  var answer = $('#'+qid+' .answer').text()

  var data = {
    from: 'ADMIN',
    kind: 'answer',
    qid: qid,
    answer: answer,
  };
  console.log(data);

  ws.send(JSON.stringify(data));
});

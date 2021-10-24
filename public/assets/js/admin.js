var scheme   = 'ws://';
if((new URL(window.location.href).protocol) == 'https:'){
  scheme = 'wss://';
}
var uri      = scheme + window.document.location.host + "/";
var ws       = new WebSocket(uri);

ws.onmessage = function(message) {
  var data = JSON.parse(message.data);
  $("#chat-text").append("<div class='card'><div class='card-header'>" + data.handle + "</div><div class='card-body'>" + data.text + "</div></div>");
  $("#chat-text").stop().animate({
    scrollTop: $('#chat-text')[0].scrollHeight
  }, 800);
};

$("#input-form").on("submit", function(event) {
  event.preventDefault();
  var handle = $("#input-handle")[0].value;
  var qid    = $("#input-qid")[0].value;
  var text   = $("#input-text")[0].value;
  ws.send(JSON.stringify({ handle: handle, qid: qid, text: text }));

  //$("#input-text")[0].value = "";
});

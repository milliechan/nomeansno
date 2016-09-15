function printMessage(message) {
  $('#messages').append(message + "<br>");
}

$(function() {$( document ).ready(function() {
  botActivate();

    var chatChannel;
    var username;
 
    function setupChannel() {
        chatChannel.join().then(function(channel) {
            printMessage(username + ' joined the chat.');
        });
 
        chatChannel.on('messageAdded', function(message) {
            printMessage(message.author + ": " + message.body);
         });
    }
 
    var $input = $('#chat-input'); 
    $input.on('keydown', function(e) {
        if (e.keyCode == 13) {
            chatChannel.sendMessage($input.val())
            $input.val('');
        } 
     });


   $.post("/tokens", function(data) {
      username = data.username;
      var accessManager = new Twilio.AccessManager(data.token);
      var messagingClient = new Twilio.IPMessaging.Client(accessManager);
   
      messagingClient.getChannelByUniqueName('chat').then(function(channel) {
          if (channel) {
              chatChannel = channel;
              setupChannel();
          } else {
              messagingClient.createChannel({
                  uniqueName: 'chat',
                  friendlyName: 'Chat Channel' })
              .then(function(channel) {
                  chatChannel = channel;
                  setupChannel();
              });
          }
      });
    });
 });
});

var goToNextResponse = false 

var botActivate = function() {
  $("no-button").on("click", function(event) {
    event.preventDefault();
    goToNextResponse = true 
    for(var i=0; i < botResponses.length; i++) {
      if(goToNextResponse == true){
        printMessage(botResponses.shift());
        goToNextResponse = false
        break; 
      }
    }
  })
};

var botResponses = [ 
                    "No means no.",
                    "Speaking like this is a form of harassment.", 
                    "The words you are using are inappropriate.",
                    "Sending frequent or lengthy texts is abusive ", 
                    "<a href='https://www.buzzfeed.com/juliapugachevsky/this-video-reminds-you-that-relationship-abuse-isnt-always-o?utm_term=.csRGabr7d#.gjOj5Aq6J'>https://www.buzzfeed.com/juliapugachevsky/this-video-reminds-you-that-relationship-abuse-isnt-always-o?utm_term=.csRGabr7d#.gjOj5Aq6J</a>"
                    ]




var name = getQueryVariable('name') || 'Anonymous';
var room = getQueryVariable('room');

var socket = io();

console.log(name + ' joined ' + room + '!');

jQuery('.room-title').text(room);

socket.on('connect', function(){
    console.log('Connected to socket.io server!');

    socket.emit('joinRoom', {
        name: name,
        room: room
    });
});

socket.on('message', function(message){
    var momentTimestamp = moment.utc(message.timestamp);
    var $messages = jQuery('.messages');
    var $message = jQuery('<li class="list-group-item"></li>');

    console.log(message.timestamp);
    console.log('New message:');
    console.log(message.text);

    $message.append('<p><strong>' + message.name + ' ' + momentTimestamp.local().format('hh:mm a') + '</strong></p>');
    $message.append('<p>' + message.text + '</p>');
    $messages.append($message);
});

// Handles submitting of new message
var $form = jQuery('#message-form');

$form.on('submit', function(event){
    event.preventDefault();

    var $message = $form.find('input[name=message]');

    if ($message.val() !== "") {
        $('#alert-message').html('');

        socket.emit('message', {
            name: name,
            text: $message.val(),
            timestamp: moment().valueOf()
        });
        $message.val('');
    } else {
        $('#alert-message').html('<div class="alert alert-danger fade in">Please write a message before sending.</div>');
    }


});

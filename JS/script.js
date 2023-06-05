var channelID = 'TcgviKq5jRDEIYF1';
var drone = new Scaledrone(channelID);
var chatContainer = document.querySelector('.chat-container');
var activeUsers = {};

function generateRandomName() {
  var adjectives = ['Sunny', 'Silky', 'Shiny', 'Colorful', 'Sparkling', 'Melodic', 'Cheerful', 'Fluffy', 'Precious', 'Magnificent', 'Magical', 'Crystal', 'Unusual', 'Giant', 'Fragrant', 'Harmonious', 'Elegant', 'Airy', 'Brilliant', 'Radiant', 'Gentle', 'Surprising', 'Subtle', 'Lively', 'Creative'];
  var nouns = ['Waterfall', 'Universe', 'Snowflake', 'Love', 'Wizard', 'Spring', 'Harp', 'Star', 'Whirlpool', 'Power', 'Can', 'Marble', 'Moth', 'Button', 'Sword', 'Seagull', 'Fragrance', 'Sunny', 'Painting', 'Forest', 'Shadow', 'Pearl', 'Dragonfly', 'Volcano', 'Sunset'];
  var adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  var noun = nouns[Math.floor(Math.random() * nouns.length)];
  return `${adjective} ${noun}`;
}

function generateRandomColor() {
  var colors = ['#336699', '#33CC99', '#3366CC', '#6699CC', '#993366', '#996633', '#999933', '#CCCC99', '#CCCCCC', '#99CC00', '#FF9900', '#FF6600', '#FF3300', '#FF3366', '#CC0033', '#CC3366', '#CC6699', '#CC99CC', '#9999CC', '#666699', '#333366', '#336633', '#669966', '#99CC99', '#CCFF00', '#FFFF66', '#FFCC66', '#FF9900', '#FF6600', '#FF6666'];
  return colors[Math.floor(Math.random() * colors.length)];
}

function createChatBox(user) {
  var chatBox = document.createElement('div');
  chatBox.id = `chat-box-${user.name}`;
  chatBox.className = 'chat-box';

  var chatBoxContent = `
    <div class="chat-box-child">
      <div id="message-container-${user.name}" class="message-container"></div>
      <div class="form">
        <div class="form-inside">
          <input id="input-${user.name}" class="input" type="text" placeholder="Type your message" />
          <button id="send-${user.name}" class="btn">Send</button>
        </div>
      </div>
    </div>
  `;
  chatBox.innerHTML = chatBoxContent;

  chatContainer.appendChild(chatBox);
}

function displayMessage(container, sender, content, color, isCurrentUser) {
  var message = document.createElement('div');
  message.classList.add('message');
  message.classList.add(isCurrentUser ? 'message-user1' : 'message-user2');

  var senderDiv = document.createElement('div');
  senderDiv.classList.add('sender-container');

  var senderSpan = document.createElement('span');
  senderSpan.classList.add('sender');
  senderSpan.textContent = sender + ': ';

  senderDiv.appendChild(senderSpan);
  message.appendChild(senderDiv);

  var messageContent = document.createElement('div');
  messageContent.classList.add('message-content');
  messageContent.style.backgroundColor = color;
  messageContent.textContent = content;

  message.appendChild(messageContent);
  container.appendChild(message);
  container.scrollTop = container.scrollHeight;
}

drone.on('open', function(error) {
  if (error) {
    return console.error(error);
  }
  console.log('Successfully connected to Scaledrone');

  var room = drone.subscribe('general');

  room.on('open', function() {
    console.log('Connected to the general room');
  });

  room.on('message', function(message) {
    var { user, content } = message.data;
    for (var userName in activeUsers) {
      var currentUser = activeUsers[userName];
      var isCurrentUser = userName === user.name;
      displayMessage(currentUser.container, user.name, content, user.color, isCurrentUser);
    }
  });
});

drone.on('close', function(event) {
  console.log('Connection closed', event);
});

drone.on('error', function(error) {
  console.error('Error in Scaledrone', error);
});

function sendMessage(user, message) {
  drone.publish({
    room: 'general',
    message: {
      user: user,
      content: message,
    },
  });
}

function addUser() {
  var user = {
    name: generateRandomName(),
    color: generateRandomColor(),
    container: null,
  };
  activeUsers[user.name] = user;

  createChatBox(user);
  user.container = document.getElementById(`message-container-${user.name}`);

  var input = document.getElementById(`input-${user.name}`);
  var sendButton = document.getElementById(`send-${user.name}`);

  function handleMessageSend() {
    var message = input.value;
    if (message.trim() !== '') {
      sendMessage(user, message);
      input.value = '';
    }
  }

  sendButton.addEventListener('click', handleMessageSend);

  input.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
      handleMessageSend();
    }
  });

  console.log(`User ${user.name} joined the chat`);
}

addUser();

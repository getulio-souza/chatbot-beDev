class ChatBox {
  constructor(){
    this.args = {
      openButton: document.querySelector('.chatbox__button'),
      chatBox: document.querySelector('.chatbox__support'),
      sendButton: document.querySelector('.send__button')
    }

    this.state = false;
    this.messages = []
  }

  //display the messages on chatbot

  display() {
    const { openButton, chatBox, sendButton } = this.args;

    openButton.addEventListener('click', () => this.toggleState(chatBox))
    sendButton.addEventListener('click', () => this.onSendButton(chatBox))
    
    const node = chatBox.querySelector('input');
    node.addEventListener('keyup', ({ key }) => {
      if (key === 'Enter') {
        this.onSendButton(chatBox)
      }
    })

  }

  //implements the tooogle state

  toggleState(chatbox) {
    this.state = !this.state;

    //show or hides the box
    if (this.state) {
      chatbox.classlist.add('chatbox--active')
    } else {
      chatbox.classlist.remove('chatbox--active')
    }
  } 

  //implements the send button functionality
  onSendButton(chatbox) {
    var textField = chatbox.querySelector('input');
    let text1 = textField.value
    if (text1 === "") {
      return;
    }

    let msg1 = { name: "User", message: text1 }
    this.messages.push(msg1);

    fetch($SCRIPT_ROOT + '/predict', {
      method: 'POST',
      body: JSON.stringify({ message: text1 }),
      mode: 'cors',
      headers: {
        'Content-type': 'application/json'
      },
    })
      .then(response => response.json())
      .then(response => {
        let msg2 = { name: 'John', message: response.answer };
        this.messages.push(msg2);
        this.updateChatText(chatbox)
      })
      .catch((error) => {
        console.log('Error', error);
        this.updateChatText(chatbox)
        textField.value = ''
      });
  }

  //update function
  updateChatText(chatbox) {
    var html = '';
    this.messages.slice().reverse().forEach(function (item,) {
      if (item.name === "Sam") {
        html += '<div class="messages__item messages__item--visitor">' + item.message + '</div>'
      } else {
        html += '<div class="messages__item messages__item--operator">' + item.message + '</div>'
      }
    });

    const chatMessage = chatbox.querySelector('.chatbox__messages')
    chatMessage.innerHTML = html;
  }
}

const chatbox = new ChatBox();
chatbox.display()
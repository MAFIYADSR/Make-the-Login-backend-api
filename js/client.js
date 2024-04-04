const socket = io('http://localhost:3000');

const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector(".container");

function parseJwt(token) {         //This is the code to decode token in frontend
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}


const append = (message, position) => {
    try{
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);

   
}
    catch(err)
    {
        console.log(err)
    }
}

form.addEventListener('submit', (e) => {
    try{
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageInput.value = '';
    }
    catch(err)
    {
        console.log(err);
    }
})

const token = localStorage.getItem('token')
// console.log(token);
const decodedToken = parseJwt(token);
// console.log(decodedToken);

const name = decodedToken.name;
// console.log(name);



socket.emit('new-user-joined', name);

socket.on('user joined', name => {
    append(`${name} joined the chat`, 'left')
})

socket.on('receive', data => {
    append(`${data.name}: ${data.message}`, 'left')
})

socket.on('left', name => {
    append(`${name}: left the chat`, 'left')
})


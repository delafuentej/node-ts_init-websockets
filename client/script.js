let socket = null;

const form = document.querySelector('form');
const input = document.querySelector('input');
const messagesElUl = document.querySelector('#messages');
const statusEl = document.querySelector('span');

function sendMessage(message){
    if(message.length <= 0) return;
    socket?.send(message);
};

function renderMessage(message){
    if(!messagesElUl) return;
    const li = document.createElement('li');
    li.textContent= message;
    messagesElUl.append(li);
};

form.addEventListener('submit', (event)=>{
    event.preventDefault();
    const message = input.value;
    sendMessage(message);
    input.value= null;
});

function connetToWebSocketServer(){
    
    socket = new WebSocket("ws://localhost:3000");
    
    //console.log(socket)
    

    socket.onopen= (event) =>{
        statusEl.innerText = 'Online';
        statusEl.classList.remove('offline');
        statusEl.classList.add('online');
        console.log('Connected!!!');
    }
    
    socket.onmessage = (event) =>{
        try {
            const { payload } = JSON.parse(event.data); 
            renderMessage(`Server: ${payload}`);
        } catch (error) {
            console.error('Invalid message format:', event.data);
            renderMessage(`Server: ${event.data}`);
        }
    }
    
    socket.onclose= (event) =>{
          statusEl.innerText = 'Offline';
          statusEl.classList.remove('online');
          statusEl.classList.add('offline');
          
        console.log('Disconnected!!!');
        setTimeout(()=>{
            connetToWebSocketServer();
        },1500);
    }

};

connetToWebSocketServer();



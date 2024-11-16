import { WebSocketServer, WebSocket } from 'ws';
import { envs } from './config';

const wss = new WebSocketServer({ port: envs.PORT });
 

//client connection
wss.on('connection', function connection(ws) {
  console.log('Client connected');
  //console.log(ws)

//get error when connection fails
  ws.on('error', console.error);

  //reception of the message sent by the client to the server
  ws.on('message', function message(data) {
    console.log('received from client: %s', data);

    //payload
    const payload = {
      type: 'custom-message',
      payload: data.toString(),
    }
    // to forward the same data to client
    if(ws.readyState === ws.OPEN){
      //ws.send(JSON.stringify(payload));
      //SERVER BROADCAST => Sending message 
      //to the server and to all clients connected to the server, including itself
      wss.clients.forEach(function each(client) {
         //SERVER BROADCAST => Sending message 
      //to the server and to all clients connected to the server, including itself:
       // if (client.readyState === WebSocket.OPEN) {

       //CLIENT BROADCAST => A client WebSocket broadcasting to every 
       //other connected WebSocket clients, excluding itself.
          if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(payload), { binary: false });
        }
      }
    );
    }
    
  });
  //sending the message from the server to the client, without client's request
 // ws.send('something from server');

  //example sending server messages every 4 seconds:
//   setInterval(()=> {
//     ws.send('test')
//   },4000)
ws.on('close', ()=>{
  console.log('Client disconnected')
})

});


console.log(`Server running on ws://localhost:${envs.PORT}`)
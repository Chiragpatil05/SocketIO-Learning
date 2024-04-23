import express from "express";
import { Server } from "socket.io";
import {createServer} from "http";
import cors from "cors";


const port = 3000;


const app = express();

const server = createServer(app);

const io = new Server(server,{
    cors:{
        origin:"http://localhost:5173",
        methods:["GET","POST"],
        credentials:true
    }
});

app.use(cors(
    {
        origin:"http://localhost:5173",
        methods:["GET","POST"],
        credentials:true
    })
);


app.get("/", (req,res) => {
    res.send("Jay Shree Ganesh");
})



// const user = false;
// io.use((socket,next)=>{
//     if(user) next(); 
// })


// io means the whole circuit or the server , io ke andar alg alg sockects honge
// socket means the individual client or user
// har ek socket ke pass id hoti hai , and har ek socket room mai hote hai

// io / socket server listens for when a client connects to the server via WebSocket
io.on("connection",(socket) => {
    console.log(`User connected with id ${socket.id}`);

    // ab ek socket kuch bhejega , here "welcome" is the event
    // socket.emit("welcome" , `${socket.id} welcome to the server`);

    // brodacast mai ek socket apne aap ko chhod kar har socket ko message bhejega
    // socket.broadcast.emit("brodcast" , `${socket.id} joined the server`)

    // ab ek socket dusre socket ko message bhejega , front end se message event trigger hoga, 
    // then usko idhr , data receive karke print kara denge
    socket.on("message",({room,message})=>{
        console.log({room,message});
        // ab sirf socket ko kisi particular room wale ko message bhejna hai
        // in these case io.to().emit() is same for socket.to().emit()
        socket.to(room).emit("message-received",message);
    })

    // jese ek socket ne data bheja wo saare socket ko mil jaaye
    // io.emit("message-received" , data)

    // jese ek socket ne data bheja wese ji usko chhod kar har socket ko message mil jayega
    // socket.broadcast.emit("message-received",data);

    // ab alag alag sockets ko room mai join karwana hai
    socket.on("join-room" , (room)=>{
        socket.join(room);
        console.log("user joined " , room);
    })

    // disconnecting a socket
    socket.on("disconnect",() => {
        console.log("user disconnected " , socket.id);
    });
})


server.listen(port , ()=>{
    console.log(`Server successfully started on port ${port}`);
})
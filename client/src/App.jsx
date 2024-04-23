import { useEffect, useMemo, useState } from "react";
import {io} from "socket.io-client";
import {Container, TextField, Typography , Button, Stack} from "@mui/material"

const App = () => {

  // client connected with the io server / websocket server
  // matlab ek socket banaya hai ya socket create kara

  // isme jab bhi koi state change ho rhi hai , tab tab naya socket ban rha hai , so we have to use useMemo hook
  // const socket = io("http://localhost:3000");

  const socket = useMemo(()=>
    io("http://localhost:3000")
   , [])


  const [messages , setMessages] = useState([]);
  const [message , setMessage] = useState("");
  const [room , setRoom] = useState("");
  const [socketId , setSocketId] = useState("");
  const [roomName , setRoomName] = useState("");

  console.log(messages);

  const handleSubmit = (e) =>{
    e.preventDefault();
    // form submit karne pe , socket message bhejega i.e emit karega
    socket.emit("message" , {message , room});
    setMessage("");
  }

  const joinRoomHandler = (e) => {
    e.preventDefault();
    socket.emit("join-room" , roomName);
    setRoomName("");
  }

  useEffect(()=>{

    // default
    socket.on("connect",()=>{
      setSocketId(socket.id);
      console.log("socket connected :-) with id " , socket.id);
    });

    // socket.on("welcome" , (mssg)=>{
    //   console.log(mssg)
    // })

    // socket.on("brodcast" , (mssg)=>{
    //   console.log(mssg);
    // })

    socket.on("message-received",(data)=>{
      console.log(data);
      setMessages((messages) => [...messages, data]);
    })


    // jab bhi use effect dobara run ho usse phele , ye run hoga
    return ()=>{
      socket.disconnect();
    };

  } , []);

  return (
      <Container maxWidth="sm" >
        <Typography variant="h2" component="div" gutterBottom>
            Learning Socket.io
        </Typography>

        <Typography variant="h5" component="div" gutterBottom>
          {socketId}
        </Typography>

        <form onSubmit={joinRoomHandler}>
          <h5>Join a room</h5>
          <TextField 
          id="filled-basic" 
          label="Room Name" 
          variant="filled" 
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
         />
         <br></br>
         <br></br>
         <Button type="submit" variant="contained" color="primary">Join Room</Button>
        </form>

        <br></br>

       <form onSubmit={handleSubmit} >
         <TextField 
          id="filled-basic" 
          label="Write message here.." 
          variant="filled" 
          value={message}
          onChange={(e) => setMessage(e.target.value)}
         />
         <br></br>
         <br></br>
         

        <TextField 
          id="filled-basic" 
          label="room" 
          variant="filled" 
          value={room}
          onChange={(e) => setRoom(e.target.value)}
         />
         <br></br>
         <br></br>

         <Button type="submit" variant="contained" color="primary">send message</Button>
       </form>

       <Stack>
        {
          messages.map((mssg,idx)=>(
            <Typography key={idx} variant="h6" component="div" gutterBottom  >
              {mssg}
            </Typography>
          ))
        }
       </Stack>

      </Container>
  )
}

export default App
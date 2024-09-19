const express = require('express');

const app = express();
const PORT = 3000;

app.use("/user",(req,res)=>{
    res.send('Hello from the server 🧑‍💻');
})


app.listen(PORT, ()=>{
    console.log('Listening on port '+PORT)
})
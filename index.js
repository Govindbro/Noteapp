const connectMongo=require('./db')
const express = require('express')
const cors=require('cors')

connectMongo();
const app = express()
const port = 80 || process.env.port

app.use(cors())
app.use(express.json())

// want to use request body
app.use(express.json())
//Available routes 
app.use('/api/auth',require('./routes/auth'));
app.use('/api/notes',require('./routes/notes'))
app.get('/',(req,res)=>{
  res.send("hoo jaooo jaldi")
});

app.listen(port, () => {
  console.log(`Note app listening on port ${port}`)
})
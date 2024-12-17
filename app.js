const express = require('express');
const app = express();
const usersRouter = require('./routes/users')
const seqConnection = require('./config/seqConfig')
seqConnection.sequelize.sync().then(()=>{
    console.log("Connection Established")
}).catch((err)=>{
    console.log("Database connection failed with error:"+err)
})

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/users',usersRouter)

app.listen(3000, () => {
    console.log('Server started on port 3000');
  });
  
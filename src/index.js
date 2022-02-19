const express = require('express');

if(process.env.NODE_ENV){
    require('./mongodb/db.js');
}

const router = require('./routers/routers.js');

const app = express();
const port = 8000;

app.use(express.json());

app.use(router);

app.listen(port, ()=>{
    console.log('Server is up on port '+ port);
});
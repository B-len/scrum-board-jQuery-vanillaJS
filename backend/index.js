let express = require('express')
let app = express();
var cors = require('cors')
let getAllBoard = require('./getAllBoard.js');

app.use(cors())
// setup endpoint for getting all the lists from the board 
app.get('/api/lists', getAllBoard);


// start server listening at port 3000
app.listen(3000, '127.0.0.1', () => {
    console.log('servidor levantado en el puerto 3000');
})
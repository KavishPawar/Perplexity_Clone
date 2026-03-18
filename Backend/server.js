import ('dotenv/config');
import app from './src/app.js';
import connectDB from './src/config/database.js';
import http from 'http'
import { initSocket } from './src/sockets/server.socket.js';


connectDB()

const PORT = process.env.PORT || 8000;


const httpServer = http.createServer(app);
initSocket(httpServer);

httpServer.listen(PORT,() => {
    console.log(`PORT StArTeD @ ${PORT} =======> `)
})
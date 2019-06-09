const app = require('../app');
const server = require('http').createServer(app);
const PORT = process.env.PORT
//const PORT = 8100;

server.listen(PORT);
server.on('listening', ()=> {
    console.log('Server listening on port '+PORT);
});;
server.on('error', error => {
    console.log('Error while starting the server :: '+error);
});

module.exports = server;
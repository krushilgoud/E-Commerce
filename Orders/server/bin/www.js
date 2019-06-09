const app = require('../app');
const server = require('http').createServer(app);
const PORT = require('../config/appConfig').PORT;

server.listen(PORT);
server.on('listening', ()=> {
    console.log('Server listening on port '+PORT);
});;
server.on('error', error => {
    console.log('Error occured while starting the server :: '+error);
});

module.exports = server;
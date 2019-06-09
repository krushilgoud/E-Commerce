const usersdao = require('./users.dao');
const registerUser = details => usersdao.registerUser(details);
const signInUser = details => usersdao.signInUser(details);

const findUserByUsername = (username) => {
    const promise = new Promise((resolve, reject) => {
        usersdao.findUserbyUsername(username, (error, user) => {
            if(error) {
                reject({message: error.message, status: 500});
            } else {
                console.log(user);
                resolve({message: 'Found', status: 200, data: user});
            }
        });
    });
    return promise;
};

module.exports = {
    registerUser,
    signInUser,
    findUserByUsername
}
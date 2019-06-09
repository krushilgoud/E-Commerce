const UserModel = require('./users.entity').userModel;

const signInUser = details => {
    let signInPromise = new Promise((resolve, reject) => {
            UserModel.findOne(
                {username: details.username},
                (error, user) => {
                    if(error) {
                        reject({message: 'Internal server error', status: 500});
                    } else {
                        if(user) {
                            resolve({message: 'Successfuly logged in', status: 200, data: user});
                        } else {
                            reject({message: 'You are not registered user', status: 403});
                        }
                    }
                }
            );
    });
    return signInPromise;
};

const registerUser = userInfo => {
    const registerPromise =  new Promise((resolve, reject) => {
            UserModel.findOne(
                {username: userInfo.username},
                (error, record) => {
                    if(error) {
                        reject({message: error.message, status: 500});
                    } else {
                        if(record) {
                            reject({message: 'username is already exist', status: 403});
                        } else {
                            const user = new UserModel(userInfo);
                            user.save((error, addedUser) => {
                                if(error) {
                                    reject({message: error.message, status: 500});
                                } else {
                                    resolve({message: 'Successfully registered', status: 201, data: {
                                        user: {
                                            userInfo: addedUser.username
                                        }, message: 'Successfully registered'
                                    }});
                                }
                            });
                        }
                    }
                }
            );
        });
    return registerPromise;
};

const findUserbyUsername = (username, callback) => {
    UserModel.findOne({username: username}, (error, user) => callback(error, user));
};

module.exports = {
    signInUser,
    registerUser,
    findUserbyUsername
}
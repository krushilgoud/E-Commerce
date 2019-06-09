const user = {
    username: 'john.doe@domain.com',
    password: 'password12'
};

const register_user = {
    username: 'test@test.com',
    password: 'password12'
}

const user_1_payload = {
    userName: 'john.doe@domain.com',
    userId: '2'
};

const user_2_payload = {
    userName: 'jane.doe@domain.com',
    userId: '3'
};

const user_3_payload = {
    userName: 'lorem.ipsum@domain.com',
    userId: '4'
};

const dying_payload = {
    userName: 'lorem.ipsum@domain.com',
    userId: '5'
};

let token_raw;

module.exports = {
    user,
    token_raw,
    user_1_payload,
    user_2_payload,
    user_3_payload,
    dying_payload,
    register_user
}
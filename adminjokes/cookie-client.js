const axios = require('axios').default;
const { CookieJar } = require('tough-cookie');
const { wrapper } = require('axios-cookiejar-support');

module.exports = function () {
    const jar = new CookieJar();

    const client = wrapper(axios.create({ jar }));

    return client;
}
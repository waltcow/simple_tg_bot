const { createWebAPIRequest } = require('./util');

function getUserPlayRecord (type, uid) {
    const action = "/weapi/v1/play/record";

    // type=1时只返回weekData, type=0时返回allData
    const data = {
        type: type,
        uid: uid, //用户 id,
        csrf_token: ''
    }

    return createWebAPIRequest('music.163.com', action, 'POST', data, '');
}


module.exports = {
    getUserPlayRecord: getUserPlayRecord
}

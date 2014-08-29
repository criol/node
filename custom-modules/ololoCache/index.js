var _cache = {};

var _clearFromCache = function (key) {
    if (_cache[key]) {
        delete _cache[key];
    }
};


exports.putInCache = function (key, value, expires) {

    if (key && value) {
        _cache[key] = {
            value: value,
            expires: setTimeout(_clearFromCache.bind(null, key), expires)
        };

        console.log(_cache[key]);
    }
};

exports.getFromCache = function (key) {
    var dataFromCache = _cache[key],
        res;

    if (dataFromCache) {
        res = dataFromCache.value;
    } else {
        res = undefined;
    }

    return res;
};

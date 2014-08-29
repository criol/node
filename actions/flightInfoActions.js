var curl = require('curlrequest'),
    ololoCache = require('../custom-modules/ololoCache');

module.exports = function (url, regExpPattern) {
    var formatStr = function (str, data) {
        for (var paramName in data) {
            str = str.replace(new RegExp('{' + paramName + '}', 'g'), data[paramName]);
        }
        str = str.replace(/{([a-zA-Z0-9\_]+):([^|]*\|\|[^|]*\|\|[^|]+)}/g, function (matchedString, paramName, declineWords) {
            if (typeof data[paramName] !== 'undefined') {
                return parseInt(data[paramName]).decline(declineWords, true);
            }
            return '';
        });
        return str;
    };

    return {
        getFlightInfo: function (flightNumber, departureDate, callback) {
            var options = {
                    url: formatStr(url, {
                        flightNumber: flightNumber,
                        departureDate: departureDate
                    })
                },

                matches = [],
                resultHTML = "",
                result = "",
                cacheKey = flightNumber + departureDate,
                cachedData = ololoCache.getFromCache(cacheKey);



            if (cachedData) {
                callback && callback(cachedData)
            } else {
                curl.request(options, function (err, parts) {
                    if (err) {
                        console.log('!!!!!!!!!!!!!!errrrrr');
                        callback && callback('что то пошло не так')
                    }
                    parts = parts.split('\r\n');
                    resultHTML = (parts[parts.length - 1]);
                    matches = resultHTML.replace(/[\r\n\t]/g, ' ').match(regExpPattern);

                    if (matches && matches.length) {
                        result = matches[0]
                    } else {
                        result = 'такого рейса нет'
                    }

                    ololoCache.putInCache(cacheKey, result, 3600000);
                    callback && callback(result);
                });
            }
        }
    }
};

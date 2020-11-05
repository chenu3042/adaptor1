const log4js = require('log4js');
const cryptojs = require('crypto-js');

const CONSTANTS = require('../../constants.js');
const config = require('../config/config.json');

log4js.configure('./server/config/log4js.json');
var log = log4js.getLogger('server');
var log_level = config.LOG_LEVEL;
log.logLevel = log_level;

var org = CONSTANTS.BSP.API_PARAMS.ORGANIZATION;
var contentType = 'application/json';
var date;
var token;
var isAuthTokenRequired = false;

function setOptions(type, path, formData) {
  var options = {
    headers: buildHeaders(type, path),
    url: buildURL(path),
    method: type,
    json: true,
  };
  if (formData) {
    options['body'] = formData;
  }
  return options;
}

function buildURL(path) {
  var url = CONSTANTS.BSP.API_PARAMS.BASE_URL + path;
  log.debug('buildURL - API URL :' + url);
  return url;
}

function buildHeaders(type, path) {
  var headers = {
    'nep-organization': org,
    'nep-enterprise-unit': CONSTANTS.BSP.API_PARAMS.NEP_ENTERPRISE_UNIT,
    Authorization: generateAuth(type, path),
    Date: date,
    host: 'gateway-staging.ncrcloud.com',
    'Content-Type': contentType.trim(),
  };
  return headers;
}

function generateAuth(method, path) {
  if (token) {
    return 'Bearer ' + token;
  }
  var time = isoTime();
  var oneTimeSecret = CONSTANTS.BSP.API_PARAMS.SECRET_KEY + time;
  var toSign = method + '\n' + path;

  if (contentType) {
    toSign += '\n' + contentType.trim();
  }
  if (org) {
    toSign += '\n' + org.trim();
  }

  var key = cryptojs.HmacSHA512(toSign, oneTimeSecret);
  var accessKey =
    'AccessKey ' +
    CONSTANTS.BSP.API_PARAMS.SHARED_KEY +
    ':' +
    cryptojs.enc.Base64.stringify(key);
  log.debug(`generateAuth - accessKey :${accessKey}`);

  return accessKey;
}

function isoTime() {
  var d = new Date();
  d.setMilliseconds(0);
  date = d.toUTCString();
  return d.toISOString();
}
function setParams(type, path) {
  return {
    headers: buildHeaders(type, path),
    url: buildURL(path),
    method: type,
  };
}

function authToken(req, res, next) {
  try {
    if (!isAuthTokenRequired) {
      next();
      return;
    }
    request.post(
      setParams(
        CONSTANTS.METHOD_TYPES.POST,
        CONSTANTS.BSP.API_ENDPOINTS.AUTHENTICATE
      ),
      function (err, response, body) {
        if (err) {
          log.debug(`API Error :${err}`);
          return res.json(err);
        }
        log.debug(`API Response Status Code:${response.statusCode}`);
        var apiResponse = JSON.parse(body);
        token = apiResponse.token;
        next();
      }
    );
  } catch (e) {
    log.error(`Error :${e}`);
    next(e);
  }
}

module.exports = { authToken, setOptions, setParams };

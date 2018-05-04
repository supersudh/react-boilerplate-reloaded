import 'whatwg-fetch';

import { getAuthDetails } from './localStorage';

const API_URL = require('./config')[process.env.NODE_ENV];

/**
 * Requests a URL, returning a promise
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 *
 * @return {object}           An object containing either "data" or "err"
 */
export default function request({ name }, options = {}) {
  const authDetails = getAuthDetails('access_token');
  const headers = {};
  const opts = Object.assign({}, options);

  let REQUEST_URL = API_URL;
  const { access_token } = authDetails;
  if (access_token) {
    if (name.includes('?')) {
      REQUEST_URL += `${name}&access_token=${access_token}`;
    } else {
      REQUEST_URL += `${name}?access_token=${access_token}`;
    }
  } else {
    REQUEST_URL += `${name}`;
  }

  // headers.Accept = 'application/json';
  headers['Content-Type'] = 'application/json';

  opts.headers = Object.assign({}, options.headers || {}, headers);
  return fetch(REQUEST_URL, opts)
    .then(checkStatus)
    .then(parseJSON)
    .then(data => data);
}

/**
 * Parses the JSON returned by a network request
 *
 * @param  {object} response A response from a network request
 *
 * @return {object}          The parsed JSON from the request
 */
function parseJSON(response) {
  try {
    if (response.headers.get('content-type').indexOf('pdf') > 0) {
      return response.blob();
    }

    if (response.headers.get('content-type').indexOf('csv') === -1) {
      return response.json();
    }

    return response.text();
  } catch (error) {
    return response;
  }
}

/**
 * Checks if a network request came back fine, and throws an error if not
 *
 * @param  {objct} response   A response from a network request
 *
 * @return {object|undefined} Returns either the response, or throws an error
 */

function checkStatus(response) {
  if (response.ok) { // response.status >= 200 && response.status < 300
    return response;
  } else if (
    response.status === 400
    || response.status === 401
    || response.status === 403
    || response.status === 404
    || response.status === 422
  ) {
    return response.json().then(err => {
      throw err;
    });
  }

  const error = new Error('Request endpoint Error');
  error.res = response;

  throw error;
}
const fs = require('fs');
const url = require('url');

const index = fs.readFileSync(`${__dirname}/../client/client.html`);

const errorStruct = {
  400: 'badRequest',
  401: 'unauthorized',
  403: 'forbidden',
  404: 'notFound',
  500: 'internal',
  501: 'notImplemented',
};


const getIndex = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
};

const formatResponse = (request, response, messageText, status = 200) => {
  const parsedURL = url.parse(request.url, true);
  const formats = request.headers.accept.split(',');
  let chosenFormat = 'application/json';
  if (formats.includes('text/xml')) {
    chosenFormat = 'text/xml';
  }
  response.writeHead(status, { 'Content-Type': chosenFormat });
  if (chosenFormat === 'application/json') {
    if (status === 200) {
      response.write(`{"message": "${messageText}"}`);
    } else {
      response.write(`{"message": "${messageText}", "id": "${errorStruct[status]}"}`);
    }
  } else if (chosenFormat === 'text/xml') {
    if (status === 200) {
      response.write(`<response><message>${messageText}</message></response>`);
    } else {
      response.write(`<response><message>${messageText}</message><id>${parsedURL.pathname.replace('/', '')}</id></response>`);
    }
  }
  response.end();
};

const isQueryValid = (request, queryParam) => {
  const { query } = url.parse(request.url, true);
  return (query && query[queryParam] === 'true');
};

const getSuccess = (request, response) => {
  formatResponse(request, response, 'This is a successful response');
};

const getBadRequest = (request, response) => {
  // const query = url.parse(request.url, true).query;
  // if (query && query.isValid === "true"){
  if (isQueryValid(request, 'isValid')) {
    formatResponse(request, response, 'This is a valid request', 200);
  } else {
    formatResponse(request, response, 'Message: Missing valid query parameter set to true', 400);
  }
};

const getUnauthorized = (request, response) => {
  if (isQueryValid(request, 'isLoggedIn')) {
    formatResponse(request, response, 'This is a valid request', 200);
  } else {
    formatResponse(request, response, 'Message: Missing loggedIn query parameter set to yes', 401);
  }
};

const getForbidden = (request, response) => {
  formatResponse(request, response, 'Message: You do not have permission to access this content', 403);
};

const getInternal = (request, response) => {
  formatResponse(request, response, 'Message: Internal server error. Something went wrong', 500);
};

const getNotImplemented = (request, response) => {
  formatResponse(request, response, 'Message: A get request for this page has not been implemented yet. Check again later for updated content', 501);
};

const get404 = (request, response) => {
  formatResponse(request, response, 'Message: The page you are looking for was not found', 404);
};

module.exports.getIndex = getIndex;
module.exports.getSuccess = getSuccess;
module.exports.getBadRequest = getBadRequest;
module.exports.getUnauthorized = getUnauthorized;
module.exports.getForbidden = getForbidden;
module.exports.getInternal = getInternal;
module.exports.getNotImplemented = getNotImplemented;
module.exports.get404 = get404;

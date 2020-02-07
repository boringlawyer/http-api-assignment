const fs = require('fs');
const url = require('url');
const index = fs.readFileSync(`${__dirname}/../client/client.html`);

const getIndex = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
};

const formatResponse = (request, response, messageText, status = 200) => {
  let parsedURL = url.parse(request.url, true);
  const formats = request.headers.accept.split(',');
  let chosenFormat = 'application/json';
  if (formats.includes('text/xml')) {
    chosenFormat = 'text/xml';
  }
  response.writeHead(status, { 'Content-Type': chosenFormat });
  if (chosenFormat === 'application/json') {
    response.write(`{"message": "${messageText}"}`);
  } else if (chosenFormat === 'text/xml') {
    response.write(`<response><message>${messageText}</message></response>`);
  }
  response.end();
};

const getSuccess = (request, response) => {
  formatResponse(request, response, "This is a successful response");
};

const getBadRequest = (request, response) => {
  const query = url.parse(request.url, true).query;
  if (query && query.isValid === "true"){
      formatResponse(request, response, 'This is a valid request', 200);
  }
  else {
    formatResponse(request, response, 'This is a bad request', 400);
  }
};

const getUnauthorized = (request, response) => {
  const query = url.parse(request.url, true).query;
  if (query && query.isLoggedIn === "true"){
      formatResponse(request, response, 'This is a bad request', 200);
  }
  else {
    formatResponse(request, response, 'This is a bad request', 401);
  }
}

module.exports.getIndex = getIndex;
module.exports.getSuccess = getSuccess;
module.exports.getBadRequest = getBadRequest;
module.exports.getUnauthorized = getUnauthorized;

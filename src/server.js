const http = require('http');
const fs = require('fs');
const htmlHandler = require('./htmlResponses');
const url = require('url');

const style = fs.readFileSync(`${__dirname}/../client/style.css`);

const onRequest = (request, response) => {
  switch (url.parse(request.url, true).pathname) {
    case '/':
      htmlHandler.getIndex(request, response);
      break;
    case '/style.css':
      response.writeHead(200, { 'Content-Type': 'text/css' });
      response.write(style);
      response.end();
      break;
    case '/success':
      htmlHandler.getSuccess(request, response);
      break;
    case '/badRequest':
      htmlHandler.getBadRequest(request, response);
      break;
    case '/unauthorized':
      htmlHandler.getUnauthorized(request, response);
      break;
    default:
      htmlHandler.getIndex(request, response);
      break;
  }
  // if (request.url == "/"){
  //     htmlHandler.getIndex(request, response);
  // }
  // else if (request.url == "/style.css"){
  //     response.writeHead(200, {"Content-Type" : "text/css"});
  //     response.write(style);
  //     response.end();
  // }
};
http.createServer(onRequest).listen(3000);

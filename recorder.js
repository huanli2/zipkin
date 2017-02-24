//const {ConsoleRecorder} = require('zipkin');
const {BatchRecorder} = require('zipkin');
const {HttpLogger} = require('zipkin-transport-http');

// Send spans to Zipkin asynchronously over HTTP
const zipkinBaseUrl = 'http://localhost:9411/';
const endpoint=zipkinBaseUrl + "/api/v1/spans";
const recorder = new BatchRecorder({
    logger: new HttpLogger({
        endpoint: endpoint
    })
});

//const recorder = new ConsoleRecorder();
module.exports.recorder = recorder;

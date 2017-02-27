const {HttpLogger} = require('zipkin-transport-http');
//const {ConsoleRecorder} = require('zipkin');
//const recorder = new ConsoleRecorder();
const {BatchRecorder} = require('zipkin');


// Send spans to Zipkin asynchronously over HTTP
const zipkinBaseUrl = 'http://localhost:9411';
//const zipkinBaseUrl = 'http://http://zipkin-qa.fenqi.im:9411';
const endpoint=zipkinBaseUrl + "/api/v1/spans";
const recorder = new BatchRecorder({
   logger: new HttpLogger({
       endpoint: endpoint
    })
});


module.exports.recorder = recorder;

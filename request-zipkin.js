/**
 * Created by lih on 2017/2/24.
 */

const tracer = require('./tracer');

const express = require('express');
const app = express();

const zipkinMiddleware = require('zipkin-instrumentation-express').expressMiddleware;
app.use(zipkinMiddleware({
    tracer, serviceName: 'request-zipkin'
}));

const request = require('./request-zipkin-rest.js');

app.get('/', function (req, res) {

    console.log("ttt");

    request('http://127.0.0.1:9000/api', function (error, response, body) {
        console.log('error:', error);
        console.log('statusCode:', response && response.statusCode);
        console.log(body);
        res.send(body);
    });

});

app.listen(8082, function () {
    console.log('request zipkin on port 8082!')
});

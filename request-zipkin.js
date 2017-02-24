/**
 * Created by lih on 2017/2/24.
 */
const {recorder} = require('./recorder.js');
const {Tracer} = require('zipkin');

const CLSContext = require('zipkin-context-cls');
const ctxImpl = new CLSContext('server');
const tracer = new Tracer({ctxImpl, recorder});

const express = require('express');
const app = express();

const zipkinMiddleware = require('zipkin-instrumentation-express').expressMiddleware;
app.use(zipkinMiddleware({
    tracer, serviceName: 'request-zipkin'
}));

const request = require('request');
//const {restInterceptor} = require('zipkin-instrumentation-cujojs-rest');
//const zipkinInterceptor = restInterceptor({
//    tracer, serviceName: 'request-zipkin'
//});
const interceptor = require('rest/interceptor');
const {
    HttpHeaders: Header,
    Annotation
    } = require('zipkin');


app.get('/', function (req, res) {

    console.log("ttt");

    const re = request('http://127.0.0.1:9000/api', function (error, response, body) {
        response1(response, tracer);
        console.log('error:', error);
        console.log('statusCode:', response && response.statusCode);
        console.log(body);
        res.send(body);
    });

    request1(re, tracer, 'request-zipkin');
});


function getRequestMethod(req) {
    let method = 'get';
    if (req.entity) {
        method = 'post';
    }
    if (req.method) {
        method = req.method;
    }
    return method;
}

function request1(req, tracer, serviceName = 'unknown', remoteServiceName) {

    tracer.scoped(() => {
        tracer.setId(tracer.createChildId());
    const traceId = tracer.id;
    this.traceId = traceId;

    req.headers = req.headers || {};
    req.headers[Header.TraceId] = traceId.traceId;
    req.headers[Header.SpanId] = traceId.spanId;
    traceId._parentId.ifPresent(psid => {
        req.headers[Header.ParentSpanId] = psid;
});
traceId.sampled.ifPresent(sampled => {
    req.headers[Header.Sampled] = sampled ? '1' : '0';
});

const method = getRequestMethod(req);
tracer.recordServiceName(serviceName);
tracer.recordRpc(method.toUpperCase());
tracer.recordBinary('http.url', req.host + '/' + req.path);
tracer.recordAnnotation(new Annotation.ClientSend());
if (remoteServiceName) {
    // TODO: can we get the host and port of the http connection?
    tracer.recordAnnotation(new Annotation.ServerAddr({
        serviceName: remoteServiceName
    }));
}
});

return req;
}

function response1(res, tracer) {
    tracer.scoped(() => {
        tracer.setId(this.traceId);
    tracer.recordBinary('http.status_code', res.statusCode);
    tracer.recordAnnotation(new Annotation.ClientRecv());
});
return res;
}

app.listen(8082, function () {
    console.log('request zipkin on port 8082!')
});

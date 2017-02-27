/**
 * Created by lih on 2017/2/27.
 */
const tracer = require('./tracer');

const {
    HttpHeaders: Header,
    Annotation
    } = require('zipkin');

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

function request1(req, tracer, serviceName , remoteServiceName) {

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
tracer.recordBinary('http.url', req.host + ":" + req.port + req.path);
tracer.recordAnnotation(new Annotation.ClientSend());
if (remoteServiceName) {
    // TODO: can we get the host and port of the http connection?
    tracer.recordAnnotation(new Annotation.ServerAddr({
        serviceName: remoteServiceName
    }));
}
});
}


function response1(res, tracer) {
    tracer.scoped(() => {
        tracer.setId(this.traceId);
    tracer.recordBinary('http.status_code', res.statusCode.toString());
    tracer.recordAnnotation(new Annotation.ClientRecv());
});
}

const request = require('request');

function requestOverride(url, options, callback) {

    if (typeof options === 'function') {
        callback = options;
        options = {};
    }
    const re = request(url, options, function (err, response, body) {
        console.log("enter response -- ", body);
        response1(response, tracer);
        return callback(err, response, body);
    });

    console.log ("enter send request --");
    request1(re, tracer, 'request-zipkin');
}

module.exports = requestOverride;

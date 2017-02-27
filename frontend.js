// initialize tracer
const tracer = require('./tracer');

const express = require('express');
const app = express();
const rest = require('rest');

// instrument the server
const zipkinMiddleware = require('zipkin-instrumentation-express').expressMiddleware;
app.use(zipkinMiddleware({
  tracer,
  serviceName: 'frontend-node' // name of this application
}));

// instrument the client
const {restInterceptor} = require('zipkin-instrumentation-cujojs-rest');
const zipkinRest = rest.wrap(restInterceptor, {tracer, serviceName: 'frontend-node'});


app.get('/', function(req, res) {
    console.log("enter request");
    zipkinRest('http://localhost:9000/api')
        .then(
             function(response) {res.send(response.entity);},
             function(response) {console.error("Error", response.status)}
    );
});

app.listen(8081, function() {
  console.log('Frontend listening on port 8081!');
});

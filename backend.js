// initialize tracer
const tracer = require('./tracer');

const express = require('express');
const app = express();

// instrument the server
const zipkinMiddleware = require('zipkin-instrumentation-express').expressMiddleware;
app.use(zipkinMiddleware({
  tracer,
  serviceName: 'backend' // name of this application
}));

app.get('/api', (req, res) => res.send(new Date().toString()));

app.listen(9000, () => {
  console.log('Backend listening on port 9000!');
});

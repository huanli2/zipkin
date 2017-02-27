/**
 * Created by lih on 2017/2/27.
 */
const {recorder} = require('./recorder.js');
const {Tracer} = require('zipkin');

const CLSContext = require('zipkin-context-cls');
const ctxImpl = new CLSContext('server');

module.exports = new Tracer({ctxImpl, recorder});
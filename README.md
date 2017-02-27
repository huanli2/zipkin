# Implementation Overview

Web requests are served by [Express](http://expressjs.com/) controllers, and tracing is automatically performed for you by [zipkin-js](https://github.com/openzipkin/zipkin-js). JavaScript used in the web browser is bundled with [browserify](http://browserify.org/).

# Running the example
This example has two services: request-zipkin,frontend and backend. They both report trace data to zipkin. To setup the demo, you need to start frontend.js, backend.js and Zipkin. 

* frontend: http://localhost:8081/, then call backend. client using rest + zipkin-instrumentation-cujojs-rest.
* request-zipkin:http://localhost:8082, then call backend.client using request, folder it to send info to zipkin.
* This continues the trace and calls the backend (http://localhost:9000/api) and show the result, which defaults to a formatted date.

Next, you can view traces that went through the backend via http://localhost:9411/?serviceName=browser
* This is a locally run zipkin service which keeps traces in memory


## Starting the Services
In a separate tab or window, start each of [frontend.js](./frontend.js) and [backend.js](./backend.js):
```bash
$ node frontend.js
$ node backend.js
$ node request-zipkin.js
```

Next, run [Zipkin](http://zipkin.io/), which stores and queries traces reported by the browser and above services.

```bash
$ docker run -d -p 9411:9411 openzipkin/zipkin 
```

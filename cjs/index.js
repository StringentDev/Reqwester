var events = require('events');
// import http and https
var http = require('http');
var https = require('https');

emitter = new events.EventEmitter();

// create api class
class api {
    constructor() {
        return
    }

    // create ability for middleware like onData, onError, onResponse using events
    // https://nodejs.org/api/events.html

    onDataEvent(__callback) {
        // append to events.data numerically
        emitter.on('data', (json_data) => {
            __callback(json_data)
        })
    }

    onWarningEvent(__callback) {
        emitter.on('warn', (json_data) => {
            __callback(json_data)
        })
    }

    onResponseEvent(__callback) {
        // append to events.response numerically
        emitter.on('response', (json_data) => {
            __callback(json_data)
        })
    }

    onErrorEvent(__callback) {
        // emit error event and return generated traceback
        emitter.on('error', (json_data) => {
            __callback(json_data)
        })
    }

    http_operation(url, options) {
        // download file via http - follow redirects
        var http_request = http.get(url, options, (response) => {
            // on data event
            response.on('data', (chunk) => {
                // append data to buffer
                // get percent
                var percent = (response.bytesRead / response.headers['content-length']) * 100;
                // emit data event
                emitter.emit('data', {
                    ret: {
                        body: chunk,
                        per: percent
                    },
                    res: response,
                });
            });
            // on error event
            response.on('error', (error) => {
                // emit error event
                emitter.emit('error', error);
            });

            // on end event
            response.on('end', () => {
                // emit response event
                if (response.statusCode == 302 || response.statusCode == 301) {
                    // emit error event
                    emitter.emit('warn', {
                        msg: 'Redirecting',
                        occurred: 'https_operation method - Redirecting'
                    });

                    // redirect by getting new url setting as url and restarting
                    var new_url = response.headers.location;
                    this.get(new_url, options);
                    return
                }
                
                if (response.statusCode == 404) {
                    // emit error event
                    emitter.emit('error', {
                        msg: '404 Not Found',
                        occurred: 'https_operation method - 404 Not Found'
                    });
                }
                emitter.emit('response', response);
                // if 404
            });

        }
        );
    }

    https_operation(url, options) {
        // download file via https - follow redirects
        var https_request = https.get(url, options, (response) => {
            
            // on data event
            response.on('data', (chunk) => {
                // append data to buffer
                // get percent
                var percent = (response.bytesRead / response.headers['content-length']) * 100;
                // emit data event
                emitter.emit('data', {
                    ret: {
                        body: chunk,
                        per: percent
                    },
                    res: response,
                });
            });
            // on error event
            response.on('error', (error) => {
                // emit error event
                emitter.emit('error', error);
            });

            // on end event
            response.on('end', () => {
                // emit response event
                if (response.statusCode == 302 || response.statusCode == 301) {
                    // emit error event
                    emitter.emit('warn', {
                        msg: 'Redirecting',
                        occurred: 'https_operation method - Redirecting'
                    });

                    // redirect by getting new url setting as url and restarting
                    var new_url = response.headers.location;
                    this.get(new_url, options);
                    return
                }



                if (response.statusCode == 404) {
                    // emit error event
                    emitter.emit('error', {
                        msg: '404 Not Found',
                        occurred: 'https_operation method - 404 Not Found'
                    });
                }
                emitter.emit('response', response);
                // if 404
            });


        }
        );

    }

    get(url, options) {
        // determine protocol
        var protocol = this.determineProtocol(url);
        if (protocol == false) {
            emitter.emit('error', {
                msg: 'Invalid protocol; Does not match https:// or http://',
                occurred: 'get method - provided url invalid.'
            });
            return false;
        }
        // if protocol is https
        if (protocol == "https") {
            // https operation
            this.https_operation(url, options);
        }
        // if protocol is http
        if (protocol == "http") {
            // http operation
            this.http_operation(url, options);
        }


    }

    // determine https or http from url
    determineProtocol(url) {
        // if url starts with https:// or http:// or other

        if (url.startsWith("https://")) {
            return "https";
        }
        if (url.startsWith("http://")) {
            return "http";
        }
        return false;
    }

}

module.exports = {
    api: api
}
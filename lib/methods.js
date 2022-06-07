// create new class housing methods
export const method = new class {
    constructor() {
        this.global = {}
        // determine if browser or nodejs
        this.isBrowser = typeof window !== 'undefined';

        if ( this.isBrowser ) {
            this.global["type"] = "xhr";
            this.global["module"] = "esm";
        } else {
            // determine esm or cjs
            this.global["type"] = "http/s";
            if ( typeof module !== 'undefined' && module.exports ) {
                this.global["module"] = "cjs";
            } else {
                this.global["module"] = "esm";
            }
        }

        // if nodejs, import http and https
        if ( this.global["module"] === "cjs" ) {
            this.global["http"] = require("http");
            this.global["https"] = require("https");
        } else {
            this.global["http"] = window["http"];
            this.global["https"] = window["https"];
        }

    }

    get(d) {
        let data = {};
        // data.url         : string
        // data.headers     : json object
        // data.body        : used only for POST requests json
        // data.responseType: string
        // data.callbacks   : array of functions
        // fill in missing data
        data["url"] = d["url"] || "";
        data["headers"] = d["headers"] || {};
        data["body"] = d["body"] || "";
        data["responseType"] = d["responseType"] || "";
        data["callbacks"] = d["callbacks"] || [];

        if ( this.global["type"] === "xhr" ) {
            // translate data to xhr
            let xhr = new XMLHttpRequest();
            xhr.open(data.method, data.url, true);
            xhr.responseType = data.responseType;
            for ( let key in data.headers ) {
                xhr.setRequestHeader(key, data.headers[key]);
            }
            xhr.onreadystatechange = function() {
                // stages
                // 0: request not initialized
                // 1: server connection established
                // 2: request received
                // 3: processing request
                // 4: request finished and response is ready

                for ( let i = 0; i < data.callbacks.length; i++ ) {
                    data.callbacks[i](xhr.readyState, xhr.response);
                }
            }
            xhr.send(data.body);

        } else {
            let http;
            // translate data to http/s
            // check if url is https or http
            let url = d.url;
            if ( url.indexOf("https") === 0 ) {
                // https
                http = this.global["https"];
            } else {
                http = this.global["http"];
            }

            // create request
            console.log(url)
            let request = http.request(url, {
                method: "GET",
                headers: data.headers,
                body: data.body,
                responseType: data.responseType
            }, function(response) {
                // get status of request, uninitialized, connection establised, loading, finished
                let status = response.status;
                // convert status into 0, 1, 2, 3, 4 for
                // uninitialized, connection established, loading, finished, error
                let state = response.readyState;

                // follow redirect based on setting
                if ( status === 301 || status === 302 ) {
                    // follow redirect
                    let location = response.headers.location;
                    // get new request
                    this.get({
                        url: location,
                        headers: data.headers,
                        body: data.body,
                        responseType: data.responseType,
                        callbacks: data.callbacks
                    });
                    return
                }

                for ( let i = 0; i < data.callbacks.length; i++ ) {
                    // get data from response

                    data.callbacks[i](0, {});
                }

                let returns = [];
                response.on('data', chunk => {
                    returns.push(chunk);

                    for ( let i = 0; i < data.callbacks.length; i++ ) {
                        // get data from response

                        data.callbacks[i](3, Buffer.concat(returns).toString());
                    }
                });
                
                response.on('end', () => {
                    for ( let i = 0; i < data.callbacks.length; i++ ) {
                        // get data from response

                        data.callbacks[i](4, Buffer.concat(returns).toString());
                    }
                })
            }
            );

            // send request
            request.end();


        }
        return this.global;
    }   
}
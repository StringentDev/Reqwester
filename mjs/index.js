import http from "http"
import https from "https"
import { Readable } from "stream"

class api {
	constructor() {
		this.Stream = new Readable()
	}

	// pipe data to a writeable stream, allowing
	// low memory use for massive files.
	// this.Stream.push(data)
	// this.Stream.push(null) indicates EOF and so closes.
	// they can then do a Reqwest.Stream.pipe(function)
	// use https://github.com/substack/stream-handbook to help

	Aquire(dev_options) {
		
	}
}

export default api
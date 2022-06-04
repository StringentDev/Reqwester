# Reqwester
###### The unopinionated HTTP/S client
Reqwester was built around the issue in 
which creating clients for `POST`, `GET`, 
`PATCH` and `DEL` requests were unusually
large. It took a lot of code to achieve a
single `GET` request. So lets not get 
started on `POST` which requires even more
options like what data to send.

This basically just queries the internet for servers.

This project is designed to be a
cross-platform service like Axios whilst
providing an easy to understand OOP based
async API to interact with the internet.

**Reqwester is not Axios!**

## API
### API Class
The api class is the main way of interacting
with the module. You just define the class
and you can begin the process of using the
module.

```js
// commonjs
const { api } = require("reqwester")

// ECMA Script
import { api } from "reqwester"
```

### GET Request
To create a get request, you can set the url
and send custom headers if you want.

```js
let req = new api()

req.SetURL("https://example.com/archive.zip")
   .Acquire({
		 // enforce get however if no body is
		 // passed then it defaults to get
		 method: "GET",
		 headers: {}
	 })
```


### POST Reqwest
Same as get but with a required passalong.

```js
req.SetURL("https://example.com/post")
   .Acquire({
		 // Defaults to POST since body exists
		 method: "POST",
		 body: {
			 data: "string"
		 },
		 headers: {}
	 })
```

I don't think that we need to keep going 
with this as `PATCH` and `DEL` are the same 
format as `POST`

## Readable stream 
you can pipe the Readable steam to a 
function using the `api.Stream` object and 
`pipe(x)`

```js
fs.writeFileStream( api.Stream )
```

## Configure Events
```js
api.event.add("EventName", () => {
	// ... code goes here
})
```

### Progress
When data is recieved, this function 
calculates the percentage of the content that
has been recieved over what is expected (x100)
to get the percentage which is then passed on
to registered middleware functions.

```js
api.event.add("progress", (event) => {
	console.log(
		event.percent, 
		event.chunkMin, 
		event.chunkMax
	)
})
```

### Data
```js
api.event.add("data", (event) => {
	console.log(
		event.res.body.appended, 
		event.res.body.index,
		event.res.body.all,
		event.res.status
		event.chunkMin, 
		event.chunkMax
	)
})
```

### State Changed
```js
// ConnectionEnded
// ConnectionStarted
// ConnectionInterrupted
// UrlChanged
// UrlReverted
// FileFailed
// FileOverwrite
// FileNonExistant
// LinkNonExistant
// ConnectionHandshake

api.event.add("ConnectionEnded", (event) => {
	console.log(
		event.res.status,
		event.res.explaination
	)
})
```

## Configure options
```js
api.config.set("option", value)

api.config.use.json({
	option: value
})
```
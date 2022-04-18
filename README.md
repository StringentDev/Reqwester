# Reqwester
### Table of contents
* [Reqwester](#reqwester)
      * [Table of contents](#table-of-contents)
   * [About](#about)
   * [Changelog](#changelog)
      * [0.0.0-Alpha](#000-alpha)
   * [API](#api)
      * [Defining and Importing](#defining-and-importing)
         * [ES6 (modules)](#es6-modules)
         * [CommonJS](#commonjs)
      * [Warning and Error Structure](#warning-and-error-structure)
      * [onErrorEvent](#onerrorevent)
      * [onDataEvent](#ondataevent)
      * [onResponseEvent](#onresponseevent)
      * [Get](#get)


## About
Reqwester us a super simple wrapper api for `http` and `https` requests to servers in order to download a file. This project is only in its infancy, meaning that most features have not been implemented.

## Changelog
### 0.0.0-Alpha
Initial commit including the following features.
 - Monitoring progress
 - Redirect following (cannot be turned off for now)
 - `https` and `http` wrapping
 - Ability pass options to the module
 - Events api

## API
### Defining and Importing
#### ES6 (modules)
```js
import reqwester from "reqwester"

api = new reqwester.api()

```

#### CommonJS
```js
const requester = require("reqwester")

api = new reqwester.api()
```

^ Due to change rapidly in the next minor version for full configuration + control.

### Warning and Error Structure
```json
{
    "msg": "main basic message spat out",
    "occurred": "Hint as to where the error occurred"
}
```

^ This will be changed in the next minor version to have a fully generated error format.

### onErrorEvent
```js
api.onErrorEvent((error) => {
    console.error(error.msg)
})
```

^ the `onWarningEvent` works the same way but is fired in less meaningful circumstances, such as when the script is redirected.

### onDataEvent
```js
api.onDataEvent((data) => {
    // use fs to APPEND data to file
})
```

to access headers, use `data.res` which contains the object that `https` or `http` return.

You can access the percent at `data.ret.per` and the data being returned by the server at `data.ret.body`

### onResponseEvent
```js
api.onResponseEvent((response) => {
    // get called after a connection closes or a redirect.
})
```
^ behaviour may change to only include after a connection closes.

### Get
```js
// download fedora minimal
api.get('https://download.fedoraproject.org/pub/fedora/linux/releases/35/Spins/armhfp/images/Fedora-Minimal-35-1.2.armhfp.raw.xz', 
    {
        timeout: 10000,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36',
        }
    }
)
```

Allows custom options to be passed to the `http` or `https` module like the user-agent.
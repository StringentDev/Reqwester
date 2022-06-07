import Reqwester from "../dist/index.js"
// Reqwester.get()
console.log(Reqwester.method.get({
    url: "https://www.google.com",
    callbacks: [
        function(state, response) {
            if (state === 4) console.log(state, response);
        }
    ]
}))
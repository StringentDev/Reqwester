
export default new class {
    constructor() {
        return
    }

    error(msg) {
        // create new error and determine where it was thrown
        throw new Error(msg);
    }

    info(msg) {
        console.log(msg)
    }
}
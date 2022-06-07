require("@babel/core").transformSync("code", {
    plugins: ["@babel/plugin-transform-modules-commonjs"],
});
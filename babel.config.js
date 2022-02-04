module.exports = (api) => ({
    plugins: ["@babel/plugin-transform-runtime"],
    presets: [
      [
        "@babel/preset-env",
        {
          useBuiltIns: "entry",
          corejs: "3.0.0",
          targets: api.caller((caller) => caller && caller.target === "node")
            ? { node: "current" }
            : { chrome: "58", ie: "11" },
        },
      ],
      "@babel/preset-typescript",
    ],
  });

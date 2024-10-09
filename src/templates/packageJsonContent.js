function packageJsonContent(functionName, description) {
  const packageJson = {
    name: `${functionName}`,
    version: "1.0.0",
    description: description,
    type: "module",
    main: `${functionName}.js`,
    scripts: {
      test: "jest test.js"
    },
    devDependencies: {
      "@babel/preset-env": "^7.24.6",
      "babel-jest": "^29.7.0",
      "jest": "^29.7.0"
    }
  };
  return JSON.stringify(packageJson);
}
export { packageJsonContent }
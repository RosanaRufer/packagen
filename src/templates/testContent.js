function testContent(functionName, examples) {
    let text = `
    import { ${functionName} } from './${functionName}';
    
    describe('Tests for ${functionName}', () => {
    `;
    
    examples.forEach((testCase, index) => {
      text += `
      test('Test case ${index + 1}', () => {
        const result = ${functionName}(${JSON.stringify(testCase.input)});
        expect(result).toBe(${JSON.stringify(testCase.expected)});
      });
      `;
    });
    
    text += `
    });
  `;
  return text
}
export { testContent}

import { promises } from 'fs';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import OpenAI from "openai";
import * as templates from './templates/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const specsFile = path.join(__dirname, '..', 'specs.json');
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function aiGenerateFunction(specs) {
    // Docs: https://platform.openai.com/docs/guides/text-generation/chat-completions-api
    const messages = [
        { role: "system", content: "You only return one javascript function without wrapping it in triple backticks" },
        { role: "system", content: "Return only executable javascript, no wrapping in backticks or markdown" },
        { role: "user", content: `A function called ${specs.functionName} that ${specs.description}` },
    ];
    const chatCompletion = await openai.chat.completions.create({
        messages: messages,
        model: "gpt-3.5-turbo",
    });
    return chatCompletion.choices[0].message.content;
}

async function loadSpecsFromFile() {
    const jsonSpecs = await promises.readFile(specsFile, 'utf8');
    return JSON.parse(jsonSpecs);
}

async function writeTestFile(functionName, examples) {
    fs.writeFileSync(
        'output/test.js',
         templates.testContent(functionName, examples)
    );
}

async function writeCodeFile(functionName, stringFunction) {
    fs.writeFileSync(
        `output/${functionName}.js`, `${stringFunction} export { ${functionName} }`);
}

async function writeReadmeFile(functionName, description) {
    fs.writeFileSync(
        'output/README.md',
        templates.readmeContent(functionName, description)
    );
}

async function writePackageJson(functionName, description) {
    fs.writeFileSync(
        'output/package.json',
        templates.packageJsonContent(functionName, description)
    );
}

function ensureOutputDirExists() {
    if (!fs.existsSync('output')) {
      fs.mkdirSync('output');
    }
}

// To support esmodules
async function writeBabelRcFile(functionName, description) {
    fs.writeFileSync(
        'output/.babelrc',
        `{ "presets": ["@babel/preset-env"]}`
    );
}

async function main() {
    // Read specs
    process.stdout.write('👀 Reading specs...');
    const specs = await loadSpecsFromFile();
    process.stdout.write('✅\n');
    
    // String Code
    process.stdout.write('🌴 Making OpenAI do the hard work...');
    const stringCode = await aiGenerateFunction(specs);
    process.stdout.write('✅\n');

    // Ensure output dir exists
    process.stdout.write('🧯 Ensuring output dir exists...');
    await ensureOutputDirExists();
    process.stdout.write('✅\n');    

    // JavaScript Code
    process.stdout.write('👾 Writing JavaScript..');
    await writeCodeFile(specs.functionName, stringCode);
    process.stdout.write('✅\n');    

    // Write Readme.md
    process.stdout.write('📝 Writing README.md...');
    await writeReadmeFile(specs.functionName, specs.description);
    process.stdout.write('✅\n');

    // Write package.json
    process.stdout.write('⚙️ Writing package.json...');
    await writePackageJson(specs.functionName, specs.description);
    await writeBabelRcFile();
    process.stdout.write('✅\n');

    // Test
    process.stdout.write('🧪 Ensuring your test cases are included...');
    await writeTestFile(specs.functionName, specs.examples);
    process.stdout.write('✅\n');
}

await main().catch((error)=>{
    process.stdout.write("❌ Something went wrong");
    console.log(error)
    process.exit(1);
}).finally(()=>{
    process.exit(0);
});
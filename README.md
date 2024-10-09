# packagen

## Requirements
 
 * nodejs: For local usage use [nvm](https://github.com/nvm-sh/nvm) so you can have different node versions on your computer depending on each project requirement.
 * an open AI API KEY

## Set up

In the root directory:
1. `export OPENAI_API_KEY="<your-openai-api-key>"`
2. `nvm use; npm install`


## Usage

1. Edit `specs.json` with your package behaviour specs.
2. Run `npm run packagen`
3. Run `cd output; npm install; npm run test`

Examples of working specs:

```json
{
    "description": "Given a string as input returns the number of characters in the string",
    "functionName": "charCount",
    "examples": [
        {
            "input": "hello",
            "expected": "5"
        },
        {
            "input": "javascript",
            "expected": "10"
        }
    ]
}
```

```json
{
    "description": "Given a number, calculate its double",
    "functionName": "numberDouble",
    "examples": [
        {
            "input": 4,
            "expected": 8
        },
        {
            "input": 9,
            "expected": 18
        }
    ]
}
```

```json
{
    "description": "Given a number, return true/false if its a prime number",
    "functionName": "isPrime",
    "examples": [
        {
            "input": 2,
            "expected": true
        },
        {
            "input": 6,
            "expected": false
        }
    ]
}
```
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('line', (line) => {
    let trimmed = line.trim();
    switch (trimmed) {
        case 'q':
        case 'quit':
            console.log(`Ok. Goodbye!`);
            rl.close();
            break;
        default:

            // parse purchase
            console.log(`${trimmed} saved!`);
            
            break;
    }
    rl.prompt();
});

console.log('Purchase input. Input `q` or `quit` when done');

/*******
 * Read input from STDIN
 * Use: console.log() to output your result.
 * Use: console.error() to output debug information into STDERR
 * ***/

var input = [];

readline_object.on('line', (value) => {
    // Read input values
    input.push(value);
});

// Call ContestResponse when all inputs are read
readline_object.on('close', ContestResponse);

function ContestResponse() {
    // implement your code here using input array
    const n = +input[0];
    const stack = [];

    for (let i = 1; i <= n; i++) {
        const action = input[i][0];
        const item = input[i].slice(2);

        if (action === '+') {
            stack.push(item);
        } else {
            if (stack.length === 0 || stack[stack.length - 1] !== item) {
                console.log('no');
                return;
            }
            stack.pop();
        }
    }

    console.log('yes');
}

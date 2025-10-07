/*******
 * Read input from STDIN
 * Use: console.log() to output your result.
 * Use: console.error() to output debug information into STDERR
 * ***/

var input = [
    [10, 5],
    [62, 10],
    [110, 40],
    [20, 0],
    [12, 0],
];

readline_object.on('line', (value) => {
    // Read input values
    input.push(value);
});

// Call ContestResponse when all inputs are read
readline_object.on('close', ContestResponse);

function ContestResponse() {
    console.log(
        input.reduce((sum, line) => {
            const [P, R] = line.split(' ').map(Number);
            return sum + P - R;
        }, 0)
    );
}

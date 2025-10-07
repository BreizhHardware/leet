/*******
 * Read input from STDIN
 * Use: console.log() to output your result.
 * Use: console.error() to output debug information into STDERR
 * ***/

var input = [];

// Read input lines into the input array
readline_object.on('line', (value) => {
    // Read input values
    input.push(value);
});

// Call ContestResponse when all inputs are read
readline_object.on('close', ContestResponse);

function ContestResponse() {
    console.error(`Node.js version: ${process.version}, Platform: ${process.platform}, Arch: ${process.arch}`);
    console.error(`Input lines: ${input.length}`);
    console.error(
        `CPUs: ${require('os').cpus().length}, Total Memory: ${Math.round(require('os').totalmem() / 1024 / 1024)} MB`
    );
    let line = 0;
    // Read the first line: number of distribution points D, number of basket types P, number of students E
    const [D, P, E] = input[line++].split(' ').map(Number);

    // Initialize array to hold distribution points
    const points = [];
    // Read data for each distribution point
    for (let d = 0; d < D; d++) {
        // Read point coordinates (x, y) and number of basket types S at this point
        const [x, y, s] = input[line++].split(' ').map(Number);
        // Read the list of basket types available
        const baskets = input[line++].split(' ').map(Number);
        // Read the quantities for each basket type
        const quantities = input[line++].split(' ').map(Number);
        // Create a map for stock: basket type -> quantity
        const stock = new Map<number, number>();
        let totalStock = 0;
        for (let i = 0; i < s; i++) {
            stock.set(baskets[i], quantities[i]);
            totalStock += quantities[i];
        }
        // Store point data: coordinates, stock map, and total stock count
        points.push({ x, y, stock, totalStock });
    }

    // Initialize array to hold students
    const students = [];
    // Read data for each student
    for (let e = 0; e < E; e++) {
        // Read student coordinates (x, y)
        const [x, y] = input[line++].split(' ').map(Number);
        // Read student's preferred basket types in order
        const prefs = input[line++].split(' ').map(Number);
        // Store student data with index for output
        students.push({ x, y, prefs, index: e });
    }

    // Sort students by minimum distance to any point, descending
    // This assigns students farther from points first, potentially improving assignments
    students.sort((a, b) => {
        const minDistA = Math.min(...points.map(p => Math.abs(a.x - p.x) + Math.abs(a.y - p.y)));
        const minDistB = Math.min(...points.map(p => Math.abs(b.x - p.x) + Math.abs(b.y - p.y)));
        return minDistB - minDistA;
    });

    // Array to hold the assignment of points to students (by student index)
    const assignment = new Int32Array(E);

    // Assign each student to a point in sorted order
    for (const student of students) {
        let bestCost = Infinity;
        let bestPoint = -1;
        // Find the best point for this student based on cost (dist * pref^2)
        for (let d = 0; d < D; d++) {
            const point = points[d];
            if (point.totalStock <= 0) continue; // Skip if no stock left
            const dist = Math.abs(student.x - point.x) + Math.abs(student.y - point.y);
            let pref = 4; // Default pref if none available
            // Check student's preferences in order
            for (let p = 0; p < student.prefs.length; p++) {
                if (point.stock.get(student.prefs[p]) > 0) {
                    pref = p + 1; // 1-based preference rank
                    break;
                }
            }
            const cost = dist * pref * pref;
            if (cost < bestCost) {
                bestCost = cost;
                bestPoint = d;
            }
        }
        // If no point with stock, assign to closest with stock (fallback)
        if (bestPoint === -1) {
            for (let d = 0; d < D; d++) {
                const point = points[d];
                if (point.totalStock <= 0) continue;
                const dist = Math.abs(student.x - point.x) + Math.abs(student.y - point.y);
                const cost = dist * 16; // 4*4 for worst pref
                if (cost < bestCost) {
                    bestCost = cost;
                    bestPoint = d;
                }
            }
        }
        // Assign the point to the student
        assignment[student.index] = bestPoint;
        const point = points[bestPoint];
        point.totalStock--; // Decrease total stock

        // Decrement the stock for the basket the student will take
        let decremented = false;
        // Try to take the first preferred basket available
        for (const pref of student.prefs) {
            if (point.stock.get(pref) > 0) {
                point.stock.set(pref, point.stock.get(pref) - 1);
                decremented = true;
                break;
            }
        }
        // If no preferred basket, take the lowest ID basket available
        if (!decremented) {
            let minId = Infinity;
            for (const [id, qty] of point.stock) {
                if (qty > 0 && id < minId) minId = id;
            }
            if (minId < Infinity) {
                point.stock.set(minId, point.stock.get(minId) - 1);
            }
        }
    }
    // Output the assignments as space-separated point indices
    console.log(assignment.join(' '));
}

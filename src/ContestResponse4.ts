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
    let line = 0;
    const [D, P, E] = input[line++].split(' ').map(Number);
    const points = [];
    for (let d = 0; d < D; d++) {
        const [x, y, s] = input[line++].split(' ').map(Number);
        const baskets = input[line++].split(' ').map(Number);
        const quantities = input[line++].split(' ').map(Number);
        const stock = new Map<number, number>();
        let totalStock = 0;
        for (let i = 0; i < s; i++) {
            stock.set(baskets[i], quantities[i]);
            totalStock += quantities[i];
        }
        points.push({ x, y, stock, totalStock });
    }
    const students = [];
    for (let e = 0; e < E; e++) {
        const [x, y] = input[line++].split(' ').map(Number);
        const prefs = input[line++].split(' ').map(Number);
        students.push({ x, y, prefs, index: e });
    }
    // Sort students by minimum distance to any point, descending
    students.sort((a, b) => {
        const minDistA = Math.min(...points.map(p => Math.abs(a.x - p.x) + Math.abs(a.y - p.y)));
        const minDistB = Math.min(...points.map(p => Math.abs(b.x - p.x) + Math.abs(b.y - p.y)));
        return minDistB - minDistA;
    });
    const assignment = new Array(E);
    for (const student of students) {
        let bestCost = Infinity;
        let bestPoint = -1;
        for (let d = 0; d < D; d++) {
            const point = points[d];
            if (point.totalStock <= 0) continue;
            const dist = Math.abs(student.x - point.x) + Math.abs(student.y - point.y);
            let pref = 4;
            for (let p = 0; p < student.prefs.length; p++) {
                if (point.stock.get(student.prefs[p]) > 0) {
                    pref = p + 1;
                    break;
                }
            }
            const cost = dist * pref * pref;
            if (cost < bestCost) {
                bestCost = cost;
                bestPoint = d;
            }
        }
        if (bestPoint === -1) {
            // Assign to closest with stock
            for (let d = 0; d < D; d++) {
                const point = points[d];
                if (point.totalStock <= 0) continue;
                const dist = Math.abs(student.x - point.x) + Math.abs(student.y - point.y);
                const cost = dist * 16; // 4*4
                if (cost < bestCost) {
                    bestCost = cost;
                    bestPoint = d;
                }
            }
        }
        assignment[student.index] = bestPoint;
        const point = points[bestPoint];
        point.totalStock--;
        // Decrement the first pref available
        let decremented = false;
        for (const pref of student.prefs) {
            if (point.stock.get(pref) > 0) {
                point.stock.set(pref, point.stock.get(pref) - 1);
                decremented = true;
                break;
            }
        }
        if (!decremented) {
            // Decrement the lowest id with >0
            let minId = Infinity;
            for (const [id, qty] of point.stock) {
                if (qty > 0 && id < minId) minId = id;
            }
            if (minId < Infinity) {
                point.stock.set(minId, point.stock.get(minId) - 1);
            }
        }
    }
    console.log(assignment.join(' '));
}

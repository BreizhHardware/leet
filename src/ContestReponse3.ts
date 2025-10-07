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

class UnionFind {
    parent: number[];
    rank: number[];

    constructor(size: number) {
        this.parent = Array.from({ length: size }, (_, i) => i);
        this.rank = Array(size).fill(0);
    }

    find(x: number): number {
        if (this.parent[x] !== x) {
            this.parent[x] = this.find(this.parent[x]);
        }
        return this.parent[x];
    }

    union(x: number, y: number): void {
        const rootX = this.find(x);
        const rootY = this.find(y);
        if (rootX !== rootY) {
            if (this.rank[rootX] > this.rank[rootY]) {
                this.parent[rootY] = rootX;
            } else if (this.rank[rootX] < this.rank[rootY]) {
                this.parent[rootX] = rootY;
            } else {
                this.parent[rootY] = rootX;
                this.rank[rootX]++;
            }
        }
    }
}

function ContestResponse() {
    const [I, E] = input[0].split(' ').map(Number);
    const ingredientMap = new Map<string, number>();
    for (let i = 0; i < I; i++) {
        ingredientMap.set(input[1 + i], i);
    }

    const uf = new UnionFind(I);
    const noConstraints: [number, number][] = [];

    for (let i = 0; i < E; i++) {
        const line = input[1 + I + i];
        const andIdx = line.indexOf(' and ');
        const ing1 = line.slice(0, andIdx);
        const rest = line.slice(andIdx + 5);
        const isNegative = rest.startsWith('no ');
        const ing2 = isNegative ? rest.slice(3) : rest;

        const a = ingredientMap.get(ing1)!;
        const b = ingredientMap.get(ing2)!;

        if (isNegative) {
            // Collect no constraints
            noConstraints.push([a, b]);
        } else {
            // Must be in the same basket
            uf.union(a, b);
        }
    }

    // Now check no constraints
    for (const [a, b] of noConstraints) {
        if (uf.find(a) === uf.find(b)) {
            console.log('no');
            return;
        }
    }

    console.log('yes');
}

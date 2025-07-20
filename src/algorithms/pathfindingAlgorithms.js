export function bfs(grid, startNode, endNode) {
    const steps = [];
    const queue = [startNode];
    const visited = new Set();

    while (queue.length > 0) {
        const node = queue.shift();
        if (visited.has(node)) continue;

        visited.add(node);
        steps.push({ type: 'visit', node: node });

        if (node === endNode) break;

        const neighbors = getNeighbors(grid, node);
        for (const neighbor of neighbors) {
            if (!visited.has(neighbor)) {
                queue.push(neighbor);
                steps.push({ type: 'enqueue', node: neighbor });
            }
        }
    }

    return steps;
}

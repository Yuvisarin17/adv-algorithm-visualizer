// Helper functions
function getAllNodes(grid) {
    const nodes = [];
    for (const row of grid) {
        for (const node of row) {
            nodes.push(node);
        }
    }
    return nodes;
}

function sortNodesByDistance(unvisitedNodes) {
    unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
}

function updateUnvisitedNeighbors(node, grid) {
    const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
    for (const neighbor of unvisitedNeighbors) {
        neighbor.distance = node.distance + 1;
        neighbor.previousNode = node;
    }
}

function updateUnvisitedNeighborsAStar(node, grid, endNode) {
    const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
    for (const neighbor of unvisitedNeighbors) {
        const tentativeDistance = node.distance + 1;
        if (tentativeDistance < neighbor.distance) {
            neighbor.distance = tentativeDistance;
            neighbor.heuristic = manhattanDistance(neighbor, endNode);
            neighbor.fScore = neighbor.distance + neighbor.heuristic;
            neighbor.previousNode = node;
        }
    }
}

function getUnvisitedNeighbors(node, grid) {
    const neighbors = [];
    const { col, row } = node;
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
    return neighbors.filter(neighbor => !neighbor.isVisited);
}

function manhattanDistance(nodeA, nodeB) {
    return Math.abs(nodeA.row - nodeB.row) + Math.abs(nodeA.col - nodeB.col);
}

// Main algorithms
export function dijkstra(grid, startNode, endNode) {
    const visitedNodes = [];
    const unvisitedNodes = getAllNodes(grid);
    startNode.distance = 0;

    while (unvisitedNodes.length) {
        sortNodesByDistance(unvisitedNodes);
        const closestNode = unvisitedNodes.shift();
        
        if (closestNode.cellType === 'wall') continue;
        if (closestNode.distance === Infinity) break;
        
        closestNode.isVisited = true;
        visitedNodes.push(closestNode);
        
        if (closestNode === endNode) break;
        
        updateUnvisitedNeighbors(closestNode, grid);
    }
    
    return visitedNodes;
}

export function aStar(grid, startNode, endNode) {
    const visitedNodes = [];
    const unvisitedNodes = getAllNodes(grid);
    
    startNode.distance = 0;
    startNode.heuristic = manhattanDistance(startNode, endNode);
    startNode.fScore = startNode.distance + startNode.heuristic;

    while (unvisitedNodes.length) {
        unvisitedNodes.sort((a, b) => (a.fScore || Infinity) - (b.fScore || Infinity));
        const closestNode = unvisitedNodes.shift();
        
        if (closestNode.cellType === 'wall') continue;
        if (closestNode.distance === Infinity) break;
        
        closestNode.isVisited = true;
        visitedNodes.push(closestNode);
        
        if (closestNode === endNode) break;
        
        updateUnvisitedNeighborsAStar(closestNode, grid, endNode);
    }
    
    return visitedNodes;
}

export function bfs(grid, startNode, endNode) {
    const visitedNodes = [];
    const queue = [startNode];
    startNode.distance = 0;
    startNode.isVisited = true;

    while (queue.length) {
        const currentNode = queue.shift();
        visitedNodes.push(currentNode);
        
        if (currentNode === endNode) break;
        
        const neighbors = getUnvisitedNeighbors(currentNode, grid);
        for (const neighbor of neighbors) {
            if (neighbor.cellType === 'wall') continue;
            
            neighbor.distance = currentNode.distance + 1;
            neighbor.previousNode = currentNode;
            neighbor.isVisited = true;
            queue.push(neighbor);
        }
    }
    
    return visitedNodes;
}
// Graph Module


/**
 * Create a graph (Tree like structure)
 * - The `Nodes` on the graph will represent the different
 * cells on the Gameboard. `Node` A and B will be connected if
 * the Knight can move from A to B in a single move. So the branches
 * in the graph will be the path a Knight can make on the board
 */
class Graph {
	/**
	 * Construct a `Graph` to connect the spaces a knight
	 * can move to in chess
	 *
	 * @param {Array[]} [arr] A triple nested Array
	 * - see {@link createPaths}
	 */
	constructor(arr = []) {
		if (arr.length == 0) {
			this.nodes = createPaths();
		} else {
			this.nodes = createPaths(arr);
		}
	}

	/**
	 * Find the shortest path from `start` to `end`
	 *
	 * @param {Node} start Starting point
	 * @param {Node} end Ending point
	 * - Where you want to go
	 * @param {Array} [queue] Queue to search through graph
	 * - For recursion
	 * @param {number} [dist] Distance from Starting Node
	 *
	 * @return {Array} Array of coordinates
	 */
	getPath = (start, end, queue = []) => {
		// If this is the first call
		if (start instanceof Node) start = {node: start, distance: 0, prev: null};
		const dist = start.distance + 1;

		// Base Case - WIP - Else visit node
		if (start.node == end) return start;
		else start.node.visited = true;

		// Enqueue possible moves
		for (const move in start.node) {
			// Filter through unwanted properties
			if (move !== 'coord' && move !== 'visited' && start.node[move] !== null) {
				// If node is not visited
				if (!start.node[move].visited) {
					// Save the node, distance, and previous node and push to queue
					// ***important note*** Previous node is saved
					queue.push({
						node: start.node[move],
						distance: dist,
						prev: start,
					});
				}
			}
		}

		/* After traversing through the graph and the 'end' is found,
		This will be an object thats 'linked' to the previous Nodes in the graph,
		like a backwards linked list */
		const link = this.breadthFirst(queue.shift(), end, queue);
		// If the Nodes are already iterated through/path is saved, return it
		if (link instanceof Array) return link;

		/* Iterate through the path taken starting from the ending node
		and working backwards till you get to starting node */
		const path = [];
		let previous = link.prev;
		let current = link;
		for (let distance = link.distance; distance >= 0; distance--) {
			if (link.node !== end) break; // Error check

			// Work backwards and push the path to array
			if (distance == current.distance) {
				path.push(current.node.coord);
				if (current.prev === null) break;
				// Rotate vars
				current = previous;
				previous = current.prev;
			} else {
				// Error check
				console.error('Distances dont match, check log');
			}
		}

		return path.reverse();
	};
}

/**
 * Create and 'link' the paths of the `Nodes` in `arr`
 * - Creates the `Nodes` if no `arr` is given
 *
 * @param {Array} [arr] - Tripple nested Arrays
 * - First level of Array: Represent the 'Rows' on the gameboard (Y)
 * - Second level of Arrays: Represent the 'cells' in the rows (X)
 * @param {Object} [node] - Current Node to create paths for
 * - Recursive
 * @param {Number[]} node.coord - Coordinates of Node
 *
 * @return {Array} `arr`
 */
const createPaths = (arr = [], node) => {
	// If no array is given, create it
	if (arr.length === 0) {
		// Loop 8 times to create 8 rows (Y Coord)
		for (let y = 0; y < 8; y++) {
			const row = [];
			// Loop 8 times to create the 8 Nodes/Cells inside the rows
			for (let x = 0; x <= 8; x++) {
				const cell = new Node([x, y]);
				row.push(cell);
			}

			arr.push(row); // Push row to arr after the cells are added
		}
	}

	if (node == undefined) node = arr[0][0];

	// Create paths
	/* Check if `Node` X coord + 1 and Y coord + 2 are less than 8
	(meaning if the Knight moves there it would still be on the gameboard),
	If so, Link the 2 spaces to One o'clock position on `Node` */
	if (node.coord[0] + 1 < 8 && node.coord[1] + 2 < 8) {
		node.one = arr[node.coord[1] + 2][node.coord[0] + 1];
	}

	// Two o'clock position
	if (node.coord[0] + 2 < 8 && node.coord[1] + 1 < 8) {
		node.two = arr[node.coord[1] + 1][node.coord[0] + 2];
	}

	// Four o'clock position
	if (node.coord[0] + 2 < 8 && node.coord[1] - 1 >= 0) {
		node.four = arr[node.coord[1] - 1][node.coord[0] + 2];
	}

	// Five o'clock position
	if (node.coord[0] + 1 < 8 && node.coord[1] - 2 >= 0) {
		node.five = arr[node.coord[1] - 2][node.coord[0] + 1];
	}

	// Seven o'clock position
	if (node.coord[0] - 1 >= 0 && node.coord[1] - 2 >= 0) {
		node.seven = arr[node.coord[1] - 2][node.coord[0] - 1];
	}

	// Eight o'clock position
	if (node.coord[0] - 2 >= 0 && node.coord[1] - 1 >= 0) {
		node.eight = arr[node.coord[1] - 1][node.coord[0] - 2];
	}

	// Ten o'clock position
	if (node.coord[0] - 2 >= 0 && node.coord[1] + 1 < 8) {
		node.ten = arr[node.coord[1] + 1][node.coord[0] - 2];
	}

	// Eleven o'clock position
	if (node.coord[0] - 1 >= 0 && node.coord[1] + 2 < 8) {
		node.eleven = arr[node.coord[1] + 2][node.coord[0] - 1];
	}

	// If node is not the last in its row
	if (node != arr[node.coord[1]][7]) {
		// Recursively call on next node in the row
		createPaths(arr, arr[node.coord[1]][node.coord[0] + 1]);
	// Else If node is not the last in the array
	} else if (node != arr[7][7]) {
		// Recursively call on first node in next row
		createPaths(arr, arr[node.coord[1] + 1][0]);
	}

	// Return array
	return arr;
};

/**
 * Class representing the individual vertices or `Node`s on
 * the `Graph`
 * - Each `Cell` on the Gameboard will have a `Node`
 * - The `Node`s will branch out and connect to other Nodes that the
 * Knight can move to from that space
 */
class Node {
	/**
	 * Node/vertex constructor
	 * @param {number[]} coords An array of x, y coordinates
	 * representing the position on the gameboard
	 * - [x, y]
	 */
	constructor(coords) {
		this.coord = coords;
		this.visited = false;
		/* Below will be the different branches a node can have
		- The names will be the position on a clock face
		- The different moves a Knight can make are at
		positions on a clock face
		- `this.one` will be equal to a move at one o'clock, `this.two` two o'clock,
		etc.
		- There are a total of 8 positions a Knight can move, skipping
		the 3, 6, 9, and 12 o'clock positions on a clock */
		this.one = null;
		this.two = null;
		this.four = null;
		this.five = null;
		this.seven = null;
		this.eight = null;
		this.ten = null;
		this.eleven = null;
	}
}

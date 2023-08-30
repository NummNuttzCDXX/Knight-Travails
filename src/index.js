/* Knight Travails
Start: 8/22/23 */

import {Graph, Node} from './graph';
import {dom} from './dom';


// Create `Graph` Array from gameboard cells
const board = [];
const rowElements = Array.from(document.querySelectorAll('.row')).reverse();
// Loop through 'rows'
// Also add ID's to elements
for (let y = 0; y < 8; y++) {
	const rowContainer = rowElements[y];
	rowContainer.id = y;

	const row = []; // Create row array
	const cells = Array.from(rowContainer.children);
	// Inner loop to get cells inside each row
	for (let x = 0; x < 8; x++) {
		cells[x].id = x;

		const node = new Node([x, y], cells[x]);
		row.push(node);
	}

	board.push(row);
};
const graph = new Graph(board);

// Place Knight
let start;
const placeKnightBtn = document.querySelector('.place');
placeKnightBtn.addEventListener('click', () => {
	const spaces = document.querySelectorAll('.cell');
	spaces.forEach((space) => {
		space.addEventListener('click', function place() {
			// If theres no knight
			if (!document.querySelector('.knight')) {
				dom.placeKnight(space); // Place Knight Img

				// Save start point, convert starting `cell` to corrosponding `Node`
				start = graph.convertElementToNode(space);
			}
		});
	});
});

// Place Endpoint
let end;
const endpointBtn = document.querySelector('.end');
endpointBtn.addEventListener('click', () => {
	const cells = document.querySelectorAll('.cell'); // Get cells
	// Place 'X' on cell when its clicked
	cells.forEach((cell) => cell.addEventListener('click', () => {
		// If theres no endpoint
		if (!document.querySelector('.endpoint')) {
			dom.placeEndpoint(cell); // Place endpoint

			// Save endpoint, convert end `cell` to corrosponding `Node`
			end = graph.convertElementToNode(cell);

			// Get moves
			const path = graph.getPath(start, end);

			// Animate Knight
			dom.animateKnight(path[0], path);
		}
	}));
});

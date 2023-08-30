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
export const graph = new Graph(board);

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
		}
	}));
});

// Random Endpoint
const randomPoint = document.querySelector('.random-end');
randomPoint.addEventListener('click', () => {
	if (!document.querySelector('.endpoint')) {
		const x = Math.floor(Math.random() * 7); // Get random X
		const y = Math.floor(Math.random() * 7); // Get random Y
		const cell = rowElements[y].children[x]; // Find cell

		end = graph.convertElementToNode(cell); // Save and convert cell to node

		dom.placeEndpoint(cell); // Place endpoint
	}
});

// Move Knight once both Start and Endpoints are on the board
const gameboard = document.querySelector('.gameboard');
// Signifies if Knight and Endpoint is on the board
let k = false;
let e = false;
const observer = new MutationObserver((records) => {
	records.forEach((record) => {
		const added = Array.from(record.addedNodes);

		// If Knight is added
		if (added.includes(document.querySelector('.knight'))) k = true;

		// If endpoint is added
		if (added.includes(document.querySelector('.endpoint'))) e = true;

		// If both are on the board, move knight and reset vars
		if (k && e) {
			dom.knightMoves(start, end);
			k = false;
			e = false;
		}
	});
});

observer.observe(gameboard, {childList: true, subtree: true});

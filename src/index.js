/* Knight Travails
Start: 8/22/23 */

import {Graph, Node} from './graph';
import {dom} from './dom';


// Make sure width == height (depending on screen size)
dom.checkBoardSize();

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
const btns = document.querySelectorAll('.console button');
const placeKnightBtn = document.querySelector('.place');
placeKnightBtn.addEventListener('click', () => {
	// Disable other buttons
	btns.forEach((btn) => {
		if (btn != placeKnightBtn && btn != resetBtn) {
			btn.disabled = true;
		}
	});

	// If there is a knight on the board, remove it
	const knight = document.querySelector('.knight');
	const endpoint = document.querySelector('.endpoint');
	if (knight && endpoint) dom.resetBoard();
	else if (knight) knight.remove();

	const spaces = document.querySelectorAll('.cell');
	spaces.forEach((space) => {
		space.addEventListener('click', function place() {
			// If theres no knight
			if (!document.querySelector('.knight')) {
				// Save start point, convert starting `cell` to corrosponding `Node`
				start = graph.convertElementToNode(space);

				dom.placeKnight(space); // Place Knight Img

				// Enable btns
				btns.forEach((btn) => {
					btn.disabled = false;
				});
			}
		});
	});
});

// Random Knight
const randomKnight = document.querySelector('.place-random');
randomKnight.addEventListener('click', () => {
	// If there is a knight on the board, remove it
	const knight = document.querySelector('.knight');
	const endpoint = document.querySelector('.endpoint');
	if (knight && endpoint) dom.resetBoard();
	else if (knight) knight.remove();

	if (!document.querySelector('.knight')) {
		const rows = document.querySelectorAll('.row');
		const x = Math.floor(Math.random() * 7);
		const y = Math.floor(Math.random() * 7);
		const cell = rows[y].children[x];

		start = graph.convertElementToNode(cell);
		dom.placeKnight(cell);
	}
});

// Place Endpoint
let end;
const endpointBtn = document.querySelector('.end');
endpointBtn.addEventListener('click', () => {
	// Disable other buttons
	btns.forEach((btn) => {
		if (btn != endpointBtn && btn != resetBtn) {
			btn.disabled = true;
		}
	});

	// If there is an endpoint on the board, remove it
	const knight = document.querySelector('.knight');
	const endpoint = document.querySelector('.endpoint');
	if (knight && endpoint) dom.resetBoard();
	else if (endpoint) endpoint.remove();

	const cells = document.querySelectorAll('.cell'); // Get cells
	// Place 'X' on cell when its clicked
	cells.forEach((cell) => cell.addEventListener('click', () => {
		// If theres no endpoint
		if (!document.querySelector('.endpoint')) {
			dom.placeEndpoint(cell); // Place endpoint

			// Save endpoint, convert end `cell` to corrosponding `Node`
			end = graph.convertElementToNode(cell);

			// Enable btns
			btns.forEach((btn) => btn.disabled = false);
		}
	}));
});

// Random Endpoint
const randomPoint = document.querySelector('.random-end');
randomPoint.addEventListener('click', () => {
	// If there is a knight on the board, remove it
	const knight = document.querySelector('.knight');
	const endpoint = document.querySelector('.endpoint');
	if (knight && endpoint) dom.resetBoard();
	else if (endpoint) endpoint.remove();

	if (!document.querySelector('.endpoint')) {
		const rows = document.querySelectorAll('.row');
		const x = Math.floor(Math.random() * 7); // Get random X
		const y = Math.floor(Math.random() * 7); // Get random Y
		const cell = rows[y].children[x]; // Find cell

		end = graph.convertElementToNode(cell); // Save and convert cell to node

		dom.placeEndpoint(cell); // Place endpoint
	}
});

// Move Knight once both Start and Endpoints are on the board
const gameboard = document.querySelector('.gameboard');
// Signifies if Knight and Endpoint is on the board
let k = false;
let e = false;
export const observer = new MutationObserver((records) => {
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

// Observe/Listen for Knight and Endpoint to be placed
observer.observe(gameboard, {childList: true, subtree: true});

// Reset Board
const resetBtn = document.querySelector('.reset');
resetBtn.addEventListener('click', dom.resetBoard);

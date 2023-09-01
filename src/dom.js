// Dom Manipulation Module
import knight from '../dist/assets/img/Chess-Knight.svg';
import close from '../dist/assets/img/close.svg';
import {graph, observer} from './index';


export const dom = (() => {
	/**
	 * Display the moves a Knight should take to get from
	 * `start` to `end`
	 * - This should be called once a `Start` point and an `Endpoint`
	 * are placed on the board
	 *
	 * @param {Node} start Starting Node
	 * @param {Node} end Ending Node
	 */
	const knightMoves = (start, end) => {
		const path = graph.getPath(start, end);
		animateKnight(path[0], path);
	};

	/**
	 * Place Knight image on the gameboard
	 * at `space`
	 *
	 * @param {HTMLDivElement} space The space to place the Knight
	 */
	const placeKnight = (space) => {
		// If there isnt a Knight already on the board
		if (!document.querySelector('.knight')) {
			// Create Knight Img
			const img = new Image();
			img.src = knight;
			img.alt = 'Knight';
			img.classList.add('knight');

			// Size and place Knight
			const width = space.clientWidth; // Get cell's width in px
			img.style.left = `${width * space.id}px`;
			img.style.bottom = `${width * space.parentElement.id}px`;
			img.style.height = (width + (width / 3)) + 'px';

			// Append Knight to gameboard
			// Knight is positioned 'relative' to .gameboard
			space.parentElement.parentElement.appendChild(img);
		}
	};

	/**
	 * Place an X on the endpoint
	 * - Where you want the Knight to go
	 *
	 * @param {HTMLDivElement} space Cell to place endpoint
	 */
	const placeEndpoint = (space) => {
		// If there isnt already an Endpoint placed
		if (!document.querySelector('.endpoint')) {
			// Create endpoint
			const img = new Image();
			img.src = close;
			img.alt = 'Endpoint';
			img.classList.add('endpoint');
			img.style.width = space.clientWidth - 20 + 'px';

			// Add img to cell
			space.appendChild(img);
		}
	};

	/**
	 * Animate the Knight to move from `start` to `end`,
	 * taking the quickest path
	 *
	 * @param {Number[]} current Current coordinate
	 * @param {Array[]} path  Array of Coordinates representing the path you
	 * should take
	 * @param {Number} [i]
	 */
	const animateKnight = (current, path, i = 1) => {
		if (i === path.length) return;
		const knight = document.querySelector('.knight'); // Get Knight
		const width = document.querySelector('.cell').clientWidth; // Get width

		const next = path[i]; // Get next node
		// Get the 'left' and 'bottom' props off Knight, just the number of pxs
		const knightLeft = Number(knight.style.left.replace(/px/, ''));
		const knightBottom = Number(knight.style.bottom.replace(/px/, ''));

		// Wait half a second and move X coord
		sleep(500).then(() => {
			/* Compare current position and the next X coord
			If next X is current X + 1 */
			if (next[0] === current[0] + 1) {
			// Add one spaces worth of pixels to 'left' prop
			// Sliding the knight one space to the left
				knight.style.left = knightLeft + width + 'px';
			} else if (next[0] === current[0] - 1) {
			// Slide Knight one space to the right
				knight.style.left = knightLeft - width + 'px';
			} else if (next[0] === current[0] + 2) {
			// Slide Knight 2 spaces to the left
				knight.style.left = knightLeft + (width * 2) + 'px';
			} else if (next[0] === current[0] - 2) {
			// Slide Knight 2 spaces to the right
				knight.style.left = knightLeft - (width * 2) + 'px';
			} else {
				console.error('Error animating X coord');
			}
		}).then(() => {
			return sleep(500); // Wait half a second then move Y coord
		}).then(() => {
			/* Compare current position and the next Y coord
			If next Y is current Y + 1 */
			if (next[1] === current[1] + 1) {
			// Slide Knight one space up
				knight.style.bottom = knightBottom + width + 'px';
			} else if (next[1] === current[1] - 1) {
				knight.style.bottom = knightBottom - width + 'px';
			} else if (next[1] === current[1] + 2) {
				knight.style.bottom = knightBottom + (width * 2) + 'px';
			} else if (next[1] === current[1] - 2) {
				knight.style.bottom = knightBottom - (width * 2) + 'px';
			} else {
				console.error('Error animating Y coord');
			}
		}).then(() => {
			return sleep(500); // Wait half a second
		// Then animate next move through recursion
		}).then(() => {
			// Put move number inside `Cell` on gameboard
			graph.getNodeFromCoord(next).cell
				.querySelector('span').textContent = i;

			animateKnight(next, path, ++i);
		}).catch(() => {
			console.error('Error animating Knight');
		});

		/**
			 * Sleep for `milliseconds` long
			 * - Pause the execution of code for the specified time
			 *
			 * @param {Number} ms Milliseconds to pause for
			 *
			 * @return {Promise}
			 */
		function sleep(ms) {
			return new Promise((resolve) => setTimeout(resolve, ms));
		}
	};

	/** Reset the Gameboard */
	const resetBoard = () => {
		// Remove Knight
		const knight = document.querySelector('.knight');
		if (knight) knight.remove();

		// Remove Endpoint
		const endpoint = document.querySelector('.endpoint');
		if (endpoint) endpoint.remove();

		// Remove Move Numbers inside cells
		const cells = document.querySelectorAll('.cell');
		cells.forEach((cell) => cell.querySelector('span').textContent = '');

		// Clone and replace Gameboard to remove all event listeners from Cells
		const oldBoard = document.querySelector('.gameboard');
		const newBoard = oldBoard.cloneNode(true);
		oldBoard.replaceWith(newBoard);
		checkBoardSize(); // Make width == height if they are not

		// Observe new Gameboard
		observer.observe(newBoard, {childList: true, subtree: true});

		// Relink Nodes to new Cells
		graph.linkToElements();

		// Enable btns
		document.querySelectorAll('.console button').forEach((btn) => {
			btn.disabled = false;
		});
	};

	/**
	 * Check if the width and height of the board are the same
	 * - If they are different, make the height match the width
	 * (width should be 50vw)
	 */
	const checkBoardSize = () => {
		const board = document.querySelector('.gameboard');
		const height = board.clientHeight; // Get Height
		const width = board.clientWidth; // Get Width

		// If they're not equal, make them equal
		if (width > height) board.style.width = height + 'px';
		else if (height > width) board.style.height = width + 'px';
	};

	return {placeKnight, placeEndpoint, knightMoves, resetBoard, checkBoardSize};
})();

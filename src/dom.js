// Dom Manipulation Module
import knight from '../dist/assets/img/Chess-Knight.svg';
import close from '../dist/assets/img/close.svg';


export const dom = (() => {
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
			img.style.width = space.clientWidth - 5 + 'px';

			// Add img to cell
			space.appendChild(img);
		}
	};

	return {placeKnight, placeEndpoint};
})();

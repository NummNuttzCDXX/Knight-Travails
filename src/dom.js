// Dom Manipulation Module
import knight from '../dist/assets/img/Chess-Knight.svg';


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

	return {placeKnight};
})();

import { authObj, fbdb } from '../index.js';

const terms = document.querySelectorAll('.terms');
terms.forEach(item => {
  item.addEventListener('click', (e) => {
	e.preventDefault();
	document.getElementById("bdsmain").innerHTML = '<h4>Terms</h4>';
  })
});
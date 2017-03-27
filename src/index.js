var fonts = require('./font').fonts;
import {hexToColor, getBgColor, getNewColor} from './color';
import createHash from 'sha.js';

const sha256 = createHash("sha256");

const svgEl = ()=>{
	return document.createElementNS("http://www.w3.org/2000/svg", "svg");
}

export function newWord(word) {
	const hash = sha256.update(word.Word, 'utf8').digest('hex');
	window.location.hash = "#" + word.Word + '&' + hash;
}

function UpdateLogo() {
	const word = location.hash.indexOf("&") !== -1
					? location.hash.substr(1, location.hash.indexOf("&")-1)
					: location.hash.substr(1);
	var parentDiv = document.getElementById("text");

	// Get a new bg color
	var bgColor = getBgColor();
	parentDiv.style.backgroundColor = hexToColor(bgColor);

	var newColor = getNewColor(bgColor);

	// Font
	var choosenFont = Math.floor(Math.random()*fonts.length);

	if(typeof fonts[choosenFont].loaded == 'undefined') {
		var link = document.createElement("link");
		link.href="https://fonts.googleapis.com/css?family=" + fonts[choosenFont].name.split(' ').join('+');
		link.rel="stylesheet"
			document.body.appendChild(link);
		fonts[choosenFont].loaded = true;
	}

	var svg = svgEl();
	var textSvg = document.createElementNS(svg.namespaceURI, "text");
	textSvg.setAttributeNS(null, "x", 0);
	textSvg.setAttributeNS(null, "y", 25);
	textSvg.setAttributeNS(null, "fill", hexToColor(newColor));
	textSvg.setAttributeNS(null, "font-family", fonts[choosenFont].name);
	svg.appendChild(textSvg);
	textSvg.appendChild(document.createTextNode(word));

	parentDiv.innerHTML="";
	parentDiv.appendChild(svg);
}

const getNewWord = () => {
	var s=document.createElement("script");
	s.type="text/javascript";
	s.src="http://www.setgetgo.com/randomword/get.php?callback=app.newWord&rand="
			+ (new Date()).getTime();
	document.body.appendChild(s);
}

window.onload = function() {
	window.onkeydown = function(e){
		if(e.keyCode == 32){
			getNewWord();
		}
		
		// Prevent scrolling
		if(e.keyCode == 32 || e.which == 32) {
			e.preventDefault();
			return 0;
		}
	}

	window.onhashchange = UpdateLogo;
	if(window.location.hash !== "")
		UpdateLogo();

	// Register finger swipe gesture
	document.addEventListener('touchstart', handleTouchStart, false);        
	document.addEventListener('touchmove', handleTouchMove, false);

	var xDown = null;                                                        
	var yDown = null;                                                        

	function handleTouchStart(evt) {                                         
	    xDown = evt.touches[0].clientX;                                      
	    yDown = evt.touches[0].clientY;                                      
	};                                                

	function handleTouchMove(evt) {
	    if ( ! xDown || ! yDown )
	    	return;

	    var xUp = evt.touches[0].clientX;                                    
	    var yUp = evt.touches[0].clientY;

	    var xDiff = xDown - xUp;
	    var yDiff = yDown - yUp;

	    if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
	        if ( xDiff > 0 ) {
	            /* left swipe */ 
	            getNewWord();
	        }                      
	    }
	    /* reset values */
	    xDown = null;
	    yDown = null;                                             
	};

};

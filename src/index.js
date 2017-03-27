var fonts = require('./font').fonts;
import {hexToColor, getBgColor, getNewColor} from './color';

const svgEl = ()=>{
	return document.createElementNS("http://www.w3.org/2000/svg", "svg");
}

export function newWord(word) {
	window.location.hash = "#" + word.Word;
}

function UpdateLogo() {
	const word = location.hash.substr(1);
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

window.onload = function() {
	window.onkeydown = function(e){
		if(e.keyCode == 32){
			var s=document.createElement("script");
			s.type="text/javascript";
			s.src="http://www.setgetgo.com/randomword/get.php?callback=app.newWord&rand="
						+ (new Date()).getTime();
			document.body.appendChild(s);
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
};

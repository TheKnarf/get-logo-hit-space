var fonts = require('./font').fonts;
import {hexToColor, getBgColor, getNewColor} from './color';
import createHash from 'sha.js';
import {shave} from './random.js'

const sha256 = createHash("sha256");

const $ = (type="svg", args={})=>{
	if(type=="svg")
		var svgEl = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	else 
		var svgEl = document.createElementNS(args.svg.namespaceURI, type);

	Object.keys(args).forEach((key,index) => {
	    svgEl.setAttributeNS(null, key, args[key]);
	});

	return svgEl;
}

const square = (point1, point2, stroke) => {
	return [
		[
			{x: point1.x, y: point1.y + stroke / 2},
			{x: point2.x, y: point1.y + stroke / 2}
		],
		[
			{x: point2.x - stroke / 2, y: point1.y},
			{x: point2.x - stroke / 2, y: point2.y}
		],
		[
			{x: point2.x, y: point2.y - stroke / 2},
			{x: point1.x, y: point2.y - stroke / 2}
		],
		[
			{x: point1.x + stroke / 2, y: point2.y},
			{x: point1.x + stroke / 2, y: point1.y}
		]
	];
}

export function newWord(word) {
	const hash = sha256.update(word.Word, 'utf8').digest('hex');
	window.location.hash = "#" + word.Word + '&' + hash;
}

function UpdateLogo() {
	// Get word from browser-hash-url
	const word = location.hash.indexOf("&") !== -1
					? location.hash.substr(1, location.hash.indexOf("&")-1)
					: location.hash.substr(1);

	// Get the 256-hash of the word used for random data
	const hash = location.hash.indexOf("&") !== -1
					? location.hash.substr(location.hash.indexOf("&")+1)
					: sha256.update(word, 'utf8').digest('hex');;

	var parentDiv = document.getElementById("text");

	// Get a new bg color
	var random = shave(hash, 16777216);
	
	const bgColor = getBgColor(random.normalized);
	//parentDiv.style.backgroundColor = hexToColor(bgColor);

	const newColor = getNewColor(bgColor);

	// Font
	random = shave(random, fonts.length);
	var choosenFont = Math.floor(random.result);

	if(typeof fonts[choosenFont].loaded == 'undefined') {
		var link = document.createElement("link");
		link.href="https://fonts.googleapis.com/css?family=" + fonts[choosenFont].name.split(' ').join('+');
		link.rel="stylesheet"
			document.body.appendChild(link);
		fonts[choosenFont].loaded = true;
	}

	const svg_width = 500, svg_height = 500;

	var svg = $("svg");
	svg.style.width = svg_width + "px";
	svg.style.height = svg_height + "px";
	svg.style.backgroundColor = hexToColor(bgColor);
	const text = $("text", {
		"svg": svg,
		"x" : 0,
		"y" : 25,
		"fill" : hexToColor(newColor),
		"font-family": fonts[choosenFont].name
	});
	svg.appendChild(text).appendChild(document.createTextNode(word));

	parentDiv.innerHTML="";
	parentDiv.appendChild(svg);

	console.log(text.getBBox());

	text.setAttributeNS(null, "x", (svg_width - text.getBBox().width)/2 + "px");
	text.setAttributeNS(null, "y", (svg_height - text.getBBox().height)/2 + "px");

	const g = svg.appendChild(
		$("g", {
			svg,
			stroke: hexToColor(newColor)
		})
	);

	const stroke=10;
	square({x: 100, y: 100}, {x: 300, y: 300}, stroke).forEach(line => {
		g.appendChild($("line", {
			svg,
			"x1": line[0].x,
			"y1": line[0].y,
			"x2": line[1].x,
			"y2": line[1].y,
			"stroke-width": stroke
		}));
	});

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

var fonts = require('./font').fonts;
import {hexToColor, getBgColor, getNewColor} from './color';
import createHash from 'sha.js';
import {shave} from './random.js'
import * as d3 from 'd3';
import ClipperLib from 'js-clipper';

const sha256 = createHash("sha256");

const square = (point1, point2, stroke) => {
	const outerSquare = [
		{X: point1.X, Y: point1.Y},
		{X: point2.X, Y: point1.Y},
		{X: point2.X, Y: point2.Y},
		{X: point1.X, Y: point2.Y}
	];

	if(stroke==0)
		return [outerSquare];

	return [
		outerSquare,
		[
			{X: point1.X + stroke, Y: point1.Y + stroke},
			{X: point2.X - stroke, Y: point1.Y + stroke},
			{X: point2.X - stroke, Y: point2.Y - stroke},
			{X: point1.X + stroke, Y: point2.Y - stroke}
		]
	];
}

export function newWord(word) {
	const hash = sha256.update(word.Word, 'utf8').digest('hex');
	window.location.hash = "#" + word.Word + '&' + hash;
}

/* Converts Paths to SVG path string
 *
 * and scales down the coordinates
 * from http://jsclipper.sourceforge.net/6.1.3.1/index.html?p=starter_boolean.html
 */
const paths2string = (paths, scale) => {
	var i, p, path, svgpath, _j, _len2, _len3;
	svgpath = '';
	if (!(scale != null)) scale = 1;
	for (_j = 0, _len2 = paths.length; _j < _len2; _j++) {
		path = paths[_j];
		for (i = 0, _len3 = path.length; i < _len3; i++) {
			p = path[i];
			if (i === 0) {
				svgpath += 'M';
			} else {
				svgpath += 'L';
			}
			svgpath += p.X / scale + ", " + p.Y / scale;
		}
		svgpath += 'Z';
	}
	if (svgpath === '') svgpath = 'M0,0';
	return svgpath;
};

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

	parentDiv.innerHTML="";
	const svg = d3	.select(parentDiv)
					.append('svg')
					.attr('width', svg_width)
					.attr('height', svg_height)
					.style('background-color', hexToColor(bgColor));

	const text = svg
					.append('text')
					.attr('x', svg_height/2)
					.attr('y', svg_width/2)
					.attr('text-anchor', 'middle')
					.attr('alignment-baseline', 'central')
					.style('fill', hexToColor(newColor))
					.style('font-family', fonts[choosenFont].name)
					.text(word);

	const textBB = text.node().getBBox();
	const textSquare = square(
		{X: textBB.x, Y: textBB.y},
		{X: textBB.x + textBB.width, Y: textBB.y + textBB.height},
		0
	);

	const outerSquare = square(
		{X: 100, Y: 100},
		{X: 300, Y: 300},
		10
	);
	console.log(outerSquare, textSquare);

	const cpr = new ClipperLib.Clipper();

	cpr.AddPaths(
		outerSquare,
		ClipperLib.PolyType.ptSubject,
		true
	);
	cpr.AddPaths(
		textSquare,
		ClipperLib.PolyType.ptClip,
		true
	);

	var solution_paths = new ClipperLib.Paths();
    var succeeded = cpr.Execute(
    	ClipperLib.ClipType.ctDifference,
    	solution_paths,
    	ClipperLib.PolyFillType.pftNonZero,
    	ClipperLib.PolyFillType.pftNonZero
	);
    if (!succeeded) throw new Error('Clipper operation failed!');

    svg
    	.append('g')
    	.attr('fill', hexToColor(newColor))
    	.selectAll('path')
    	.data([solution_paths])
    	.enter()
    	.append('path')
    	.attr('d', (d) => {
	    	return paths2string(d);
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

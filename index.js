var app =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
var hexToColor = exports.hexToColor = function hexToColor(hex) {
	return "#" + ("000000" + hex.toString(16)).substr(-6);
};

var getBgColor = exports.getBgColor = function getBgColor() {
	return Math.floor(Math.random() * 0xFFFFFF);
};

var getNewColor = exports.getNewColor = function getNewColor(oldColor) {
	// TODO: this is a horrible algorithm for choosing an oposite color
	// find somehting better: http://softwareengineering.stackexchange.com/questions/44929/color-schemes-generation-theory-and-algorithms
	// http://serennu.com/colour/rgbtohsl.php
	var value = (oldColor & 0x0F) << 4 | (oldColor & 0xF0) >> 4;
	return (value & 0x33) << 2 | (value & 0xCC) >> 2;
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
var fonts = exports.fonts = [{ name: "Roboto" }, { name: "Open Sans" }, { name: "Josefin Slab" }, { name: "Arvo" }, { name: "Lato" }, { name: "Abril Fatface" }, { name: "Ubuntu" }, { name: "PT Sans" }, { name: "Old Standard TT" }, { name: "Droid Sans" }, { name: "Sansita" }];

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.newWord = newWord;

var _color = __webpack_require__(0);

var fonts = __webpack_require__(1).fonts;


var svgEl = function svgEl() {
	return document.createElementNS("http://www.w3.org/2000/svg", "svg");
};

function newWord(word) {
	window.location.hash = "#" + word.Word;
}

function UpdateLogo() {
	var word = location.hash.substr(1);
	var parentDiv = document.getElementById("text");

	// Get a new bg color
	var bgColor = (0, _color.getBgColor)();
	parentDiv.style.backgroundColor = (0, _color.hexToColor)(bgColor);

	var newColor = (0, _color.getNewColor)(bgColor);

	// Font
	var choosenFont = Math.floor(Math.random() * fonts.length);

	if (typeof fonts[choosenFont].loaded == 'undefined') {
		var link = document.createElement("link");
		link.href = "https://fonts.googleapis.com/css?family=" + fonts[choosenFont].name.split(' ').join('+');
		link.rel = "stylesheet";
		document.body.appendChild(link);
		fonts[choosenFont].loaded = true;
	}

	var svg = svgEl();
	var textSvg = document.createElementNS(svg.namespaceURI, "text");
	textSvg.setAttributeNS(null, "x", 0);
	textSvg.setAttributeNS(null, "y", 25);
	textSvg.setAttributeNS(null, "fill", (0, _color.hexToColor)(newColor));
	textSvg.setAttributeNS(null, "font-family", fonts[choosenFont].name);
	svg.appendChild(textSvg);
	textSvg.appendChild(document.createTextNode(word));

	parentDiv.innerHTML = "";
	parentDiv.appendChild(svg);
}

var getNewWord = function getNewWord() {
	var s = document.createElement("script");
	s.type = "text/javascript";
	s.src = "http://www.setgetgo.com/randomword/get.php?callback=app.newWord&rand=" + new Date().getTime();
	document.body.appendChild(s);
};

window.onload = function () {
	window.onkeydown = function (e) {
		if (e.keyCode == 32) {
			getNewWord();
		}

		// Prevent scrolling
		if (e.keyCode == 32 || e.which == 32) {
			e.preventDefault();
			return 0;
		}
	};

	window.onhashchange = UpdateLogo;
	if (window.location.hash !== "") UpdateLogo();

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
		if (!xDown || !yDown) return;

		var xUp = evt.touches[0].clientX;
		var yUp = evt.touches[0].clientY;

		var xDiff = xDown - xUp;
		var yDiff = yDown - yUp;

		if (Math.abs(xDiff) > Math.abs(yDiff)) {
			/*most significant*/
			if (xDiff > 0) {
				/* left swipe */
				getNewWord();
			}
		}
		/* reset values */
		xDown = null;
		yDown = null;
	};
};

/***/ })
/******/ ]);
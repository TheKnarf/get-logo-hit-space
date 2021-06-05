import { fonts } from "./font";
import { hexToColor, getBgColor, getNewColor } from "./color";
import createHash from "sha.js";
import { shave } from "./random.js";
import * as d3 from "d3";
import ClipperLib from "js-clipper";
import figlet from "figlet";
import { fonts as figlet_fonts } from "./figlet-fonts";
import "./CNAME";
import "./index.css";

import uniqueRandomArray from "unique-random-array";
import wordlist from "word-list/words.txt";
const randomWord = uniqueRandomArray(wordlist.split("\n"));

const sha256 = createHash("sha256");

const square = (point1, point2, stroke) => {
  const outerSquare = [
    { X: point1.X, Y: point1.Y },
    { X: point2.X, Y: point1.Y },
    { X: point2.X, Y: point2.Y },
    { X: point1.X, Y: point2.Y },
  ];

  if (stroke == 0) return [outerSquare];

  return [
    outerSquare,
    [
      { X: point1.X + stroke, Y: point1.Y + stroke },
      { X: point1.X + stroke, Y: point2.Y - stroke },
      { X: point2.X - stroke, Y: point2.Y - stroke },
      { X: point2.X - stroke, Y: point1.Y + stroke },
    ],
  ];
};

export function newWord(word) {
  const hash = sha256.update(word.Word, "utf8").digest("hex");
  window.location.hash = "#" + word.Word + "&" + hash;
}

/* Converts Paths to SVG path string
 *
 * and scales down the coordinates
 * from http://jsclipper.sourceforge.net/6.1.3.1/index.html?p=starter_boolean.html
 */
const paths2string = (paths, scale) => {
  var i, p, path, svgpath, _j, _len2, _len3;
  svgpath = "";
  if (!(scale != null)) scale = 1;
  for (_j = 0, _len2 = paths.length; _j < _len2; _j++) {
    path = paths[_j];
    for (i = 0, _len3 = path.length; i < _len3; i++) {
      p = path[i];
      if (i === 0) {
        svgpath += "M";
      } else {
        svgpath += "L";
      }
      svgpath += p.X / scale + ", " + p.Y / scale;
    }
    svgpath += "Z";
  }
  if (svgpath === "") svgpath = "M0,0";
  return svgpath;
};

function UpdateLogo() {
  // Get word from browser-hash-url
  const word =
    location.hash.indexOf("&") !== -1
      ? location.hash.substr(1, location.hash.indexOf("&") - 1)
      : location.hash.substr(1);

  // Get the 256-hash of the word used for random data
  const hash =
    location.hash.indexOf("&") !== -1
      ? location.hash.substr(location.hash.indexOf("&") + 1)
      : sha256.update(word, "utf8").digest("hex");

  var parentDiv = document.getElementById("text");

  // Get a new bg color
  var random = shave(hash, 16777216);

  const bgColor = getBgColor(random.normalized);
  parentDiv.style.backgroundColor = hexToColor(bgColor); // TODO: comment this away for debugging

  const newColor = getNewColor(bgColor);

  // Font
  random = shave(random, fonts.length);
  var choosenFont = Math.floor(random.result);

  if (typeof fonts[choosenFont].loaded == "undefined") {
    var link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css?family=" +
      fonts[choosenFont].name.split(" ").join("+");
    link.rel = "stylesheet";
    document.body.appendChild(link);
    fonts[choosenFont].loaded = true;
  }

  const svg_width = 500,
    svg_height = 500;

  parentDiv.innerHTML = "";
  const svg = d3
    .select(parentDiv)
    .append("svg")
    .attr("width", svg_width)
    .attr("height", svg_height)
    .style("background-color", hexToColor(bgColor));

  random = shave(random, 2);

  if (random.result == 0 && false) {
    const text = svg
      .append("text")
      .attr("x", svg_width / 2)
      .attr("y", svg_height / 2)
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "central")
      .style("fill", hexToColor(newColor))
      .style("font-family", fonts[choosenFont].name)
      .text(word);

    const textBB = text.node().getBBox();
    const textSquare = square(
      { X: textBB.x, Y: textBB.y },
      { X: textBB.x + textBB.width, Y: textBB.y + textBB.height },
      0
    );

    random = shave(random, 250);
    var osx1 = random.result;
    random = shave(random, 250);
    var osx2 = random.result + 250;
    random = shave(random, 250);
    var osy1 = random.result;
    random = shave(random, 250);
    var osy2 = random.result + 250;

    var p1 = { X: osx1, Y: osy1 };
    var p2 = { X: osx2, Y: osy2 };

    const outerSquare = square(p1, p2, 10);

    const cpr = new ClipperLib.Clipper();

    cpr.AddPaths(outerSquare, ClipperLib.PolyType.ptSubject, true);
    cpr.AddPaths(textSquare, ClipperLib.PolyType.ptClip, true);

    var solution_paths = new ClipperLib.Paths();
    var succeeded = cpr.Execute(
      ClipperLib.ClipType.ctDifference,
      solution_paths,
      ClipperLib.PolyFillType.pftNonZero,
      ClipperLib.PolyFillType.pftNonZero
    );
    if (!succeeded) throw new Error("Clipper operation failed!");

    svg
      .append("g")
      .attr("fill", hexToColor(newColor))
      .selectAll("path")
      .data([solution_paths])
      .enter()
      .append("path")
      .attr("d", (d) => {
        return paths2string(d);
      });
  } else {
    random = shave(random, figlet_fonts.length);

    figlet.text(
      word,
      {
        font: figlet_fonts[random.result],
      },
      function (err, data) {
        if (err) {
          console.log("Something went wrong...");
          console.dir(err);
          return;
        }

        //console.log(data)
        console.log("Figlet font: ", figlet_fonts[random.result]);

        const text = svg
          .append("text")
          .attr("font-size", "12px")
          .attr("alignment-baseline", "central")
          .style("fill", hexToColor(newColor))
          .style("font-family", "Menlo, monospace");

        var chars = data.split("");
        var char_width = 7;
        var char_height = 15;
        var x = 0;
        var y = 0;

        text
          .selectAll("tspan")
          .data(chars)
          .enter()
          .append("tspan")
          .attr("x", (c, i) => {
            if (c == "\n") x = -1;

            return ++x * char_width + 25;
          })
          .attr("y", (c, i) => {
            if (c == "\n") y += char_height;

            return y + 25;
          })
          .text((d) => d);

        const bbBox = text.node().getBBox();

        svg.attr("width", bbBox.width + 50).attr("height", bbBox.height + 50);
      }
    );
  }
}

const getNewWord = () => {
  newWord({ Word: randomWord() });
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
  document.addEventListener("touchstart", handleTouchStart, false);
  document.addEventListener("touchmove", handleTouchMove, false);

  var xDown = null;
  var yDown = null;

  function handleTouchStart(evt) {
    xDown = evt.touches[0].clientX;
    yDown = evt.touches[0].clientY;
  }

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
  }
};

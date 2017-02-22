var fonts = [
	{name : "Roboto"},
	{name : "Open Sans"},
	{name : "Josefin Slab"},
	{name : "Arvo"},
	{name : "Lato"},
	{name : "Abril Fatface"},
	{name : "Ubuntu"},
	{name : "PT Sans"},
	{name : "Old Standard TT"},
	{name : "Droid Sans"},
	{name : "Sansita"}
];

function hexToColor(hex) {	
	return "#" + ("000000" + hex.toString(16)).substr(-6);
}

function UpdateLogo(word) {
	var parentDiv = document.getElementById("text");

	// Get a new bg color
	var bgColor = Math.floor(Math.random() * 0xFFFFFF);
	parentDiv.style.backgroundColor = hexToColor(bgColor);

	// TODO: this is a horrible algorithm for choosing an oposite color
	// find somehting better: http://softwareengineering.stackexchange.com/questions/44929/color-schemes-generation-theory-and-algorithms
	// http://serennu.com/colour/rgbtohsl.php
	var value = ((bgColor & 0x0F) << 4) | ((bgColor & 0xF0) >> 4);
	value = ((value & 0x33) << 2) | ((value & 0xCC) >> 2);

	var choosenFont = Math.floor(Math.random()*fonts.length);

	if(typeof fonts[choosenFont].loaded == 'undefined') {
		var link = document.createElement("link");
		link.href="https://fonts.googleapis.com/css?family=" + fonts[choosenFont].name.split(' ').join('+');
		link.rel="stylesheet"
			document.body.appendChild(link);
		fonts[choosenFont].loaded = true;
	}

	var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	var textSvg = document.createElementNS(svg.namespaceURI, "text");
	textSvg.setAttributeNS(null, "x", 0);
	textSvg.setAttributeNS(null, "y", 25);
	textSvg.setAttributeNS(null, "fill", hexToColor(value));
	textSvg.setAttributeNS(null, "font-family", fonts[choosenFont].name);
	svg.appendChild(textSvg);
	textSvg.appendChild(document.createTextNode(word.Word));

	parentDiv.innerHTML="";
	parentDiv.appendChild(svg);
}

window.onload = function() {
	window.onkeydown = function(e){
		if(e.keyCode == 32){
			var s=document.createElement("script");
			s.type="text/javascript";
			s.src="http://www.setgetgo.com/randomword/get.php?callback=UpdateLogo";
			document.body.appendChild(s);
		}
		
		// Prevent scrolling
		if(e.keyCode == 32 || e.which == 32) {
			e.preventDefault();
			return 0;
		}
	}
};

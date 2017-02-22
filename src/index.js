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
]

function hexToColor(hex) {	
	return "#" + ("000000" + hex.toString(16)).substr(-6);
}

function UpdateLogo(word) {
	var h1 = document.getElementById("text");
	h1.innerHTML=word.Word;

	var bgColor = Math.floor(Math.random() * 0xFFFFFF);
	document.body.style.backgroundColor = hexToColor(bgColor);

	// TODO: this is a horrible algorithm for choosing an oposite color
	// find somehting better: http://softwareengineering.stackexchange.com/questions/44929/color-schemes-generation-theory-and-algorithms
	// http://serennu.com/colour/rgbtohsl.php
	var value = ((bgColor & 0x0F) << 4) | ((bgColor & 0xF0) >> 4);
	value = ((value & 0x33) << 2) | ((value & 0xCC) >> 2);
	value = ((value & 0x55) << 1) | ((value & 0xAA) >> 1);
	h1.style.color = hexToColor(value);

	var choosenFont = Math.floor(Math.random()*fonts.length);

	if(typeof fonts[choosenFont].loaded == 'undefined') {
		var link = document.createElement("link");
		link.href="https://fonts.googleapis.com/css?family=" + fonts[choosenFont].name.split(' ').join('+');
		link.rel="stylesheet"
			document.body.appendChild(link);
		fonts[choosenFont].loaded = true;
	}

	h1.style.fontFamily=fonts[choosenFont].name;
}

window.onload = function() {
	document.body.onkeyup = function(e){
		if(e.keyCode == 32){
			//UpdateText("spacebar");
			var s=document.createElement("script");
			s.type="text/javascript";
			s.src="http://www.setgetgo.com/randomword/get.php?callback=UpdateLogo";
			document.body.appendChild(s);
		}
	}
};

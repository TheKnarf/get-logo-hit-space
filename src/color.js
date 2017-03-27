export const hexToColor = (hex)=>{	
	return "#" + ("000000" + hex.toString(16)).substr(-6);
}

export const getBgColor = ()=>{
	return Math.floor(Math.random() * 0xFFFFFF);
}

export const getNewColor = (oldColor)=>{
	// TODO: this is a horrible algorithm for choosing an oposite color
	// find somehting better: http://softwareengineering.stackexchange.com/questions/44929/color-schemes-generation-theory-and-algorithms
	// http://serennu.com/colour/rgbtohsl.php
	var value = ((oldColor & 0x0F) << 4) | ((oldColor & 0xF0) >> 4);
	return ((value & 0x33) << 2) | ((value & 0xCC) >> 2);
}
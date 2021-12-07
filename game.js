var colors = ["Blu", "Gre", "Yel", "Red"];

function playSound(color) {
	return function() { document.getElementById("sound" + color).play(); }
}

for (var i = 0; i < colors.length; i++) {
	var btn = document.getElementById("button" + colors[i]);
	btn.onclick = playSound(colors[i])
}

var scaleFactor = Math.min(window.innerHeight / 460, window.innerWidth / 460)
document.getElementsByClassName("gameContainer")[0].style.transform = "scale(" + scaleFactor + ")";
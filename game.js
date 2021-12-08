var colors = ["Gre", "Red", "Blu", "Yel"];
var gameOn = false;
var gameModeA = true;
var rounds = new Array();
var password = new Array();
var currentSequence = new Array();
var gameWon = false
var passwordEntered = false;

var roundNum = -1;

function genBtnOnClick(color) {
	return function() { 
		currentSequence.push(color);
		document.getElementById("sound" + color).play();

		if (gameModeA) {
			checkGameState();	
		} else {
			checkPassword();
		}
		
	}
}

async function checkPassword() {
	if (currentSequence.length == password.length)
		if (currentSequence.every((val, i, arr) => val === password[i])) {
			await sleep(500)
			enableButtons(false);
			playWinAnim();
			passwordEntered = true;
			await sleep(3000)
			playSecret();
		} else {
			await sleep(500)
			document.getElementById("soundWrong").play();
			resetGame();
		}
}

async function morse(seq) {
	for (var i = 0; i < seq.length; i++) {
		var color = colors[i % 4]
		for (var j = 0; j < seq[i].length; j++) {
			if (seq[i][j] === "-") {
				document.getElementById("button" + color).classList.add("active")
				document.getElementById("sound" + color + "Long").play();
				await sleep(304 * 3)
				document.getElementById("button" + color).classList.remove("active")
			} else {
				document.getElementById("button" + color).classList.add("active")
				document.getElementById("sound" + color).play();
				await sleep(304)
				document.getElementById("button" + color).classList.remove("active")
			}
			await sleep(304)
		}
		await sleep(304 * 2)
	}
	// The length of a dot is 1 time unit.


}

async function playSecret() {
	// MUSK BLVD

	var seq = [
		"--",
		"..-",
		"...",
		"-.-",
		
		"-...",
		".-..",
		"...-",
		"-.."
	]

	morse(seq)

}

function getRandomColor() {
	var color = Math.floor(Math.random() * 4)
	return colors[color]
}

function generateSequences(numRounds, start) {
	var round = new Array();	
	for (var i = 0; i < start; i++) {
		round.push(getRandomColor())
	}

	rounds.push(Array.from(round))
	

	for (var i = 0; i < numRounds - 1; i++) {
		var modifiedIdx = Math.floor(Math.random() * round.length)
		
		var passwordColor = round[modifiedIdx];
		password.push(passwordColor)

		while (round[modifiedIdx] === passwordColor) {
			round[modifiedIdx] = getRandomColor();	
		}

		round.push(getRandomColor())
		rounds.push(Array.from(round))
	}
	console.log(rounds)
	console.log(password)
}

async function startGame() {
	resetGame();
	roundNum = 0
	await sleep(1000)
	playSequence(rounds[0])
}

async function playWinAnim() {
	document.getElementById("soundVictory").play();

	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 4; j++) {
			document.getElementById("button" + colors[j]).classList.add("active")
			await sleep(125)
			document.getElementById("button" + colors[j]).classList.remove("active")
		}
	}
}

async function checkGameState() {
	if (!gameModeA || gameWon || roundNum == -1) {
		return;
	}
	enableButtons(false)

	var curIdx = currentSequence.length - 1
	console.log(currentSequence[curIdx])
	console.log(rounds[roundNum][curIdx])

	if (currentSequence[curIdx] !== rounds[roundNum][curIdx]) {
		await sleep(500)
		document.getElementById("soundWrong").play();
		await sleep(1500)
		playSequence(rounds[roundNum])
	} else if (currentSequence.length == rounds[roundNum].length) {
		// Won this round
		if (roundNum == rounds.length) {
			await sleep(500)
			playWinAnim();
			gameWon = true;
			return;
		} else {
			await sleep(1000)
			roundNum += 1
			playSequence(rounds[roundNum])
		}
	} else {
		enableButtons(true);
	}

	
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function enableButtons(enable) {
	for (var i = 0; i < colors.length; i++) {
		var btn = document.getElementById("button" + colors[i]);
		if (enable) {
			btn.style.pointerEvents = 'auto';
		} else {
			btn.style.pointerEvents = 'none';
		}
	}
}

async function playSequence(seq) {
	currentSequence = new Array();
	enableButtons(false);

	for (var i = 0; i < seq.length; i++) {
		document.getElementById("sound" + seq[i]).play();
		document.getElementById("button" + seq[i]).classList.add("active")
		await sleep(750)
		document.getElementById("button" + seq[i]).classList.remove("active")
		await sleep(250)

	}

	enableButtons(true);
}

function resetGame() {
	roundNum = -1;
	gameWon = false;
	currentSequence = new Array();
	passwordEntered = false;

}

async function init() {
	enableButtons(false)

	for (var i = 0; i < colors.length; i++) {
		var btn = document.getElementById("button" + colors[i]);
		btn.onclick = genBtnOnClick(colors[i])
	}

	var scaleFactor = Math.min(window.innerHeight / 460, window.innerWidth / 460)
	document.getElementById("gameContainer").style.transform = "scale(" + scaleFactor + ")";

	generateSequences(6, 3)

	document.getElementById("modeSwitch").onclick = function () {
		if (gameModeA) {
			document.getElementById("modeA").style.background = "none";
			document.getElementById("modeB").style.background = "black";
		} else {
			document.getElementById("modeA").style.background = "black";
			document.getElementById("modeB").style.background = "none";
		}

		resetGame();
		gameModeA = !gameModeA
	}

	document.getElementById("powerSwitch").onclick = function () {
		resetGame();
		gameOn = !gameOn
		enableButtons(gameOn);

		if (gameOn) {
			document.getElementById("on").style.background = "black";
			document.getElementById("off").style.background = "none";
		} else {
			document.getElementById("on").style.background = "none";
			document.getElementById("off").style.background = "black"
		}

	}

	document.getElementById('startButton').onclick = function () {
		if (gameOn && gameModeA && roundNum == -1) {
			startGame();
		} else if (gameOn && !gameModeA) {
			resetGame()
		}
	}

	document.getElementById("replayButton").onclick = async function () {
		if (gameOn && roundNum != -1 && gameModeA) {
			await sleep(500)
			playSequence(rounds[roundNum]);
		} else if (gameOn && gameWon && gameModeA) {
			startGame()
		} else if (gameOn && !gameModeA) {
			if (!passwordEntered) {
				resetGame()	
			} else {
				playSecret();
			}
			
		}
	}


}



init();





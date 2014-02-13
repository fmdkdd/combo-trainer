document.addEventListener('DOMContentLoaded', init);

var gamepad;
var canvas;
var ctxt;
var frame;
var fpsCounter;

var pattern = [[0], [0], [0], [], [], [], [], [0],[0], [], [], [], [], [0], [], [], []];

function init() {
	fpsCounter = document.querySelector('#fps');

	canvas = document.querySelector('canvas');
	ctxt = canvas.getContext('2d');

	ctxt.scale(3,1);

	reset();
}

function reset() {
	frame = null;
	ctxt.clearRect(0,0,canvas.width,canvas.height);

	drawPattern(pattern);
}

var lastFrameTime = 0;
var frameTimes = [];

function checkButtons(time) {
	var delta = time - lastFrameTime;
	frameTimes.unshift(delta);
	if (frameTimes.length > 10) {
		frameTimes.length = 10;
		var avg = sum(frameTimes) / frameTimes.length;
		fpsCounter.innerHTML = 1000 / avg;
	}

	var pressed = gamepad.buttons.filter(function(b) { return b.pressed; });

	// First button pressed
	if (frame == null && pressed.length > 0)
		frame = 0;

	if (frame != null) {
		drawButtons(frame, pressed);
		++frame;

		if (frame > pattern.length * 2)
			reset();
	}

	lastFrameTime = time;

	requestAnimationFrame(checkButtons);
}

function drawButtons(frame, pressed) {
	if (pressed.length > 0)
		drawTick(frame, 25, 'green', 85);
	else
		drawTick(frame, 10, 'grey', 85);
}

function drawTick(frame, height, color, center) {
	ctxt.strokeStyle = color;
	ctxt.beginPath();
	ctxt.moveTo(frame * 2 + 1, center - height);
	ctxt.lineTo(frame * 2 + 1, center + height);
	ctxt.stroke();
}

function drawPattern(pattern) {
	pattern.forEach(function(pressed, frame) {
		if (pressed.length > 0)
			drawTick(frame, 25, 'pink', 30);
		else
			drawTick(frame, 10, 'grey', 30);
	});
}

window.addEventListener("gamepadconnected", function(e) {
	console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
					e.gamepad.index, e.gamepad.id,
					e.gamepad.buttons.length, e.gamepad.axes.length);

	gamepad = e.gamepad;
	requestAnimationFrame(checkButtons);
});

function sum(array) {
	var s = 0;
	for (var i = 0; i < array.length; ++i)
		s += array[i];
	return s;
}

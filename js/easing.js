var canvas = document.getElementById("canvas");
canvas.width = 1400;
canvas.height = 600;
var ctx = canvas.getContext("2d");
var raf;

var Time = {
	curTime: 0,
	deltaTime: 0,
	infiniteAnim: false,
	genNewRandomAnimIn: 3000,
	newPosTimeCount: 0
};

function repeatRandomAnimation(t) {
	if (Time.newPosTimeCount < Time.genNewRandomAnimIn) {
		Time.newPosTimeCount+=t;
	}
	else {
		Time.newPosTimeCount = 0;
		Time.genNewRandomAnimIn = Vec2.genRandomInt(2000, 7000);
		activateAnimation();
	}
}

var mousePos = new Vec2(500, canvas.height/2);

// add events for starting/stopping the loop
// canvas.addEventListener("mouseover", function(e){
	queue();
// });
canvas.addEventListener("mouseout", function(e){
	// dequeue();
});
canvas.addEventListener("click", function(e){
	// mousePos = new Vec2(e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop);
	// // aCircle.addAnimation(mousePos, 1000);
	// for (var i=0; i<circles.length; i++) {
	// 	var delay = interpolateVal(1000,3000,circles.length);
	// 	circles[i].addAnimation(mousePos, 2*delay(i+1));
	// }
});

function activateAnimation() {
	var newX, newY, newVec;
	do {
		newX = Vec2.genRandomInt(100, canvas.width-100);
		newY = Vec2.genRandomInt(100, canvas.height-100);
		newVec = new Vec2(newX, newY);
	} while(Vec2.dist(newVec, mousePos) < 700);
	mousePos = new Vec2(newX, newY);
	// aCircle.addAnimation(mousePos, 1000);
	for (var i=0; i<circles.length; i++) {
		var delay = interpolateVal(1000,3000,circles.length);
		circles[i].addAnimation(mousePos, 2*delay(i+1));
	}
}

function loop(){
	clearCanvas();
	update();
	draw();
	queue();
}

function clearCanvas(){
	ctx.fillStyle = "rgba(255,255,255,1)";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function queue(){
	raf = window.requestAnimationFrame(loop);
}

function dequeue(){
	window.cancelAnimationFrame(raf);
}

function Worm(location, length) {
	// add color changing aspects
	// add an rgb function for extracting rgb values
	this.location = location;
	this.links = [];
	this.initLinks = function(location, length) {
		for (var i=0; i<length; i++) {
			var alphaTerp = interpolateVal(1,0,length);
			circles[i] = new Circle(location, (i+1)*3, "rgba(0,0,255,"+colInterp(i)+")", "orange", 4);
		}
	};
}

function Circle(location, radius, fillColor, strokeColor, lineWidth) {
	this.pos = location || new Vec2(0,0);
	this.r = radius || 5;
	this.fillColor = fillColor || "black";
	this.strokeColor = strokeColor || "black";
	this.lineWidth = lineWidth || 1;
	this.anim = null;

	this.update = function(t){
		if (this.anim !== null) {
			this.pos = this.anim.update(t);
			if (!this.anim.isActive()) {
				this.anim = null;
			}
		}
	};

	this.draw = function(){
		ctx.fillStyle = this.fillColor;
		ctx.strokeStyle = this.strokeColor;
		ctx.beginPath();
		ctx.arc(this.pos.x, this.pos.y, this.r, 0, 2*Math.PI, false);
		ctx.fill();
		ctx.lineWidth = this.lineWidth;
		ctx.stroke();
	};

	this.addAnimation = function(moveTo, timeToMove) {
		this.anim = new Animation(this.pos, moveTo, timeToMove);
	};
}

function Animation(from, to, duration) {
	this.start = from;
	this.end = to;
	this.duration = duration || 700;
	this.curTime = 0;

	this.normalTime = function(t) {
		return this.curTime / this.duration;
	};

	this.terpVec2 = function(t) {
		var s = this.start.mult(1-t);
		var e = this.end.mult(t);
		return s.add(e);
	};

	this.update = function(t) {
		if (this.isActive()) {
			this.curTime += t;
			var nt = this.normalTime(t);
			var et = Animation.smoothEasing(nt);
			return this.terpVec2(et);
		} 
		else {
			this.curTime = this.duration;
			return this.end;
		}
	};

	this.isActive = function() {
		return this.curTime < this.duration;
	};
}

Animation.smoothEasing = function(t){ return (t * t * (3 - 2 * t)); };

// create the circles
var circles = [];
var numOfCircles = 40;
for (var i=0; i<numOfCircles; i++){
	var colInterp = interpolateVal(1,0,numOfCircles);
	circles[i] = new Circle(new Vec2(200,200), (i+1)*3, "rgba(0,0,255,"+colInterp(i)+")", "orange", 4);
}

function interpolateVal(from, to, dist) {
	
	return function(t) {
		var normDist = t / dist;
		var ed = Animation.smoothEasing(normDist);
		var s = from * (1 - ed);
		var e = to * ed;
		return s + e;	
	};
	
}

var aCircle = new Circle(new Vec2(0,0), 0, "white", "white", 0);

// function Animation(from, to, duration) {
// 	this.terpVec2 = function(t) {
// 		var start = from.mult(1-t);
// 		var end = to.mult(t);
// 		return start + end;
// 	};
// 	this.terpVal = function(t) {
// 		var start = from * (1-t);
// 		var end = to * t;
// 		return start + end;
// 	};
// 	// this.terpColor = function(t) {
// 	// };
// }



// var circle = {
// 	curPos: new Vec2(50, canvas.height/2),
// 	r: 5,
// 	duration: 700,
// 	timeCount: 0,
// 	startPos: this.curPos,
// 	startR: this.r,
// 	endPos: Vec2.createZeroVec2(),
// 	endR: 40,
// 	drawPos: function(t){
// 		var terpEnd = this.endPos.mult(t);
// 		var terpStart = this.startPos.mult(1-t);
// 		this.curPos = terpStart.add(terpEnd);
// 		return this.curPos;
// 	},
// 	drawR: function(t){
// 		console.log(this.r);
// 		console.log(this.startR);
// 		console.log(this.curPos);
// 		var terpEnd = this.startR * t;
// 		var terpStart = this.endR * (1-t);
// 		this.r = terpStart + terpEnd;
// 		return this.r;
// 	},
// 	inAnim: false,
// 	anim: {
// 		smoothEasing: function(t){ return (t * t * (3 - 2 * t)); },
// 		linearEasing: function(t){ return t; },
// 		squaredEasing: function(t){ return t * t; },
// 		powerEasing: function(t,s){ return Math.pow(t,s || 2); },
// 		deceleratedEasing: function(t,s){ return 1 - Math.pow(1-t,s || 2); },
// 		smoothPowerEasing: function(t,s){ return Math.pow(t * t * (3 - 2 * t), s); },
// 		sinEasing: function(t){ return Math.sin(t * Math.PI/2); },
// 		inverseSinEasing: function(t){ return 1 - Math.sin((1 - t) * Math.PI/2); },
// 		powerSinEasing: function(t,s){ return Math.pow(Math.sin(t * Math.PI/2), s || 2); },
// 		powerInverseSinEasing: function(t,s){ return Math.pow(1 - Math.sin((1-t) * Math.PI/2), s || 2); },
// 	}
// };

function update(){
	var t = Date.now();
	Time.deltaTime = t - Time.curTime;
	Time.curTime = t;

	repeatRandomAnimation(Time.deltaTime);

	for (var i=0; i<circles.length; i++) {
		circles[i].update(Time.deltaTime);
	}
	aCircle.update(Time.deltaTime);

	// if (circle.timeCount < circle.duration) {
	// 	circle.timeCount+=Time.deltaTime;
	// }
	// else {
	// 	inAnim = false;
	// 	circle.timeCount = circle.duration;
	// }
}

function draw(){
	for (var i=0; i<circles.length; i++) {
		circles[i].draw();
	}

	aCircle.draw();
	// ctx.fillStyle = "blue";
	// ctx.beginPath();

	// if (!circle.inAnim) {
	// 	ctx.arc(circle.curPos.x, circle.curPos.y, circle.r, 0, 2*Math.PI, false);	
	// }
	// else {
	// 	var normTime = circle.timeCount / circle.duration;
	// 	var easeTime = circle.anim.smoothEasing(normTime);

	// 	circle.curPos = circle.drawPos(easeTime);
	// 	circle.r = circle.drawR(easeTime);

	// 	ctx.arc(circle.curPos.x, circle.curPos.y, circle.r, 0, 2*Math.PI, false);
	// }
	
	// ctx.fill();
}

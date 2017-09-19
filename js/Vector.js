function Vec2(x,y){
	this.x = x;
	this.y = y;
}

Vec2.prototype.add = function(v){
	return new Vec2(this.x + v.x, this.y + v.y);
};

Vec2.prototype.sub = function(v){
	return new Vec2(this.x - v.x, this.y - v.y);
};

Vec2.prototype.mult = function(c){
	return new Vec2(this.x * c, this.y * c);
};

Vec2.prototype.div = function(c){
	return new Vec2(this.x / c, this.y / c);
};

Vec2.prototype.mag = function(){
	return Math.sqrt((this.x * this.x) + (this.y * this.y));
};

Vec2.prototype.normalize =  function(){
	var m = this.mag();
	if (m !== 0){
		return new Vec2(this.x / m, this.y / m);
	}
	return this;
};

Vec2.randomVec2 = function(){
	var rx = Vec2.genRandomFloat(-1,1);
	var ry = Vec2.genRandomFloat(-1,1);
	var v = new Vec2(rx, ry);
	return v.normalize();
};

Vec2.dist = function(v, w){
	return Math.sqrt(Math.pow((v.x - w.x),2) + Math.pow((v.y - w.y),2));
};

Vec2.prototype.limit = function(lim){
	var m = this.mag();
	if (m > lim){
		var v = this.normalize();
		return v.mult(lim);
	}
	return this;
};

Vec2.prototype.setMag = function(mag){
	var v = this.normalize();
	return v.mult(mag);
};


Vec2.test = function(){
	// testing Vector.js
		var v = new Vec2(5, 10);
		console.log(v);
		console.log(v.add(new Vec2(10, 20)));
		console.log(v.sub(new Vec2(2,3)));
		console.log(v.mult(5));
		console.log(v.div(5));
		console.log(v.mag());
		console.log(v.normalize().mag());
		console.log(v.limit(6).mag());
		console.log(Vec2.randomVec2());
		console.log(v.setMag(100));
};

Vec2.genRandomFloat = function(min, max){
	return Math.random() * (max - min) + min;
};

Vec2.genRandomInt = function(min, max){
	return Math.floor(Math.random()*(max-min+1))+min;
};

Vec2.createZeroVec2 = function(){
	return new Vec2(0,0);
};


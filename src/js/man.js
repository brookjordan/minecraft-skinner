function buildMen(manElt, manNo) {
	for (i=0; i < menElts.length; i += 1) {
		men[i] = buildMan(menElts[i], i, imageElt);
	}
};

function buildMan(manElt, manNo, img) {
	var man = men[manNo] || {
			img: img,
			elt: manElt,
			partElts: manElt.querySelectorAll('part'),
			parts: [],
			no: manNo,
			timesBuilt: 0,

			rot: {
				y: 45,
				ySpd: 3,

				x: 0,
				xSpd: 3
			}
		},
		i = 0;
	man.timesBuilt += 1;

	for (; i < man.partElts.length; i += 1) {
		man.parts[i] = buildPart(man, i);
	}

	if (man.timesBuilt <= 1) {
		moveMan(man, true);
	}

	return man;

};

function buildPart(man, partNo) {
	var partElt = man.partElts[partNo],

		partPositions= [
			{sx:1,  x:0, y:-12, z:0, ox:0, oy:0, oz:0},
			{sx:1,  x:0, y:-2, z:0, ox:0, oy:0, oz:0},
			{sx:1,  x:-6, y:-2, z:0, ox:2, oy:-6, oz:0},
			{sx:-1, x:-6, y:-2, z:0, ox:2, oy:-6, oz:0},
			{sx:1,  x:-2, y:10, z:0, ox:2, oy:-6, oz:0},
			{sx:-1, x:-2, y:10, z:0, ox:2, oy:-6, oz:0}
		],

		part = {
			elt: partElt,

			joint: partElt.getElementsByTagName('joint')[0] || document.createElement('joint'),

			faces: [
				// front,
				// back,
				// right,
				// left,
				// top,
				// bottom
			],

			width: partElt.getAttribute('width') * scaler,
			height: partElt.getAttribute('height') * scaler,
			depth: partElt.getAttribute('depth') * scaler,

			img: man.img,

			no: partNo,

			position: partPositions[partNo]
		},

		i=0;

	part.elt.style[tf] =	'scaleX(' + part.position.sx + ')' +
							'translateX(' + (part.position.x * scaler) + 'px)' +
							'translateY(' + (part.position.y * scaler) + 'px)' +
							'translateZ(' + (part.position.z * scaler) + 'px)';

	part.joint.innerHTML = '';
	part.joint.style[tfo] =	(part.position.ox * scaler) + 'px ' +
							(part.position.oy * scaler) + 'px ' +
							(part.position.oz * scaler) + 'px';

	for (; i<6; i+=1) {
		part.faces[i] = buildFace (man, part, i);
	}

	part.elt.appendChild(part.joint);

	return part;

}

function buildFace (man, part, faceNo) {
	var joint = part.joint,

		translates = [
			'translate3d(' + (-part.width/2 + 'px, ' + -part.height/2 + 'px, '+part.depth/2+'px') + ')',
			'translate3d(' + (-part.width/2 + 'px, ' + -part.height/2 + 'px, -'+part.depth/2+'px') + ')',
			'translate3d(' + (-part.width/2 - part.depth/2 + 'px, ' + -part.height/2 + 'px, 0') + ')',
			'translate3d(' + (part.width/2 - part.depth/2 + 'px, ' + -part.height/2 + 'px, 0') + ')',
			'translate3d(' + (-part.width/2 + 'px, ' + (-part.depth/2-part.height/2) + 'px, 0') + ')',
			'translate3d(' + (-part.width/2 + 'px, ' + (part.height/2-part.depth/2) + 'px, 0') + ')'
		],

		rotates = [
			'',
			'rotateY( 180deg )',
			'rotateY( -90deg )',
			'rotateY(  90deg )',
			'rotateX(  90deg )',
			'rotateX( -90deg )'
		],

		draws = [
			[ // head
				[8,8], // front
				[24,8], // back
				[0,8], // right
				[16,8], // left
				[8,0], // top
				[16,0] // bottom
			],
			[ // body
				[20,20],
				[32,20],
				[16,20],
				[28,20],
				[20,16],
				[28,16]
			],
			[ // left arm
				[44,20],
				[52,20],
				[40,20],
				[48,20],
				[44,16],
				[48,16]
			],
			[ // right arm
				[44,20],
				[52,20],
				[40,20],
				[48,20],
				[44,16],
				[48,16]
			],
			[ // left leg
				[4,20],
				[12,20],
				[0,20],
				[8,20],
				[4,16],
				[8,16]
			],
			[ // right leg
				[4,20],
				[12,20],
				[0,20],
				[8,20],
				[4,16],
				[8,16]
			]
		],

		canvas = document.createElement('canvas');

		face = {
			elt: canvas,
			ctx: canvas.getContext('2d'),

			width:  faceNo<2 ? part.width :
					faceNo<4 ? part.depth :
					part.width,

			height: faceNo<2 ? part.height :
					faceNo<4 ? part.height :
					part.depth,

			translate: translates[faceNo],
			rotate: rotates[faceNo]
		};

	face.elt.style.cssText =  	pf + 'transform-origin:' + face.width/2 + 'px ' + face.height/2 + 'px;' +
								pf + 'transform: ' + face.translate + ' ' + face.rotate + ';' +
								'width: ' + face.width + 'px;height: ' + face.height + 'px;';

	canvas.width = (face.width*ctxResolution)/scaler;
	canvas.height = (face.height*ctxResolution)/scaler;
	face.ctx.imageSmoothingEnabled = false;

	face.ctx.drawImage(man.img, draws[part.no][faceNo][0], draws[part.no][faceNo][1], face.width/scaler, face.height/scaler, 0, 0, canvas.width, canvas.height);

	joint.appendChild(face.elt);

	return face;

}

function moveMan (part, force) {
	var defaultMove = 'translateY(' + 0*scaler + 'px) ';

	force = force ? true : false;

	if (rotateXOn || rotateYOn || force) {
		if (rotateXOn) {
			part.rot.y += part.rot.ySpd * rotateXOn;
		}
		if (rotateYOn) {
			part.rot.x += part.rot.xSpd * rotateYOn;
		}
		part.elt.style[ tf ] = defaultMove + 'rotateY(' + part.rot.y + 'deg) rotateX(' + part.rot.x + 'deg)';
	}

	requestAnimationFrame(function(){
		moveMan (part);
	});
}



function setAnimation () {
	if ( /\bwalking\b/.test( document.body.className ) ) {
		document.body.classList.remove('walking');
		document.body.classList.add('running');

	} else if ( /\brunning\b/.test( document.body.className ) ) {
		document.body.classList.remove('running');

	} else {
		document.body.classList.add('walking');
	}
}



var menElts = document.querySelectorAll('man'),
	men = [],
	i = 0,
	ctxResolution = 8,
	scaler = 9,

	rotateXOn = 0,
	rotateYOn = 0,

	imageElt,

	tf, prefix;

if ( typeof document.body.style.transform === 'string' ) {
	tf = 'transform';
	tfo = 'transformOrigin';
	pf = '';
} else if ( typeof document.body.style.WebkitTransform === 'string' ) {
	tf = 'WebkitTransform';
	tfo = 'WebkitTransformOrigin';
	pf = '-webkit-';
} else {
	tf = '';
	pf = '';
};




window.onkeydown = function(e) {
	var didSomething = false;

	if ( e.which === 39 ) {
		rotateXOn = 1;
		didSomething = true;

	} else if ( e.which === 37 ) {
		rotateXOn = -1;
		didSomething = true;

	} else if ( e.which === 40 ) {
		rotateYOn = -1;
		didSomething = true;

	} else if ( e.which === 38 ) {
		rotateYOn = 1;
		didSomething = true;

	} else if ( e.which === 32 ) {
		setAnimation();
		didSomething = true;

	}

	if ( didSomething ) e.preventDefault();
}
window.onkeyup = window.ontouchend = window.onmouseup = window.onmouseleave = function(e) {
	rotateXOn = 0;
	rotateYOn = 0;
}



document.getElementsByClassName('func')[0].ontouchstart =
document.getElementsByClassName('func')[0].onmousedown  = function(e) {
	e.preventDefault();
	setAnimation();
}

document.getElementsByClassName('up')[0].ontouchstart =
document.getElementsByClassName('up')[0].onmousedown = function(e) {
	e.preventDefault();
	rotateYOn =  1;
}
document.getElementsByClassName('down')[0].ontouchstart =
document.getElementsByClassName('down')[0].onmousedown = function(e) {
	e.preventDefault();
	rotateYOn = -1;
}
document.getElementsByClassName('left')[0].ontouchstart =
document.getElementsByClassName('left')[0].onmousedown = function(e) {
	e.preventDefault();
	rotateXOn = -1;
}
document.getElementsByClassName('right')[0].ontouchstart =
document.getElementsByClassName('right')[0].onmousedown = function(e) {
	e.preventDefault();
	rotateXOn =  1;
}
var artBoard = function() {

	function startDrawing (e) {
		bounds = canvas.getBoundingClientRect();
		var setPoint = getPenPosition(bounds, e);

		brushSize = (currentSize * canvasScale)/2;
		brushColor = 'rgba(' + BJ.hex2rgb(currentColor) + ',' + currentOpacity + ')';
		drawDistLimit = brushSize * (currentMaxDistance/100);
		canvas.classList.add('drawing');
		prevPoint = setPoint;

		draw(setPoint.x, setPoint.y);

		window.addEventListener('mousemove', drawLine, false);
		window.addEventListener('mouseup', endDrawing, false);
	}

	function endDrawing (e) {
		window.removeEventListener('mousemove', drawLine, false);
		window.removeEventListener('mouseup', endDrawing, false);
		canvas.classList.remove('drawing');

		printFullToSmall();

		ondrawend();
	}

	function getPenPosition (target, e) {
		var bounds	= target.getBoundingClientRect ? target.getBoundingClientRect() : target,
			newX	= (e.clientX - bounds.left + window.scrollX)*canvasScale,
			newY	= (e.clientY - bounds.top + window.scrollY)*canvasScale;

		return {
			x: newX,
			y: newY
		};
	}

	function printFullToSmall () {
		ctx_default.drawImage(canvas, 0, 0, canvas_default.width, canvas_default.height);
	}

	function drawLine (e) {
		var setPoint = getPenPosition(bounds, e),
			dist = {
				x:		setPoint.x - prevPoint.x,
				y:		setPoint.y - prevPoint.y,
				total:	Math.pow(Math.pow(prevPoint.x - setPoint.x, 2) + Math.pow(prevPoint.y - setPoint.y, 2), 0.5)
			},
			parts = Math.ceil(dist.total/drawDistLimit),
			drawPoint,
			i = 1;

		for (; i<=parts; i++) {
			drawPoint = {
				x: prevPoint.x + (dist.x/parts)*i,
				y: prevPoint.y + (dist.y/parts)*i
			};

			draw(
				prevPoint.x + (dist.x/parts)*i,
				prevPoint.y + (dist.y/parts)*i
			);
		}

		prevPoint = setPoint;

	}

	function draw (x, y) {
		ctx.beginPath();
		ctx.arc(x, y, brushSize, 0, 2 * Math.PI, false);
		ctx.fillStyle = brushColor;
		ctx.fill();
	}

	function replaceImage (image) {

	}

	function loadImageFunction ( e ) {
		var ii = new Image();

		ii.onload = function() {
			ctx.drawImage( ii, 0, 0, canvas.width, canvas.height );
			printFullToSmall();

			ondrawend();
		};

		ii.src = e.target.result;
	}

	function addImageLoadFunction ( func, className ) {
		var o = {
			func: func
		};

		if ( typeof className === 'string' ) {
			o.className = className;
		}

		imageUpdateFuncs.push(o);
	}

	function handleImageUpdate ( img ) {
		var i = 0;

		for (; i<imageUpdateFuncs.length; i+=1) {
			imageUpdateFuncs[i].func( img );
		}
	}

	function createImageLink () {
		var aaa = document.createElement('a'),
			iii = new Image(),
			dataURL = canvas.toDataURL();

		iii.src = dataURL;

		aaa.href = dataURL;
		aaa.appendChild(iii);
		aaa.setAttribute('target', '_blank');
		aaa.setAttribute('download', 'download');

		aaa.style.display = 'block';
		iii.style.width = aaa.style.width = '100%';
		iii.style.height = 'auto';

		imageThumbs.appendChild(aaa);
	}

	var ondrawend =  (function () {
			var funcs = [],
				i;

			return function (func) {
				if (typeof func === 'function') {
					funcs.push(func);

				} else {
					for (i=0; i<funcs.length; i+=1) {
						funcs[0]();
					}
				}
			};
		}());


	var returnObject = {},
		imageUpdateFuncs = [],

		canvas	= document.getElementById('canvas'),
		canvas_default = document.getElementById('canvas_default'),
		ctx		= canvas.getContext('2d'),
		ctx_default = canvas_default.getContext('2d'),
		bounds	= canvas.getBoundingClientRect(),
		canvasScale = window.devicePixelRatio,
		canvasContainer = canvas.parentNode,

		defaultSkinSize = {
			x: 64,
			y: 32
		},

		possibleCanvasScale = {
			x: Math.floor( canvasContainer.getBoundingClientRect().width / defaultSkinSize.x ),
			y: Math.floor( canvasContainer.getBoundingClientRect().height / defaultSkinSize.y )
		},

		canvasSize = possibleCanvasScale.x <= possibleCanvasScale.y ?
		{
			x: possibleCanvasScale.x * defaultSkinSize.x,
			y: possibleCanvasScale.x * defaultSkinSize.y
		} :
		{
			x: possibleCanvasScale.y * defaultSkinSize.x,
			y: possibleCanvasScale.y * defaultSkinSize.y
		},

		brushSize,
		brushColor,
		drawDistLimit,
		prevPoint,

		ondrawendFuncs = [],

		dragNDrop = dropBox(loadImageFunction),

		colorPicker = document.getElementById('brushColor'),
		currentColor = colorPicker.value,

		currentSize = 3,
		currentOpacity = 100,
		currentMaxDistance = 25,

		imageThumbs = document.getElementById('imageThumbs');


	canvas.width = canvasSize.x * canvasScale;
	canvas.height = canvasSize.y * canvasScale;
	canvas.style.width = canvasSize.x + 'px';
	canvas.style.height = canvasSize.y + 'px';
	ctx.webkitImageSmoothingEnabled = false;

	canvas_default.width = defaultSkinSize.x;
	canvas_default.height = defaultSkinSize.y;
	canvas_default.style.width = canvas_default.width + 'px';
	canvas_default.style.height = canvas_default.height + 'px';
	//ctx_default.webkitImageSmoothingEnabled = false;

	canvas.addEventListener('mousedown', startDrawing, false);



	returnObject.replaceImage = replaceImage;
	returnObject.onimageupdate = addImageLoadFunction;
	returnObject.getImage = createImageLink;
	returnObject.ondrawend = ondrawend;
	returnObject.art = canvas_default;


	BJSliders
		.onchange(function(slider){
			currentSize = slider.value;
		}, 'size')
		.onchange(function(slider){
			currentOpacity = slider.value / 100;
		}, 'opacity')
		.onchange(function(slider){
			currentMaxDistance = slider.value;
		}, 'maxSpacing');

	colorPicker.addEventListener('change', function() {
		currentColor = colorPicker.value;
	}, false);


	return returnObject;

}();

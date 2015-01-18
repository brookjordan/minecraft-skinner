var menuSystem = (function(window, undefined){
	function initiatePart (partName) {
		var eltClass = 'menu-' + partName,
				elt = document.querySelector('.' + eltClass),
				part = {},
				toggler;

		part.name = partName;

		if ( elt ) {
			part.elt              = elt;
			part.toggler          = elt.querySelector( '.toggler' );
			part.optionsWrapper   = elt.querySelector( '.' + classOfOptionsWrapper(part) );
			part.optionsContainer = elt.querySelector( '.' + classOfOptionsContainer(part) );
			part.options          = elt.querySelector( '.' + classOfOptions(part) );

			addPartToggle(part);

		}

		return part;
	}

	function addPartToggle (part) {
		var togglePartFunction =  create_togglePart(part);

		body.classList.add( classOfMenu(part, 'closed') );

		part.toggler.addEventListener('click', togglePartFunction, false);

	}

	function create_togglePart(part) {
		var closedClass = classOfMenu(part, 'closed'),
				openClass = classOfMenu(part, 'open'),

				closedTest = new RegExp( closedClass );

		return function(e) {
			if ( closedTest.test( body.className ) ) {
				body.classList.remove(closedClass);
				body.classList.add(openClass);

			} else {
				body.classList.remove(openClass);
				body.classList.add(closedClass);
			}
		};
	}

	function classOfMenu (part, state, type) {
		return 'menu-' + part.name + (type ? '__' + type : '') + (state ? '--' + state : '');
	}

	function classOfOptionsWrapper (part, state) {
		return classOfMenu(part, state, 'optionsWrapper');
	}

	function classOfOptionsContainer (part, state) {
		return classOfMenu(part, state, 'optionsContainer');
	}

	function classOfOptions (part, state) {
		return classOfMenu(part, state, 'options');
	}

	function checkToolsScroll (e) {
		var optionsWrapper   = parts[0].optionsWrapper,
				optionsContainer = parts[0].optionsContainer,
				options          = parts[0].options,

				optionsWidth = options.clientWidth,
				optionsContainerWidth = optionsContainer.clientWidth;

		if ( optionsContainer.scrollLeft < 1 ) {
			optionsWrapper.classList.add('atStart');

		} else {
			optionsWrapper.classList.remove('atStart');
		}

		if (options.clientWidth <= optionsContainer.clientWidth ||
				optionsContainer.clientWidth + optionsContainer.scrollLeft >= options.clientWidth) {
			optionsWrapper.classList.add('atEnd');

		} else {
			optionsWrapper.classList.remove('atEnd');
		}
	}



	var body = document.body,
			partNames = 'tools saves preview'.split(' '),
			parts = [],
			i,

			returnObject = {};



	for (i=0; i<partNames.length; i+=1) {
		parts.push(
			initiatePart( partNames[i] )
		);
	}

	checkToolsScroll();
	parts[0].optionsContainer
		.addEventListener('scroll', checkToolsScroll, false);
	window
		.addEventListener('resize', checkToolsScroll, false);


	returnObject.parts = parts;

	return returnObject;

}(window));




// - -- --- -- - -- --- -- - -- --- -- - -- --- -- - //





BJSliders
	.onchange(function(slider){
		document.querySelector('.menu-tools__options__option-size .value__number')
			.innerHTML = slider.value;
	}, 'size')
	.onchange(function(slider){
		document.querySelector('.menu-tools__options__option-opacity .value__number')
			.innerHTML = slider.value;
	}, 'opacity')
	.onchange(function(slider){
		document.querySelector('.menu-tools__options__option-maxSpacing .value__number')
			.innerHTML = slider.value;
	}, 'maxSpacing');
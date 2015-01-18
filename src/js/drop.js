var dropBox = function( loadFunction ){

	function addDragClass(e) {
		e.preventDefault && e.preventDefault();
		dropOverlay.classList.add('hover');
	}

	function removeDragClass(e) {
		e.preventDefault && e.preventDefault();
		dropOverlay.classList.remove('hover');
	}

	function handleImageDrop(e) {
		e.preventDefault && e.preventDefault();
		dropOverlay.classList.remove('hover');

		// now do something with:
		var files = e.dataTransfer.files,
			reader = new FileReader();

		reader.onload = function(e){
			loadFunction(e);
		};

		reader.readAsDataURL(files[0]);
	}



	var returnObject = {},

		doc = document.documentElement,
		dropOverlay = document.getElementById('dropOverlay');

	doc.ondragover = addDragClass;
	doc.ondragleave = removeDragClass;
	doc.addEventListener( 'drop', handleImageDrop, false );

	return returnObject;

};
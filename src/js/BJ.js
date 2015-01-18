var BJSliders = (function(){
  function buildSlider (sliderElt) {

    function startDrag (e) {
      e.preventDefault();

      prevValue = slider.value;
      downPos = BJ.pageX(e);

      addEventListener('mousemove', drag, false);
      window.addEventListener('touchmove', drag, false);
      window.addEventListener('mouseup', endDrag, false);
      window.addEventListener('touchend', endDrag, false);
    }
    function endDrag (e) {
      e.preventDefault();

      window.removeEventListener('mousemove', drag, false);
      window.removeEventListener('touchmove', drag, false);
      window.removeEventListener('mouseup', endDrag, false);
      window.removeEventListener('touchend', endDrag, false);
    }

    function drag (e) {
      e.preventDefault();

      slider.value = prevValue + (BJ.pageX(e) - downPos)*slider.step;

      updateKnobPosition();
      runChangeFuncs();
    }

    function updateKnobPosition () {
      var ratio = 100/slider.range,
          newValue = Math.max( slider.min, Math.min( slider.value, slider.max ) );

      slider.value = newValue;

      sliderKnob.style.left = (slider.value-slider.min)*ratio + '%';
    }

    function addOnChange (func) {
      onChangeFuncs.push( func );
    }

    function runChangeFuncs (func) {
      var i = 0;

      for (; i<onChangeFuncs.length; i+=1) {
        onChangeFuncs[i](slider);
      }
    }

    var slider = {},
        sliderBar = document.createElement('div'),
        sliderKnob = document.createElement('button'),
        onChangeFuncs = [],

        prevValue,
        downPos;

    sliderBar.className = 'BJSlider__bar';
    sliderKnob.className = 'BJSlider__knob';

    sliderElt.appendChild(sliderBar);
    sliderElt.appendChild(sliderKnob);

    sliderKnob.addEventListener('mousedown', startDrag, false);
    sliderKnob.addEventListener('touchstart', startDrag, false);

    slider.elt = sliderElt;
    slider.bar = sliderBar;
    slider.knob = sliderKnob;

    slider.value = +sliderElt.getAttribute('data-value') || 0;
    slider.min = +sliderElt.getAttribute('data-min') || 0;
    slider.max = +sliderElt.getAttribute('data-max') || 100;
    slider.range = slider.max - slider.min;
    slider.step = +sliderElt.getAttribute('data-step') || 1;
    slider.id = sliderElt.getAttribute('data-id') || '';

    slider.onchange = addOnChange;

    updateKnobPosition();

    return slider;
  }

  function addOnChangeTo (func, sliderID) {
    var i = 0,
        slider;
    sliderID = sliderID || '';

    while (i<sliders.length) {
      slider = sliders[i];

      if (slider.id === sliderID) {
        slider.onchange( func );
      }

      i+=1;
    }

    return returnObject;
  }



  var sliderElts = document.querySelectorAll('.BJSlider'),
      sliders = [],
      i,

      returnObject = {};



  for (i=0; i<sliderElts.length; i+=1) {
    sliders.push( buildSlider(sliderElts[i]) );
  }



  returnObject.sliders = sliders;
  returnObject.onchange = addOnChangeTo;

  return returnObject;
}());




// - -- --- -- - -- --- -- - -- --- -- - -- --- -- - //




var BJ = (function() {
  function getPageX (e) {
    return (e.touches && e.touches[0]) ? e.touches[0].pageX : e.pageX;
  }

  function hex2rgb (hex) {
    var hexParts = hex.match(/[a-zA-Z0-9]{2}/g),
        r = parseInt(hexParts[0], 16),
        g = parseInt(hexParts[1], 16),
        b = parseInt(hexParts[2], 16),
        rgb = r + ',' + g + ',' + b;

    return rgb;
  }



  var returnObject = {};

  returnObject.pageX = getPageX;
  returnObject.hex2rgb = hex2rgb;



  return returnObject;
}());
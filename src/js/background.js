(function() {
	'use strict';

  function handleInputEntered(text) {
    alert('inputEntered: ' + text);
  }

  // ====

  // Omni handle
  chrome.omnibox.onInputEntered.addListener(handleInputEntered);
})();

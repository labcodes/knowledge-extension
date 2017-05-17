(function() {
	'use strict';

	function handleInputEntered(text) {
		alert('inputEntered: ' + text);
	};

	chrome.omnibox.onInputEntered.addListener(handleInputEntered);
})();
(function() {
	'use strict';

	const button = document.querySelector('button[type="submit"]');
	const form = document.getElementById('knForm');
	const input = document.querySelector('.input');

	function sendData(obj) {
		console.warn('The data is:', obj);
	}

	function getTags(tabUrl) {
		let tags;

		if (input.value) {
			tags = input.value.split(',');
		}

		sendData({
			tabUrl,
			tags
		});
	}

	function handleSubmitForm(evt) {
		evt.preventDefault();

		button.classList.add('is-loading');

		if (chrome.tabs) {
			chrome.tabs.query({ active: true }, (tab) => {
				getTags(tab[0].url);
			});
		}
	}

	// ====

	function handleCommands(command) {
		console.warn(command);
	}

	document.addEventListener('DOMContentLoaded', () => {
		form.addEventListener('submit', handleSubmitForm, false);

		if (chrome.commands) {
			chrome.commands.onCommand.addListener(handleCommands);
		}

	}, false);
})();
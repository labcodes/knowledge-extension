(function() {
	'use strict';

	const button = document.querySelector('button[type="submit"]');
	const form = document.getElementById('knForm');
	const input = document.querySelector('.input');

	function sendData(dataObj) {
    let xhr = new XMLHttpRequest();

    xhr.open('POST', 'https://jsonplaceholder.typicode.com/posts');

    xhr.setRequestHeader('accept', 'application/json');
    xhr.setRequestHeader('content-type', 'application/json');
    xhr.setRequestHeader('Authorization', 'Token <your-token-here>');

    xhr.onreadystatechange = function() {
      switch(xhr.readyState) {
        case 0:
          console.warn('Um cliente foi criado. Mas o método open()  não foi chamado ainda.');
        break;

        case 1:
          console.warn('O método open() foi chamado.');
        break;

        case 2:
          console.warn('o método send() foi chamado e os cabeçalhos e status estão disponíveis .');
        break;

        case 3:
          console.warn('Baixando e responseText contem os dados parciais.');
        break;

        case 4:
          console.warn('Operação concluída.');
          console.warn(JSON.parse(xhr.responseText));
        break;
      }
    };

    xhr.send(dataObj);
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

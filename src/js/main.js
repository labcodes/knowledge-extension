(function() {
	'use strict';

	const button = document.querySelector('button[type="submit"]');
	const form = document.getElementById('knForm');
	const input = document.querySelector('.input');

  // ====

  function notification(obj) {
    let notificationId = new Date().getTime().toString();

    let options = {
      type: 'basic',
      title: obj.title,
      message: obj.message,
      iconUrl: './src/images/icon128.png'
    };

    chrome.notifications.create(notificationId, options, (id) => {
      console.warn('Notification ID:', id);
    });
  }

  function _handleResponse(obj) {
    input.value = '';
    button.classList.remove('is-loading');

    notification({
      title: 'Success!',
      message: 'Seu link foi postado com sucesso.'
    });
  }

	function sendData(dataObj) {
    const myToken = '2e0ccdc6761f587b795369445571b6dafc44db05';
    dataObj.title = 'CHROME EXTENSIONS <3';

    let xhr = new XMLHttpRequest();

    xhr.open('POST', 'https://link-notifications.herokuapp.com/api/links/create/', true);

    xhr.setRequestHeader('accept', 'application/json');
    xhr.setRequestHeader('content-type', 'application/json');
    xhr.setRequestHeader('Authorization', `Token ${myToken}`);

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
          _handleResponse(JSON.parse(xhr.responseText));
        break;
      }
    };

    xhr.send(JSON.stringify(dataObj));
	}

	function getTags(url) {
		let tags;

		if (input.value) {
			tags = input.value.split(',').toString();
		}

		sendData({
			url,
			tags
		});
	}

	function handleSubmitForm(evt) {
		evt.preventDefault();

		button.classList.add('is-loading');

		if (chrome.tabs) {
			chrome.tabs.query({ active: true }, (tabs) => {
        tabs.forEach(item => {
          if (item.url) {
            getTags(item.url);
          }
        })
			});
		}
	}

	function handleCommands(command) {
		console.warn(command);
	}

  // ====

	document.addEventListener('DOMContentLoaded', () => {
		form.addEventListener('submit', handleSubmitForm, false);

		if (chrome.commands) {
			chrome.commands.onCommand.addListener(handleCommands);
		}
	}, false);
})();

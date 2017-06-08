(function() {
	'use strict';

	const button = document.querySelector('#postLink');
	const form = document.getElementById('formTags');
  const input = document.querySelector('#linkTags');

  // ====

  function _shareWithFacebook(link) {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${link}`;
    window.open(url, '_blank');
  }

  function _shareWithTwitter(link) {
    const url = `https://twitter.com/intent/tweet?text=${link}`;
    window.open(url, '_blank');
  }

  function notification(obj) {
    let notificationId = new Date().getTime().toString();
    const linkUrl = obj.url;

    let options = {
      type: 'basic',
      title: 'Link postado com sucessso!',
      message: obj.title,
      iconUrl: './src/images/icon128.png',
      buttons: [
        {
          title: 'I want to share with Facebook',
          // iconUrl: './src/images/fbIcon.png'
        },
        {
          title: 'I want to share with Twitter',
          // iconUrl: './src/images/twIcon.png'
        },
      ],
    };

    chrome.notifications.create(notificationId, options);

    chrome.notifications.onButtonClicked.addListener((notifId, btnIndex) => {
      if (notifId === notificationId) {
        if (btnIndex === 0) {
          _shareWithFacebook(linkUrl);
        } else {
          _shareWithTwitter(linkUrl);
        }
      }
    });
  }

  function _handleResponse(obj) {
    input.value = '';
    button.classList.remove('is-loading');

    notification(obj);
  }

	function sendData(dataObj) {
    const myToken = localStorage.getItem('kn_ext');

    let xhr = new XMLHttpRequest();

    xhr.open('POST', 'http://knowledge.labcodes.com.br/api/links/create/', true);

    xhr.setRequestHeader('accept', 'application/json');
    xhr.setRequestHeader('content-type', 'application/json');
    xhr.setRequestHeader('Authorization', `Token ${myToken}`);

    xhr.onreadystatechange = () => {
      switch(xhr.readyState) {
        case 4:
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

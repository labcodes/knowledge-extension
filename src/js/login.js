(function() {
	'use strict';

  const loginBtn = document.querySelector('#btn-login');

  const formLogin = document.querySelector('#formLogin');
  const formTags = document.querySelector('#formTags');

  loginBtn.addEventListener('click', (evt) => {
    evt.preventDefault();

    formLogin.classList.add('is-hidden');
    formTags.classList.remove('is-hidden');

    console.warn('DALE PAPAI!');
  }, false)
})();

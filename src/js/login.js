(function() {
	'use strict';

  const loginBtn = document.querySelector('#btn-login');

  const formLogin = document.querySelector('#formLogin');
  const formTags = document.querySelector('#formTags');

  const email = document.querySelector('#email');
  const password = document.querySelector('#password');

  const error = document.querySelector('#error');

  // ====

  function _hideFormLogin() {
    formLogin.classList.add('is-hidden');
    formTags.classList.remove('is-hidden');
  }

  function _handleError(msg) {
    email.value = '';
    password.value = '';

    loginBtn.classList.remove('is-loading');
    error.classList.remove('is-hidden');

    error.innerHTML = msg;
  }

  function _handleLoginApi(obj) {
    if (obj.auth_token) {
      localStorage.setItem('kn_ext', obj.auth_token);
      _hideFormLogin();
    } else {
      _handleError(obj.non_field_errors[0]);
    }
  }

  function _handleLogin(userObj) {
    let xhr = new XMLHttpRequest();

    xhr.open('POST', 'https://knowledge.labcodes.com.br/api/auth/login/', true);

    xhr.setRequestHeader('accept', 'application/json');
    xhr.setRequestHeader('content-type', 'application/json');

    xhr.onreadystatechange = function() {
      switch(xhr.readyState) {
        case 4:
          _handleLoginApi(JSON.parse(xhr.responseText));
        break;
      }
    };

    xhr.send(JSON.stringify(userObj));
  }

  function handleForm(evt) {
    evt.preventDefault();

    if (email.value && password.value) {
      loginBtn.classList.add('is-loading');

      let obj = {
        username: email.value,
        password: password.value
      };

      _handleLogin(obj);
    }
  }

  // ====

  document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('kn_ext')) {
      _hideFormLogin();
    }

    formLogin.addEventListener('submit', handleForm, false); }, false);
})();

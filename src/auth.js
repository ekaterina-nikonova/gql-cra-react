import { signin, signout, signup } from './api';

export const authSignup = data => {
  const success = response => {
    if (!response.data.csrf) {
      failure(response);
    } else {
      localStorage.csrf = response.data.csrf;
      localStorage.setItem('signedIn', 'true');
    }
  };

  const failure = error => {
    delete localStorage.csrf;
    delete localStorage.signedIn;
    console.log('ERR', error);
  };

  signup(data)
    .then(response => success(response))
    .catch(error => failure(error));
};

export const authLogin = data => {
  const success = response => {
    if (!response.data.csrf) {
      failure(response);
    } else {
      localStorage.csrf = response.data.csrf;
      localStorage.setItem('signedIn', 'true');
    }
  };
  const failure = error => {
    console.log('ERR', error);
  };

  signin(data)
    .then(response => success(response))
    .catch(error => failure(error));
};

export const authLogout = () => {
  const success = response => {
    delete localStorage.csrf;
    localStorage.setItem('signedIn', '');
  };

  const failure = error => console.log(error);

  signout()
    .then(response => success(response))
    .catch(error => failure(error))
};

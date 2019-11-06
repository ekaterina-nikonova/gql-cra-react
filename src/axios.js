import axios from 'axios';

const plain = axios.create({
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

const secured = axios.create({
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

secured.interceptors.request.use(config => {
  const method = config.method.toUpperCase;
  if (method !== 'OPTIONS' && method !== 'GET') {
    config.headers = {
      ...config.headers,
      'X-CSRF-TOKEN': localStorage.csrf
    }
  }
  return config;
});

secured.interceptors.response.use(null, error => {
  if (error.response && error.response.config && error.response.status === 401) {
    return plain.post(
      '/refresh',
      {},
      { headers: { 'X-CSRF-TOKEN': localStorage.csrf } }
    ).then(response => {
      localStorage.csrf = response.data.csrf;
      localStorage.signedIn = true;

      const retryConfig = error.response.config;
      retryConfig.headers['X-CSRF-TOKEN'] = localStorage.csrf;
      return plain.request(retryConfig);
    }).catch(error => {
      delete localStorage.csrf;
      delete localStorage.signedIn;
      window.location.replace('/');
      return Promise.reject(error);
    })
  } else {
    return Promise.reject(error);
  }
});

export default { secured, plain };

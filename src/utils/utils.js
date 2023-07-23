import jwt_decode from 'jwt-decode';

const getToken = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = user?.accessToken ? user.accessToken : '';
  return token;
};

const isTokenExpired = () => {
  const token = getToken();
  if (!token) return true;

  const decodedToken = jwt_decode(token);
  const currentDate = new Date();

  if (decodedToken.exp * 1000 < currentDate.getTime()) {
    return true;
  }

  return false;
};

const isLogined = () => {
  return JSON.parse(localStorage.getItem('isLogined') || false);
};

const isAdmin = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user?.role === 'admin';
};

const formatDate = date => {
  const d = new Date(date);
  const year = d.getFullYear();
  let month = '' + (d.getMonth() + 1);
  let day = '' + d.getDate();

  if (month.length < 2) {
    month = '0' + month;
  }
  if (day.length < 2) {
    day = '0' + day;
  }

  return [year, month, day].join('-');
};

const getHumanDate = date => {
  if (!date) return;

  const d = date.split('-');
  const day = d.pop();
  const month = d.pop();
  const year = d.pop();

  return [day, month, year].join('-');
};

const fetchAsBlob = url => fetch(url).then(response => response.blob());

const convertBlobToBase64 = blob =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });

export {
  getToken,
  isTokenExpired,
  isLogined,
  isAdmin,
  formatDate,
  getHumanDate,
  fetchAsBlob,
  convertBlobToBase64,
};

import { getToken } from '../utils/utils';

const BASE_URL =
  process.env.NODE_ENV === 'development'
    ? process.env.REACT_APP_DEV_API_URL
    : process.env.REACT_APP_PROD_API_URL;

const GITHUB_FILE_BASE_URL = process.env.REACT_APP_GITHUB_FILE_BASE_URL;

const METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
};

const ENDPOINTS = {
  NEWS: 'news',
  USERS: 'users',
  BOOKS: 'books',
  LOGIN: 'login',
  REGISTER: 'register',
  SCHEDULES: 'schedules',
  LESSONS: 'lessons',
};

const fetchRequest = async ({ url, method, data }) => {
  try {
    const TOKEN = getToken();

    const response = await fetch(`${BASE_URL}${url}`, {
      method,
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${TOKEN}`,
      },
    });

    const json = await response.json();
    return json;
  } catch (e) {
    console.log('Ошибка при подключении к серверу.');
  }
};

const getFilesRequest = async () => {
  try {
    const GITHUB_ALL_FILES_URL = process.env.REACT_APP_GITHUB_ALL_FILES_URL;

    const response = await fetch(GITHUB_ALL_FILES_URL, {
      method: METHODS.GET,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const json = await response.json();
    return json;
  } catch (e) {
    console.log('Ошибка при подключении к серверу.');
  }
};

export {
  fetchRequest,
  getFilesRequest,
  METHODS,
  ENDPOINTS,
  GITHUB_FILE_BASE_URL,
};

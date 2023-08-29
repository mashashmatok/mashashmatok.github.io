import { ENDPOINTS, METHODS, fetchRequest } from 'services/api';
import { Link, useNavigate } from 'react-router-dom';

import { ReactComponent as LockIcon } from 'assets/icons/lock.svg';
import PageWrapper from 'components/PageWrapper';
import { ROUTES } from 'utils/routes';
import { ReactComponent as UserIcon } from 'assets/icons/user.svg';
import styles from './Auth.module.scss';
import { useState } from 'react';

const defaultUser = {
  email: '',
  password: '',
};

const Register = () => {
  const [user, setUser] = useState(defaultUser);
  const [waring, setWarning] = useState('');

  const navigate = useNavigate();

  const addUser = newUser => {
    fetchRequest({
      url: ENDPOINTS.USERS,
      method: METHODS.POST,
      data: newUser,
    }).then(response => {
      if (!response) return;

      switch (response) {
        case 'Email already exists':
          setWarning('Данный пользователь уже существует');
          break;
        case 'Email format is invalid':
          setWarning('Введены неверные данные');
          break;
        case 'Email and password are required':
          setWarning('Укажите email и пароль');
          break;

        default:
          setWarning('');

          localStorage.setItem(
            'user',
            JSON.stringify({
              accessToken: response?.accessToken,
              ...response?.user,
            }),
          );

          navigate('/');
          break;
      }
    });
  };

  const handleInputChange = event => {
    const fieldId = event.target.id;
    const fieldValue = event.target.value;

    switch (fieldId) {
      case 'loginId':
        setUser(prev => ({ ...prev, email: fieldValue }));
        break;
      case 'passwordId':
        setUser(prev => ({ ...prev, password: fieldValue }));
        break;
      default:
        break;
    }
  };

  return (
    <PageWrapper>
      <form className={styles.auth_form} autoComplete="off">
        <ul>
          <li>
            <label htmlFor="loginId">Почта:</label>
            <input id="loginId" type="email" onChange={handleInputChange} />
            <UserIcon className={styles.input_icon} />
          </li>
          <li>
            <label htmlFor="passwordId">Пароль:</label>
            <input
              id="passwordId"
              type="password"
              onChange={handleInputChange}
            />
            <LockIcon className={styles.input_icon} />
          </li>
          <li>
            {!!waring.length && <p style={{ color: 'red' }}>{waring}</p>}
            <Link to={ROUTES.LOGIN}>Уже есть аккаунт</Link>
          </li>
          <li>
            <button
              className="primary"
              onClick={e => {
                e.preventDefault();
                addUser(user);
              }}
            >
              Регистрация
            </button>
          </li>
        </ul>
      </form>
    </PageWrapper>
  );
};

export default Register;

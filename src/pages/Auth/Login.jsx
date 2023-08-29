import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchRequest, METHODS, ENDPOINTS } from 'services/api';
import { ROUTES } from 'utils/routes';
import { ReactComponent as UserIcon } from 'assets/icons/user.svg';
import { ReactComponent as LockIcon } from 'assets/icons/lock.svg';
import PageWrapper from 'components/PageWrapper';
import styles from './Auth.module.scss';

const defaultUser = {
  email: '',
  password: '',
};

const Login = () => {
  const [user, setUser] = useState(defaultUser);
  const [waring, setWarning] = useState('');

  const navigate = useNavigate();

  const loginUser = currentUser => {
    fetchRequest({
      url: ENDPOINTS.LOGIN,
      method: METHODS.POST,
      data: currentUser,
    }).then(response => {
      if (!response) return;

      if (
        response === 'Email format is invalid' ||
        response === 'Email and password are required' ||
        response === 'Incorrect password' ||
        response === 'Cannot find user'
      ) {
        setWarning('Неправильный логин или пароль');
      } else {
        setWarning('');

        localStorage.setItem(
          'user',
          JSON.stringify({
            accessToken: response?.accessToken,
            ...response?.user,
          }),
        );
        localStorage.setItem('isLogined', true);

        setUser(defaultUser);
        navigate('/');
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
            {!!waring.length && <p>{waring}</p>}
            <Link to={ROUTES.REGISTER}>Еще нет аккаунта</Link>
          </li>
          <li>
            <button
              className="primary"
              onClick={e => {
                e.preventDefault();
                loginUser(user);
              }}
            >
              Войти
            </button>
          </li>
        </ul>
      </form>
    </PageWrapper>
  );
};

export default Login;

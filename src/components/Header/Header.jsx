import { Link, useNavigate } from 'react-router-dom';
import { isTokenExpired, isAdmin } from 'utils/utils';
import { ROUTES } from 'utils/routes';
import { ReactComponent as BurgerIcon } from 'assets/icons/burger.svg';
import GroupLogo from 'assets/icons/17ki.svg';
import styles from './Header.module.scss';

const Header = () => {
  const navigate = useNavigate();

  const logoutHandler = () => {
    localStorage.removeItem('user');
    localStorage.setItem('isLogined', false);
    navigate('/');
  };

  const renderBurger = () => {
    return (
      <div className={styles.burger_container}>
        <BurgerIcon className={styles.burger_icon} />
        <ul className={styles.burger_menu}>
          {!isTokenExpired() && isAdmin() && (
            <li>
              <Link to={ROUTES.NEWS_EDIT}>Новости &#9733;</Link>
            </li>
          )}
          {!isTokenExpired() && isAdmin() && (
            <li>
              <Link to={ROUTES.BOOKS_EDIT}>Книги &#9733;</Link>
            </li>
          )}
          {!isTokenExpired() && isAdmin() && (
            <li>
              <Link to={ROUTES.SCHEDULE_EDIT}>Расписание &#9733;</Link>
            </li>
          )}
          {!isTokenExpired() && isAdmin() && (
            <li>
              <Link
                to={process.env.REACT_APP_GITHUB_FILE_SERVER_URL}
                target="_blank"
              >
                Файлы &#9733;
              </Link>
            </li>
          )}
          {isTokenExpired() ? (
            <li>
              <Link to={ROUTES.LOGIN}>Войти</Link>
            </li>
          ) : (
            <li>
              <Link to={ROUTES.MAIN} onClick={logoutHandler}>
                Выйти &#9733;
              </Link>
            </li>
          )}
        </ul>
      </div>
    );
  };

  return (
    <nav className={styles.navbar}>
      <Link to={ROUTES.MAIN} className={styles.nav_link_wrapper}>
        <img src={GroupLogo} alt="GroupLogo" />
        <h1>{process.env.REACT_APP_WEBSITE_NAME}</h1>
      </Link>
      <ul>
        <li>
          <Link to={ROUTES.MAIN}>Новости</Link>
        </li>
        <li>
          <Link to={ROUTES.BOOKS}>Книги</Link>
        </li>
        <li>
          <Link to={ROUTES.SCHEDULE}>Расписание</Link>
        </li>
        {/* {!isTokenExpired() && (
          <li>
            <i>| </i>
            <Link to={ROUTES.NEWS_EDIT}>&#x270e; Новости</Link>
          </li>
        )}
        {!isTokenExpired() && (
          <li>
            <i>| </i>
            <Link to={ROUTES.BOOKS_EDIT}> &#x21bb; Книги</Link>
          </li>
        )}
        {!isTokenExpired() && (
          <li>
            <i>| </i>
            <Link to={ROUTES.SCHEDULE_EDIT}>&#x231a; Расписание</Link>
          </li>
        )}
        {!isTokenExpired() && (
          <li>
            <i>| </i>
            <Link
              to={process.env.REACT_APP_GITHUB_FILE_SERVER_URL}
              target="_blank"
            >
              &#x267b; Файлы
            </Link>
          </li>
        )}
        {isTokenExpired() ? (
          <li>
            <i>| </i>
            <Link to={ROUTES.LOGIN}>Войти</Link>
          </li>
        ) : (
          <li>
            <i>| </i>
            <Link to={ROUTES.MAIN} onClick={logoutHandler}>
              Выйти
            </Link>
          </li>
        )} */}
        <li>{renderBurger()}</li>
      </ul>
    </nav>
  );
};

export default Header;

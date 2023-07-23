import React, { Fragment, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { isTokenExpired, isLogined } from './utils/utils';
import { ROUTES } from './utils/routes';
import PrivateRoute from 'components/PrivateRoute/PrivateRoute';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Schedule from './pages/Schedule';
import ScheduleEdit from './pages/ScheduleEdit';
import Main from './pages/Main';
import News from './pages/News';
import NewsEdit from './pages/NewsEdit';
import Books from './pages/Books';
import Book from './pages/Book';
import BooksEdit from './pages/BooksEdit';
import Error from './pages/Error';
import './styles/index.scss';

const App = () => {
  useEffect(() => {
    const id = setInterval(() => {
      if (isTokenExpired() && isLogined()) {
        localStorage.setItem('isLogined', false);
        navigate('/');
      }
    }, 10000);

    return () => {
      clearInterval(id);
    };
  }, []);

  const navigate = useNavigate();

  return (
    <>
      <Fragment>
        <Routes>
          <Route path={ROUTES.LOGIN} exact element={<Login />} />
          {/* <Route path={ROUTES.REGISTER} exact element={<Register />} /> */}
          <Route path={ROUTES.SCHEDULE} exact element={<Schedule />} />
          <Route path={ROUTES.MAIN} exact element={<Main />} />
          <Route path={ROUTES.NEWS + '/:id'} exact element={<News />} />
          <Route path={ROUTES.BOOKS} exact element={<Books />} />
          <Route path={ROUTES.BOOK + '/:id'} exact element={<Book />} />
          {/* <Route exact path={ROUTES.NEWS_EDIT} element={<PrivateRoute />}>
            <Route exact path={ROUTES.NEWS_EDIT} element={<NewsEdit />} />
          </Route>
          <Route exact path={ROUTES.BOOKS_EDIT} element={<PrivateRoute />}>
            <Route exact path={ROUTES.BOOKS_EDIT} element={<BooksEdit />} />
          </Route>

          <Route exact path={ROUTES.SCHEDULE_EDIT} element={<PrivateRoute />}>
            <Route exact path={ROUTES.SCHEDULE_EDIT} element={<ScheduleEdit />} />
          </Route> */}
          <Route element={<PrivateRoute />}>
            <Route exact path={ROUTES.NEWS_EDIT} element={<NewsEdit />} />
            <Route exact path={ROUTES.BOOKS_EDIT} element={<BooksEdit />} />
            <Route
              exact
              path={ROUTES.SCHEDULE_EDIT}
              element={<ScheduleEdit />}
            />
          </Route>
          <Route path="*" element={<Error />} />
        </Routes>
      </Fragment>
    </>
  );
};

export default App;

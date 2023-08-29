import { ENDPOINTS, fetchRequest } from 'services/api';
import { useEffect, useState } from 'react';

import { Link } from 'react-router-dom';
import { NEWS_PER_PAGE } from 'utils/constants';
import PageWrapper from 'components/PageWrapper';
import { ROUTES } from 'utils/routes';
import React from 'react';
import { getHumanDate } from 'utils/utils';
import noImage from 'assets/images/no-image.jpeg';
import styles from './Main.module.scss';

const Main = () => {
  const [news, setNews] = useState([]);
  const [newsCount, setNewsCount] = useState(0);
  const [newsOffset, setNewsOffset] = useState(1);
  const [scrollableElement, setScrollableElement] = useState(null);

  const getNewsCount = () => {
    try {
      fetchRequest({
        url: ENDPOINTS.NEWS + `?isHidden_ne=true`,
      }).then(news => {
        if (!news) return;
        setNewsCount(news.length);
      });
    } catch (e) {}
  };

  const getNews = offset => {
    try {
      fetchRequest({
        url:
          ENDPOINTS.NEWS +
          `?_page=${offset}&_limit=${NEWS_PER_PAGE}&_sort=id&_order=desc&isHidden_ne=true`,
      }).then(news => {
        if (!news) return;
        setNews(prev => [...prev, ...news]);
        setNewsOffset(prev => prev + 1);
      });
    } catch (e) {}
  };

  useEffect(() => {
    getNewsCount();
    getNews(newsOffset);
  }, []);

  useEffect(() => {
    if (news?.length <= NEWS_PER_PAGE) return;

    scrollableElement?.scrollIntoView({
      behavior: 'smooth',
    });
  }, [news]);

  const renderNews = news => {
    return (
      <div>
        {news?.length ? (
          <ul className={styles.news_list}>
            {news?.map(({ id, title, imageURL, createdAt }) => (
              <li className={styles.news_block} key={id}>
                <h2>{title}</h2>
                <Link
                  to={ROUTES.NEWS + '/' + id}
                  className={styles.image_wraper}
                >
                  <img
                    src={imageURL?.length ? imageURL : noImage}
                    alt={`Изображение для ${title}`}
                    onError={e => {
                      e.target.src = noImage;
                    }}
                  />
                </Link>
                <div className={styles.more_block}>
                  <span>{getHumanDate(createdAt)}</span>
                  <Link to={ROUTES.NEWS + '/' + id}>Подробнее</Link>
                </div>
              </li>
            ))}
          </ul>
        ) : null}

        <div
          className={styles.more_news_block}
          ref={el => setScrollableElement(el)}
        >
          {newsCount > news.length ? (
            <button className="primary" onClick={() => getNews(newsOffset)}>
              Загрузить еще...
            </button>
          ) : null}
        </div>
      </div>
    );
  };

  return (
    <PageWrapper>
      <h1>Новости</h1>
      {renderNews(news)}
    </PageWrapper>
  );
};

export default Main;

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchRequest, ENDPOINTS } from 'services/api';
import PageWrapper from 'components/PageWrapper';
import noImage from 'assets/images/no-image.png';
import { getHumanDate } from 'utils/utils';
import styles from './News.module.scss';

const News = () => {
  const { id: newsId } = useParams(null);
  const [news, setNews] = useState({});
  const [isNewsNotFound, setIsNewsNotFound] = useState(false);
  const { title, text, imageURL, createdAt } = news;

  const getNews = () => {
    fetchRequest({ url: ENDPOINTS.NEWS + `/${newsId}` }).then(news => {
      if (!news) return;

      if (news?.id) {
        setNews(news);
      } else {
        setIsNewsNotFound(true);
      }
    });
  };

  useEffect(() => {
    if (!newsId) return;

    getNews();
  }, [newsId]);

  return (
    <PageWrapper>
      {news?.id ? (
        <div>
          <h1 className={styles.title}>{title}</h1>
          <span className={styles.date}>
            Дата публикации {getHumanDate(createdAt)}
          </span>
          <img
            className={styles.newsImage}
            src={imageURL?.length ? imageURL : noImage}
            alt={`Изображение для ${title}`}
            onError={e => {
              e.target.src = noImage;
            }}
          />
          <div
            className={styles.news_text}
            dangerouslySetInnerHTML={{ __html: text }}
          ></div>
        </div>
      ) : null}
      {isNewsNotFound && (
        <h1 className={styles.title_warning}>Новость не найдена</h1>
      )}
    </PageWrapper>
  );
};

export default News;

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
  const { title, text, imageURL, createdAt } = news;

  const getNews = () => {
    fetchRequest({ url: ENDPOINTS.NEWS + `/${newsId}` }).then(news => {
      if (!news) return;
      setNews(news);
    });
  };

  useEffect(() => {
    if (!newsId) return;

    getNews();
  }, [newsId]);

  return (
    <PageWrapper>
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
      <p className={styles.news_text}>{text}</p>
    </PageWrapper>
  );
};

export default News;

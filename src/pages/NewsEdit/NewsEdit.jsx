import { useEffect, useState } from 'react';
import PageWrapper from 'components/PageWrapper';
import {
  fetchRequest,
  getFilesRequest,
  METHODS,
  ENDPOINTS,
  GITHUB_FILE_BASE_URL,
} from 'services/api';
import { formatDate } from 'utils/utils';
import ConfirmModal from 'components/Modal/ConfirmModal';
import Tooltip from 'components/Tooltip';
import styles from './NewsEdit.module.scss';

const DEFAULT_NEWS = {
  userId: 1,
  createdAt: formatDate(new Date()),
  isHidden: false,
  title: '',
  text: '',
  imageURL: '',
};

const NewsEdit = () => {
  const [news, setNews] = useState([]);
  const [currentNews, setCurrentNews] = useState(DEFAULT_NEWS);
  const [imagesFiles, setImagesFiles] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isNewsModalOpen, setIsNewsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [imagePreviewOpen, isImagePreviewOpen] = useState(false);

  const sortNews = news => {
    return (
      news?.sort((a, b) => {
        return b.id - a.id;
      }) || []
    );
  };

  const getNews = () => {
    fetchRequest({ url: ENDPOINTS.NEWS }).then(news => {
      if (!news) return;
      setNews(sortNews(news));
    });
  };

  const getImagesFiles = () => {
    getFilesRequest().then(({ tree }) => {
      if (!tree) return;
      const images =
        tree?.filter(({ path }) => path.startsWith('images/')) || [];
      setImagesFiles(images);
    });
  };

  useEffect(() => {
    getNews();
    getImagesFiles();
  }, []);

  const resetNews = () => {
    setErrorMessage('');
    setIsNewsModalOpen(false);
    setIsDeleteModalOpen(false);
    setCurrentNews(DEFAULT_NEWS);
  };

  const hideNews = newsId => {
    setCurrentNews(DEFAULT_NEWS);

    fetchRequest({
      url: [ENDPOINTS.NEWS, newsId].join('/'),
      method: METHODS.PATCH,
      data: {
        isHidden: true,
      },
    }).then(getNews);
  };

  const showNews = newsId => {
    setCurrentNews(DEFAULT_NEWS);

    fetchRequest({
      url: [ENDPOINTS.NEWS, newsId].join('/'),
      method: METHODS.PATCH,
      data: {
        isHidden: false,
      },
    }).then(getNews);
  };

  const addNews = newNews => {
    setIsNewsModalOpen(false);
    setCurrentNews(DEFAULT_NEWS);

    fetchRequest({
      url: ENDPOINTS.NEWS,
      method: METHODS.POST,
      data: newNews,
    }).then(getNews);
  };

  const saveNews = editableNews => {
    setIsNewsModalOpen(false);
    setCurrentNews(DEFAULT_NEWS);

    fetchRequest({
      url: [ENDPOINTS.NEWS, editableNews.id].join('/'),
      method: METHODS.PATCH,
      data: editableNews,
    }).then(getNews);
  };

  const deleteNews = newsId => {
    setIsDeleteModalOpen(false);
    setCurrentNews(DEFAULT_NEWS);

    fetchRequest({
      url: [ENDPOINTS.NEWS, newsId].join('/'),
      method: METHODS.DELETE,
    }).then(getNews);
  };

  const checkRequirements = () => {
    if (currentNews.title.length && currentNews.text.length) {
      setErrorMessage('');
      return true;
    }

    setErrorMessage('Заполните все необходимые поля');
    return false;
  };

  const handleFieldChange = event => {
    const fieldId = event.target.id;
    const fieldValue = event.target.value;

    setErrorMessage('');

    switch (fieldId) {
      case 'newsTitle':
        setCurrentNews(prev => ({ ...prev, title: fieldValue }));
        break;
      case 'newsImageLink':
        setCurrentNews(prev => ({
          ...prev,
          imageURL: fieldValue.length
            ? GITHUB_FILE_BASE_URL + `images/` + fieldValue
            : '',
        }));
        break;
      case 'newsText':
        setCurrentNews(prev => ({ ...prev, text: fieldValue }));
        break;
      default:
        break;
    }
  };

  const renderNewsList = news => {
    return (
      <div className={styles.newslist_container}>
        <ol>
          {news.map(newsItem => {
            const { id, title, isHidden } = newsItem;

            return (
              <li key={id}>
                <span
                  style={{
                    textDecoration: isHidden ? 'line-through' : 'none',
                  }}
                  onClick={() => {
                    setCurrentNews({
                      ...DEFAULT_NEWS,
                      ...newsItem,
                    });
                    setIsNewsModalOpen(true);
                  }}
                >
                  {title}
                </span>
                {isHidden ? (
                  <button
                    className="outlined"
                    id={`show_news_${id}`}
                    onClick={() => showNews(id)}
                  >
                    Отобразить
                  </button>
                ) : (
                  <button
                    className="secondary"
                    id={`hide_news_${id}`}
                    onClick={() => hideNews(id)}
                  >
                    Скрыть
                  </button>
                )}
                <button
                  className="warning"
                  id={`delete_news_${id}`}
                  onClick={() => {
                    setIsDeleteModalOpen(true);
                    setCurrentNews(prev => ({ ...prev, id, title }));
                  }}
                >
                  Удалить
                </button>
              </li>
            );
          })}
        </ol>
        <button className="primary" onClick={() => setIsNewsModalOpen(true)}>
          Добавить
        </button>
      </div>
    );
  };

  const renderSelectList = (filesList, selectId, defaultValue) => {
    return (
      <Tooltip imageURL={imagePreviewOpen ? currentNews.imageURL : ''}>
        <select
          id={selectId}
          onChange={handleFieldChange}
          value={defaultValue || ''}
          onMouseEnter={() => isImagePreviewOpen(true)}
          onMouseLeave={() => isImagePreviewOpen(false)}
          onClick={() => isImagePreviewOpen(false)}
        >
          <option value="">-</option>
          {filesList?.map(({ sha, path }) => {
            const fileName = path.split('/').pop();

            return (
              <option key={`file_${sha}`} value={fileName}>
                {fileName}
              </option>
            );
          })}
        </select>
      </Tooltip>
    );
  };

  const renderNewsForm = () => {
    return (
      <form className={styles.news_form} autoComplete="off">
        <ul>
          <li>
            <label htmlFor="newsTitle">Заголовок</label>
            <input
              id="newsTitle"
              type="text"
              maxLength="80"
              autoFocus
              required
              placeholder="Название новости"
              value={currentNews.title}
              onChange={handleFieldChange}
              className={
                errorMessage.length && !currentNews.title.length
                  ? 'required_field_warning'
                  : ''
              }
            />
          </li>
          <li>
            <label htmlFor="newsImageLink">Фото</label>
            {renderSelectList(
              imagesFiles,
              'newsImageLink',
              currentNews?.imageURL?.split('/').pop(),
            )}
          </li>
          <li>
            <label htmlFor="newsText">Текст</label>
            <textarea
              name=""
              id="newsText"
              cols="30"
              rows="10"
              required
              value={currentNews.text}
              onChange={handleFieldChange}
              className={
                errorMessage.length && !currentNews.text.length
                  ? 'required_field_warning'
                  : ''
              }
            ></textarea>
          </li>
        </ul>
        <span className="warning_message">
          {errorMessage.length ? errorMessage : ''}
        </span>
      </form>
    );
  };

  return (
    <PageWrapper>
      <h1>Редактирование Новостей</h1>
      <h3>Список новостей</h3>
      {renderNewsList(news)}

      {isNewsModalOpen ? (
        <ConfirmModal
          open
          width="1100"
          title={
            currentNews.id ? 'Редактирование новости' : 'Добавление новости'
          }
          okTitle={currentNews.id ? 'Сохранить' : 'Добавить'}
          onOk={
            currentNews.id
              ? () => saveNews(currentNews)
              : () => addNews(currentNews)
          }
          onCancel={resetNews}
          onValidate={checkRequirements}
        >
          {renderNewsForm()}
        </ConfirmModal>
      ) : null}
      {isDeleteModalOpen ? (
        <ConfirmModal
          open
          type="danger"
          title="Удаление новости"
          text="Вы действительно хотите удалить эту новость?"
          accentText={currentNews.title}
          okTitle="Удалить"
          onOk={() => deleteNews(currentNews.id)}
          onCancel={resetNews}
        />
      ) : null}
    </PageWrapper>
  );
};

export default NewsEdit;

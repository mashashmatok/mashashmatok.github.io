import {
  ENDPOINTS,
  GITHUB_FILE_BASE_URL,
  METHODS,
  fetchRequest,
  getFilesRequest,
} from 'services/api';
import { useEffect, useState } from 'react';

import ConfirmModal from 'components/Modal/ConfirmModal';
import PageWrapper from 'components/PageWrapper';
import Tooltip from 'components/Tooltip';
import { formatDate } from 'utils/utils';
import styles from './BooksEdit.module.scss';

const DEFAULT_BOOK = {
  userId: 1,
  createdAt: formatDate(new Date()),
  isHidden: false,
  title: '',
  imageURL: '',
  pdfURL: '',
};

const BooksEdit = () => {
  const [books, setBooks] = useState([]);
  const [booksFiles, setBooksFiles] = useState([]);
  const [imagesFiles, setImagesFiles] = useState([]);
  const [currentBook, setCurrentBook] = useState(DEFAULT_BOOK);
  const [errorMessage, setErrorMessage] = useState('');
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [imagePreviewOpen, isImagePreviewOpen] = useState(false);

  const sortBooks = books => {
    return (
      books?.sort((a, b) => {
        return b.id - a.id;
      }) || []
    );
  };

  const getBooks = () => {
    fetchRequest({ url: ENDPOINTS.BOOKS }).then(books => {
      if (!books) return;
      setBooks(sortBooks(books));
    });
  };

  const getBooksFiles = () => {
    getFilesRequest().then(({ tree }) => {
      if (!tree) return;
      const pdfs = tree?.filter(({ path }) => path.startsWith('books/')) || [];
      setBooksFiles(pdfs);
    });
  };

  const getImagesFiles = () => {
    getFilesRequest().then(({ tree }) => {
      if (!tree) return;
      let images = tree?.filter(({ path }) => path.startsWith('images/')) || [];
      setImagesFiles(images);
    });
  };

  useEffect(() => {
    getBooks();
    getBooksFiles();
    getImagesFiles();
  }, []);

  const resetBook = () => {
    setErrorMessage('');
    setIsDeleteModalOpen(false);
    setIsBookModalOpen(false);
    setCurrentBook(DEFAULT_BOOK);
  };

  const hideBook = bookId => {
    setCurrentBook(DEFAULT_BOOK);

    fetchRequest({
      url: [ENDPOINTS.BOOKS, bookId].join('/'),
      method: METHODS.PATCH,
      data: {
        isHidden: true,
      },
    }).then(getBooks);
  };

  const showBook = bookId => {
    setCurrentBook(DEFAULT_BOOK);

    fetchRequest({
      url: [ENDPOINTS.BOOKS, bookId].join('/'),
      method: METHODS.PATCH,
      data: {
        isHidden: false,
      },
    }).then(getBooks);
  };

  const addBook = newBook => {
    setIsBookModalOpen(false);
    setCurrentBook(DEFAULT_BOOK);

    fetchRequest({
      url: ENDPOINTS.BOOKS,
      method: METHODS.POST,
      data: newBook,
    }).then(getBooks);
  };

  const saveBook = editableBook => {
    setIsBookModalOpen(false);
    setCurrentBook(DEFAULT_BOOK);

    fetchRequest({
      url: [ENDPOINTS.BOOKS, editableBook.id].join('/'),
      method: METHODS.PATCH,
      data: editableBook,
    }).then(getBooks);
  };

  const deleteBook = bookId => {
    setIsDeleteModalOpen(false);
    setCurrentBook(DEFAULT_BOOK);

    fetchRequest({
      url: [ENDPOINTS.BOOKS, bookId].join('/'),
      method: METHODS.DELETE,
    }).then(getBooks);
  };

  const checkRequirements = () => {
    if (currentBook.title.trim().length && currentBook.pdfURL.trim().length) {
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
      case 'bookTitle':
        setCurrentBook(prev => ({ ...prev, title: fieldValue }));
        break;
      case 'bookImageLink':
        setCurrentBook(prev => ({
          ...prev,
          imageURL: fieldValue.length
            ? GITHUB_FILE_BASE_URL + `images/` + fieldValue
            : '',
        }));
        break;
      case 'bookPdfLink':
        setCurrentBook(prev => ({
          ...prev,
          pdfURL: fieldValue.length
            ? GITHUB_FILE_BASE_URL + `books/` + fieldValue
            : '',
        }));
        break;
      default:
        break;
    }
  };

  const renderBooksList = books => {
    return (
      <div className={styles.bookslist_container}>
        <ol>
          {books.map(book => {
            const { id, title, imageURL, pdfURL, isHidden } = book;

            return (
              <li key={id}>
                <span
                  style={{
                    textDecoration: isHidden ? 'line-through' : 'none',
                  }}
                  onClick={() => {
                    setCurrentBook({
                      ...DEFAULT_BOOK,
                      id,
                      title,
                      isHidden,
                      imageURL,
                      pdfURL,
                    });
                    setIsBookModalOpen(true);
                  }}
                >
                  {title}
                </span>
                {isHidden ? (
                  <button
                    className="outlined"
                    id={`show_book_${id}`}
                    onClick={() => showBook(id)}
                  >
                    Отобразить
                  </button>
                ) : (
                  <button
                    className="secondary"
                    id={`hide_book_${id}`}
                    onClick={() => hideBook(id)}
                  >
                    Скрыть
                  </button>
                )}
                <button
                  className="warning"
                  id={`delete_book_${id}`}
                  onClick={() => {
                    setIsDeleteModalOpen(true);
                    setCurrentBook(prev => ({ ...prev, id, title }));
                  }}
                >
                  Удалить
                </button>
              </li>
            );
          })}
        </ol>
        <button className="primary" onClick={() => setIsBookModalOpen(true)}>
          Добавить
        </button>
      </div>
    );
  };

  const renderSelectList = (
    filesList,
    selectId,
    defaultValue,
    isRequired,
    isToolTip,
  ) => {
    return (
      <Tooltip
        imageURL={imagePreviewOpen && isToolTip ? currentBook.imageURL : ''}
      >
        <select
          id={selectId}
          onChange={handleFieldChange}
          value={defaultValue || ''}
          required
          className={
            errorMessage.length && isRequired ? 'required_field_warning' : ''
          }
          onMouseEnter={() => isImagePreviewOpen(true)}
          onMouseLeave={() => isImagePreviewOpen(false)}
          onClick={() => isImagePreviewOpen(false)}
        >
          <option value="">-</option>
          {filesList?.map(({ path }) => {
            const fileName = path.split('/').pop();
            return (
              <option key={fileName} value={fileName}>
                {fileName}
              </option>
            );
          })}
        </select>
      </Tooltip>
    );
  };

  const renderForm = () => {
    return (
      <form className={styles.book_form} autoComplete="off">
        <ul>
          <li>
            <label htmlFor="bookTitle">Название</label>
            <input
              id="bookTitle"
              type="text"
              autoFocus
              required
              placeholder="Название книги"
              value={currentBook.title}
              onChange={handleFieldChange}
              className={
                errorMessage.length && !currentBook.title.length
                  ? 'required_field_warning'
                  : ''
              }
            />
          </li>
          <li>
            <label htmlFor="bookImageLink">Фото</label>
            {renderSelectList(
              imagesFiles,
              'bookImageLink',
              currentBook?.imageURL?.split('/').pop(),
              false,
              true,
            )}
          </li>
          <li>
            <label htmlFor="bookPdfLink">PDF-файл</label>
            {renderSelectList(
              booksFiles,
              'bookPdfLink',
              currentBook?.pdfURL?.split('/').pop(),
              !currentBook.pdfURL.length,
            )}
          </li>
        </ul>
        {errorMessage.length ? (
          <span className={styles.warning_message}>{errorMessage}</span>
        ) : null}
      </form>
    );
  };

  return (
    <PageWrapper>
      <h1>Редактирование Книг</h1>
      <h3>Список книг</h3>
      {renderBooksList(books)}
      {isBookModalOpen ? (
        <ConfirmModal
          open
          title={currentBook.id ? 'Редактирование книги' : 'Добавление книги'}
          okTitle={currentBook.id ? 'Сохранить' : 'Добавить'}
          onOk={
            currentBook.id
              ? () => saveBook(currentBook)
              : () => addBook(currentBook)
          }
          onCancel={resetBook}
          onValidate={checkRequirements}
        >
          {renderForm()}
        </ConfirmModal>
      ) : null}
      {isDeleteModalOpen ? (
        <ConfirmModal
          open
          type="danger"
          title="Удаление книги"
          text="Вы действительно хотите удалить эту книгу?"
          accentText={currentBook.title}
          okTitle="Удалить"
          onOk={() => deleteBook(currentBook.id)}
          onCancel={resetBook}
        />
      ) : null}
    </PageWrapper>
  );
};

export default BooksEdit;

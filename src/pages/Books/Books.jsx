import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from 'utils/routes';
import { fetchRequest, ENDPOINTS } from 'services/api';
import { BOOKS_PER_PAGE } from 'utils/constants';
import PageWrapper from 'components/PageWrapper';
import noImage from 'assets/images/no-book-image.png';
import styles from './Books.module.scss';

const Books = () => {
  const [books, setBooks] = useState([]);
  const [allBooks, setAllBooks] = useState([]);
  const [booksCount, setBooksCount] = useState(0);
  const [booksOffset, setBooksOffset] = useState(1);
  const [searchedBook, setSearchedBook] = useState('');
  const [scrollableElement, setScrollableElement] = useState(null);

  const getBooksCount = () => {
    fetchRequest({
      url: ENDPOINTS.BOOKS + `?isHidden_ne=true`,
    }).then(books => {
      if (!books) return;
      setBooksCount(books.length);
    });
  };

  const getAllBooks = () => {
    fetchRequest({
      url: ENDPOINTS.BOOKS + `?isHidden_ne=true`,
    }).then(books => {
      if (!books) return;
      setAllBooks(books);
    });
  };

  const getBooks = offset => {
    fetchRequest({
      url:
        ENDPOINTS.BOOKS +
        `?_page=${offset}&_limit=${BOOKS_PER_PAGE}&_sort=id&_order=desc&isHidden_ne=true`,
    }).then(books => {
      if (!books) return;
      setBooks(prev => [...prev, ...books]);
      setBooksOffset(prev => prev + 1);
    });
  };

  const getFilteredBooks = (books, searchedBook) => {
    return (
      books?.filter(({ title }) =>
        title.toLowerCase().includes(searchedBook.toLowerCase()),
      ) || []
    );
  };

  useEffect(() => {
    getAllBooks();
    getBooksCount();
    getBooks(booksOffset);
  }, []);

  useEffect(() => {
    if (books?.length <= BOOKS_PER_PAGE) return;

    scrollableElement?.scrollIntoView({
      behavior: 'smooth',
    });
  }, [books]);

  const handleSearch = event => {
    const fieldId = event.target.id;
    const fieldValue = event.target.value;

    if (fieldId === 'searchBook') {
      setSearchedBook(fieldValue);
    }
  };

  const renderSearch = () => {
    return (
      <div id="search" className={styles.search_container}>
        <input
          id="searchBook"
          type="text"
          placeholder="Поиск"
          value={searchedBook}
          onChange={handleSearch}
        />
        <button className="primary" onClick={() => setSearchedBook('')}>
          Очистить
        </button>
      </div>
    );
  };

  const renderBooks = books => {
    return (
      <div className={styles.books_container}>
        {books?.length ? (
          <ul>
            {books?.map(({ id, title, imageURL }) => (
              <li key={`book${id}`}>
                <Link to={ROUTES.BOOK + `/${id}`}>
                  <h2>{title}</h2>
                  <div>
                    <img
                      src={imageURL?.length ? imageURL : noImage}
                      alt={`Изображение для ${title}`}
                      onError={e => {
                        e.target.src = noImage;
                      }}
                    />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : null}

        <div
          className={styles.more_news_block}
          ref={el => setScrollableElement(el)}
        >
          {booksCount > books.length && !searchedBook.length ? (
            <button className="primary" onClick={() => getBooks(booksOffset)}>
              Загрузить еще...
            </button>
          ) : null}
        </div>
      </div>
    );
  };

  return (
    <PageWrapper>
      <h1>Книги</h1>
      {renderSearch()}
      {!searchedBook.length
        ? renderBooks(books)
        : renderBooks(getFilteredBooks(allBooks, searchedBook))}
    </PageWrapper>
  );
};

export default Books;

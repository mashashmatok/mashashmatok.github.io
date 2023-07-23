import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchRequest, ENDPOINTS } from 'services/api';
import { Document, Page, pdfjs } from 'react-pdf';
import PageWrapper from 'components/PageWrapper';
import styles from './Book.module.scss';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
const DEFAULT_SCALE = 2.1;

const Book = () => {
  const { id: bookId } = useParams(null);
  const [book, setBook] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageInputNumber, setPageInputNumber] = useState(1);
  const [scale, setScale] = useState(DEFAULT_SCALE);

  const getBook = () => {
    fetchRequest({ url: ENDPOINTS.BOOKS + `/${bookId}` }).then(book => {
      if (!book) return;
      setBook(book);
    });
  };

  const getFileName = book => {
    return book?.pdfURL?.split('/').pop() || null;
  };

  useEffect(() => {
    if (!bookId) return;

    getBook();
  }, [bookId]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const handleOnChange = event => {
    const value = Number.parseInt(event.target.value);

    if (isNaN(value)) return;

    if (value >= 1 && value <= numPages) {
      setPageNumber(value);
      setPageInputNumber(value);
    } else if (value < 1) {
      setPageNumber(1);
      setPageInputNumber(1);
    } else {
      setPageNumber(numPages);
      setPageInputNumber(numPages);
    }
  };

  const handlePrevPage = event => {
    event.preventDefault();

    setPageNumber(prev => {
      const value = prev > 1 ? prev - 1 : 1;
      setPageInputNumber(value);
      return value;
    });
  };

  const handleNextPage = event => {
    event.preventDefault();

    setPageNumber(prev => {
      const value = prev < numPages - 1 ? prev + 1 : numPages;
      setPageInputNumber(value);
      return value;
    });
  };

  const handleScale = action => {
    const step = 0.1;

    if (action === 'decrease') {
      setScale(prev => (prev > step ? prev - step : prev));
    } else {
      setScale(prev => prev + step);
    }
  };

  const renderControls = numPages => {
    return (
      <div className={styles.controls}>
        <p style={{ display: !numPages && 'none' }}>
          Страница <b>{pageNumber}</b> из <b>{numPages}</b>
        </p>
        <div>
          <button className="outlined" onClick={handlePrevPage}>
            &larr; Предыдущая
          </button>
          <button className="outlined" onClick={handleNextPage}>
            Следующая &rarr;
          </button>
          <input
            type="number"
            name="pages"
            size="3"
            min="1"
            max="999"
            value={pageInputNumber}
            onChange={handleOnChange}
          />
          <button className="outlined" onClick={() => handleScale('decrease')}>
            Уменьшить -
          </button>
          <button className="outlined" onClick={() => handleScale('increase')}>
            Увеличить +
          </button>
          <Link to={book?.pdfURL} target="_blank">
            Скачать
          </Link>
        </div>
      </div>
    );
  };

  return (
    <PageWrapper>
      <h2>{book?.title || ''}</h2>
      {renderControls(numPages)}
      <Document
        file={book?.pdfURL || ''}
        onLoadSuccess={onDocumentLoadSuccess}
        onClick={handleNextPage}
        onContextMenu={handlePrevPage}
        loading="Загрузка PDF файла..."
        error={`Не удалось загрузить файл ${
          !getFileName(book) ? '.' : getFileName(book)
        }`}
        noData=""
      >
        <Page pageNumber={pageNumber} scale={scale} />
      </Document>
    </PageWrapper>
  );
};

export default Book;

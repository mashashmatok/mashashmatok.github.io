import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [
      { list: 'ordered' },
      { list: 'bullet' },
      { indent: '-1' },
      { indent: '+1' },
    ],
    ['link', 'image'],
    ['clean'],
  ],
};

const formats = [
  'header',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  'bullet',
  'indent',
  'link',
  'image',
];

const HtmlTextEditor = ({ text, onTextChange }) => {
  return (
    <div className="text-editor">
      <ReactQuill
        theme="snow"
        modules={modules}
        formats={formats}
        value={text || ''}
        onChange={onTextChange}
      ></ReactQuill>
    </div>
  );
};

export default HtmlTextEditor;

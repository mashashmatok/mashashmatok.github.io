import { useState, useEffect } from 'react';
import { fetchRequest, METHODS, ENDPOINTS } from 'services/api';
import { DEFAULT_PAIRS, DEFAULT_TIMES, DEFAULT_LESSON } from 'utils/constants';
import PageWrapper from 'components/PageWrapper';
import ConfirmModal from 'components/Modal/ConfirmModal';
import styles from './ScheduleEdit.module.scss';

const ScheduleEdit = () => {
  const [time, setTime] = useState(DEFAULT_TIMES);
  const [pairs, setPairs] = useState(DEFAULT_PAIRS);
  const [currentLesson, setCurrentLesson] = useState(DEFAULT_LESSON);
  const [lessons, setLessons] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const getTime = () => {
    fetchRequest({ url: ENDPOINTS.SCHEDULES + '/1' }).then(time => {
      if (!time) return;
      setTime({ ...DEFAULT_TIMES, ...time });
    });
  };

  const getPairs = () => {
    fetchRequest({ url: ENDPOINTS.SCHEDULES + '/2' }).then(pairs => {
      if (!pairs) return;
      setPairs({ ...DEFAULT_PAIRS, ...pairs });
    });
  };

  const saveTime = time => {
    setTime(DEFAULT_TIMES);

    fetchRequest({
      url: ENDPOINTS.SCHEDULES + '/1',
      method: METHODS.PATCH,
      data: time,
    }).then(getTime);
  };

  const savePairs = pairs => {
    setPairs(DEFAULT_PAIRS);

    fetchRequest({
      url: ENDPOINTS.SCHEDULES + '/2',
      method: METHODS.PATCH,
      data: pairs,
    }).then(getPairs);
  };

  const getLessons = () => {
    fetchRequest({ url: ENDPOINTS.LESSONS + '?_sort=lesson&_order=asc' }).then(
      lessons => {
        if (!lessons) return;
        setLessons(lessons);
      },
    );
  };

  const addLesson = newLesson => {
    setErrorMessage('');
    setIsLessonModalOpen(false);
    setCurrentLesson(DEFAULT_LESSON);

    fetchRequest({
      url: ENDPOINTS.LESSONS,
      method: METHODS.POST,
      data: newLesson,
    }).then(getLessons);
  };

  const saveLesson = editableLesson => {
    setErrorMessage('');
    setIsLessonModalOpen(false);
    setCurrentLesson(DEFAULT_LESSON);

    fetchRequest({
      url: [ENDPOINTS.LESSONS, editableLesson.id].join('/'),
      method: METHODS.PATCH,
      data: editableLesson,
    }).then(getLessons);
  };

  const deleteLesson = lessonId => {
    setIsDeleteModalOpen(false);
    setCurrentLesson(DEFAULT_LESSON);

    fetchRequest({
      url: [ENDPOINTS.LESSONS, lessonId].join('/'),
      method: METHODS.DELETE,
    }).then(getLessons);
  };

  const resetLesson = () => {
    setErrorMessage('');
    setIsDeleteModalOpen(false);
    setIsLessonModalOpen(false);
    setCurrentLesson(DEFAULT_LESSON);
  };

  const checkRequirements = () => {
    if (currentLesson.lesson.length && currentLesson.teacher.length) {
      setErrorMessage('');
      return true;
    }

    setErrorMessage('Заполните все необходимые поля');
    return false;
  };

  useEffect(() => {
    getTime();
    getPairs();
    getLessons();
  }, []);

  const handleInputChange = event => {
    const fieldId = event.target.id;
    const fieldValue = event.target.value;
    const primaryKey = fieldId.split('_')[0];
    const secondaryKey = fieldId.substr(-1);

    if (fieldId.startsWith('start_pair_')) {
      setTime(prev => ({
        ...prev,
        [secondaryKey]: {
          start: fieldValue,
          end: prev[secondaryKey].end,
        },
      }));
    } else if (fieldId.startsWith('end_pair_')) {
      setTime(prev => ({
        ...prev,
        [secondaryKey]: {
          start: prev[secondaryKey].start,
          end: fieldValue,
        },
      }));
    } else if (
      fieldId.startsWith('monday') ||
      fieldId.startsWith('tuesday') ||
      fieldId.startsWith('wednesday') ||
      fieldId.startsWith('thursday') ||
      fieldId.startsWith('friday') ||
      fieldId.startsWith('saturday')
    ) {
      setPairs(prev => ({
        ...prev,
        [primaryKey]: {
          ...prev[primaryKey],
          [secondaryKey]: fieldValue,
        },
      }));
    }
  };

  const handleLessonFieldChange = event => {
    const fieldId = event.target.id;
    const fieldValue = event.target.value;

    setErrorMessage('');

    switch (fieldId) {
      case 'lesson':
        setCurrentLesson(prev => ({ ...prev, lesson: fieldValue }));
        break;
      case 'teacher':
        setCurrentLesson(prev => ({ ...prev, teacher: fieldValue }));
        break;
      default:
        break;
    }
  };

  const handleSaveTime = () => {
    saveTime(time);
  };

  const handleResetTime = () => {
    setTime(DEFAULT_TIMES);
    getTime();
  };

  const handleSavePairs = () => {
    savePairs(pairs);
  };

  const handleResetPairs = () => {
    setPairs(DEFAULT_PAIRS);
    getPairs();
  };

  const handleClearPairs = () => {
    setPairs(DEFAULT_PAIRS);
  };

  const renderPairsTable = () => {
    return (
      <div>
        <table
          className={styles.subject_schedule_table}
          align="center"
          border="1"
          cellPadding="0"
          cellSpacing="0"
        >
          <tbody>
            <tr>
              <td>#</td>
              <td>Понедельник</td>
              <td>Вторник</td>
              <td>Среда</td>
            </tr>
            <tr>
              <td>1.</td>
              <td>
                <input
                  type="text"
                  value={pairs.monday[1]}
                  onChange={handleInputChange}
                  placeholder="1 пара"
                  id="monday_1"
                />
              </td>
              <td>
                <input
                  type="text"
                  value={pairs.tuesday[1]}
                  onChange={handleInputChange}
                  placeholder="1 пара"
                  id="tuesday_1"
                />
              </td>
              <td>
                <input
                  type="text"
                  value={pairs.wednesday[1]}
                  onChange={handleInputChange}
                  placeholder="1 пара"
                  id="wednesday_1"
                />
              </td>
            </tr>
            <tr>
              <td>2.</td>
              <td>
                <input
                  type="text"
                  value={pairs.monday[2]}
                  onChange={handleInputChange}
                  placeholder="2 пара"
                  id="monday_2"
                />
              </td>
              <td>
                <input
                  type="text"
                  value={pairs.tuesday[2]}
                  onChange={handleInputChange}
                  placeholder="2 пара"
                  id="tuesday_2"
                />
              </td>
              <td>
                <input
                  type="text"
                  value={pairs.wednesday[2]}
                  onChange={handleInputChange}
                  placeholder="2 пара"
                  id="wednesday_2"
                />
              </td>
            </tr>
            <tr>
              <td>3.</td>
              <td>
                <input
                  type="text"
                  value={pairs.monday[3]}
                  onChange={handleInputChange}
                  placeholder="3 пара"
                  id="monday_3"
                />
              </td>
              <td>
                <input
                  type="text"
                  value={pairs.tuesday[3]}
                  onChange={handleInputChange}
                  placeholder="3 пара"
                  id="tuesday_3"
                />
              </td>
              <td>
                <input
                  type="text"
                  value={pairs.wednesday[3]}
                  onChange={handleInputChange}
                  placeholder="3 пара"
                  id="wednesday_3"
                />
              </td>
            </tr>
            <tr>
              <td>4.</td>
              <td>
                <input
                  type="text"
                  value={pairs.monday[4]}
                  onChange={handleInputChange}
                  placeholder="4 пара"
                  id="monday_4"
                />
              </td>
              <td>
                <input
                  type="text"
                  value={pairs.tuesday[4]}
                  onChange={handleInputChange}
                  placeholder="4 пара"
                  id="tuesday_4"
                />
              </td>
              <td>
                <input
                  type="text"
                  value={pairs.wednesday[4]}
                  onChange={handleInputChange}
                  placeholder="4 пара"
                  id="wednesday_4"
                />
              </td>
            </tr>
            <tr>
              <td>5.</td>
              <td>
                <input
                  type="text"
                  value={pairs.monday[5]}
                  onChange={handleInputChange}
                  placeholder="5 пара"
                  id="monday_5"
                />
              </td>
              <td>
                <input
                  type="text"
                  value={pairs.tuesday[5]}
                  onChange={handleInputChange}
                  placeholder="5 пара"
                  id="tuesday_5"
                />
              </td>
              <td>
                <input
                  type="text"
                  value={pairs.wednesday[5]}
                  onChange={handleInputChange}
                  placeholder="5 пара"
                  id="wednesday_5"
                />
              </td>
            </tr>
            <tr>
              <td>6.</td>
              <td>
                <input
                  type="text"
                  value={pairs.monday[6]}
                  onChange={handleInputChange}
                  placeholder="6 пара"
                  id="monday_6"
                />
              </td>
              <td>
                <input
                  type="text"
                  value={pairs.tuesday[6]}
                  onChange={handleInputChange}
                  placeholder="6 пара"
                  id="tuesday_6"
                />
              </td>
              <td>
                <input
                  type="text"
                  value={pairs.wednesday[6]}
                  onChange={handleInputChange}
                  placeholder="6 пара"
                  id="wednesday_6"
                />
              </td>
            </tr>
            <tr>
              <td>#</td>
              <td>Четверг</td>
              <td>Пятница</td>
              <td>Суббота</td>
            </tr>
            <tr>
              <td>1.</td>
              <td>
                <input
                  type="text"
                  value={pairs.thursday[1]}
                  onChange={handleInputChange}
                  placeholder="1 пара"
                  id="thursday_1"
                />
              </td>
              <td>
                <input
                  type="text"
                  value={pairs.friday[1]}
                  onChange={handleInputChange}
                  placeholder="1 пара"
                  id="friday_1"
                />
              </td>
              <td>
                <input
                  type="text"
                  value={pairs.saturday[1]}
                  onChange={handleInputChange}
                  placeholder="1 пара"
                  id="saturday_1"
                />
              </td>
            </tr>
            <tr>
              <td>2.</td>
              <td>
                <input
                  type="text"
                  value={pairs.thursday[2]}
                  onChange={handleInputChange}
                  placeholder="2 пара"
                  id="thursday_2"
                />
              </td>
              <td>
                <input
                  type="text"
                  value={pairs.friday[2]}
                  onChange={handleInputChange}
                  placeholder="2 пара"
                  id="friday_2"
                />
              </td>
              <td>
                <input
                  type="text"
                  value={pairs.saturday[2]}
                  onChange={handleInputChange}
                  placeholder="2 пара"
                  id="saturday_2"
                />
              </td>
            </tr>
            <tr>
              <td>3.</td>
              <td>
                <input
                  type="text"
                  value={pairs.thursday[3]}
                  onChange={handleInputChange}
                  placeholder="3 пара"
                  id="thursday_3"
                />
              </td>
              <td>
                <input
                  type="text"
                  value={pairs.friday[3]}
                  onChange={handleInputChange}
                  placeholder="3 пара"
                  id="friday_3"
                />
              </td>
              <td>
                <input
                  type="text"
                  value={pairs.saturday[3]}
                  onChange={handleInputChange}
                  placeholder="3 пара"
                  id="saturday_3"
                />
              </td>
            </tr>
            <tr>
              <td>4.</td>
              <td>
                <input
                  type="text"
                  value={pairs.thursday[4]}
                  onChange={handleInputChange}
                  placeholder="4 пара"
                  id="thursday_4"
                />
              </td>
              <td>
                <input
                  type="text"
                  value={pairs.friday[4]}
                  onChange={handleInputChange}
                  placeholder="4 пара"
                  id="friday_4"
                />
              </td>
              <td>
                <input
                  type="text"
                  value={pairs.saturday[4]}
                  onChange={handleInputChange}
                  placeholder="4 пара"
                  id="saturday_4"
                />
              </td>
            </tr>
            <tr>
              <td>5.</td>
              <td>
                <input
                  type="text"
                  value={pairs.thursday[5]}
                  onChange={handleInputChange}
                  placeholder="5 пара"
                  id="thursday_5"
                />
              </td>
              <td>
                <input
                  type="text"
                  value={pairs.friday[5]}
                  onChange={handleInputChange}
                  placeholder="5 пара"
                  id="friday_5"
                />
              </td>
              <td>
                <input
                  type="text"
                  value={pairs.saturday[5]}
                  onChange={handleInputChange}
                  placeholder="5 пара"
                  id="saturday_5"
                />
              </td>
            </tr>
            <tr>
              <td>6.</td>
              <td>
                <input
                  type="text"
                  value={pairs.thursday[6]}
                  onChange={handleInputChange}
                  placeholder="6 пара"
                  id="thursday_6"
                />
              </td>
              <td>
                <input
                  type="text"
                  value={pairs.friday[6]}
                  onChange={handleInputChange}
                  placeholder="6 пара"
                  id="friday_6"
                />
              </td>
              <td>
                <input
                  type="text"
                  value={pairs.saturday[6]}
                  onChange={handleInputChange}
                  placeholder="6 пара"
                  id="saturday_6"
                />
              </td>
            </tr>
          </tbody>
        </table>
        <div>
          <button
            id="saveScheduleTimes"
            className="primary"
            onClick={handleSavePairs}
          >
            Сохранить
          </button>
          <button
            id="cancelScheduleTimes"
            className="secondary"
            onClick={handleResetPairs}
          >
            Отмена
          </button>
          <button
            id="clearScheduleTimes"
            className="warning"
            onClick={handleClearPairs}
          >
            Очистить
          </button>
        </div>
      </div>
    );
  };

  const renderPairsTimeTable = () => {
    return (
      <div>
        <table
          className={styles.schedule_times_table}
          align="center"
          border="1"
          cellPadding="0"
          cellSpacing="0"
        >
          <tbody>
            <tr>
              <td>#</td>
              <td>Начало</td>
              <td>Конец</td>
            </tr>
            <tr>
              <td>1.</td>
              <td>
                <input
                  type="text"
                  value={time[1].start}
                  onChange={handleInputChange}
                  placeholder="00:00"
                  id="start_pair_1"
                />
              </td>
              <td>
                <input
                  type="text"
                  value={time[1].end}
                  onChange={handleInputChange}
                  placeholder="00:00"
                  id="end_pair_1"
                />
              </td>
            </tr>
            <tr>
              <td>2.</td>
              <td>
                <input
                  type="text"
                  value={time[2].start}
                  onChange={handleInputChange}
                  placeholder="00:00"
                  id="start_pair_2"
                />
              </td>
              <td>
                <input
                  type="text"
                  value={time[2].end}
                  onChange={handleInputChange}
                  placeholder="00:00"
                  id="end_pair_2"
                />
              </td>
            </tr>
            <tr>
              <td>3.</td>
              <td>
                <input
                  type="text"
                  value={time[3].start}
                  onChange={handleInputChange}
                  placeholder="00:00"
                  id="start_pair_3"
                />
              </td>
              <td>
                <input
                  type="text"
                  value={time[3].end}
                  onChange={handleInputChange}
                  placeholder="00:00"
                  id="end_pair_3"
                />
              </td>
            </tr>
            <tr>
              <td>4.</td>
              <td>
                <input
                  type="text"
                  value={time[4].start}
                  onChange={handleInputChange}
                  placeholder="00:00"
                  id="start_pair_4"
                />
              </td>
              <td>
                <input
                  type="text"
                  value={time[4].end}
                  onChange={handleInputChange}
                  placeholder="00:00"
                  id="end_pair_4"
                />
              </td>
            </tr>
            <tr>
              <td>5.</td>
              <td>
                <input
                  type="text"
                  value={time[5].start}
                  onChange={handleInputChange}
                  placeholder="00:00"
                  id="start_pair_5"
                />
              </td>
              <td>
                <input
                  type="text"
                  value={time[5].end}
                  onChange={handleInputChange}
                  placeholder="00:00"
                  id="end_pair_5"
                />
              </td>
            </tr>
            <tr>
              <td>6.</td>
              <td>
                <input
                  type="text"
                  value={time[6].start}
                  onChange={handleInputChange}
                  placeholder="00:00"
                  id="start_pair_6"
                />
              </td>
              <td>
                <input
                  type="text"
                  value={time[6].end}
                  onChange={handleInputChange}
                  placeholder="00:00"
                  id="end_pair_6"
                />
              </td>
            </tr>
          </tbody>
        </table>
        <div>
          <button
            id="saveScheduleTimes"
            className="primary"
            onClick={handleSaveTime}
          >
            Сохранить
          </button>
          <button
            id="cancelScheduleTimes"
            className="secondary"
            onClick={handleResetTime}
          >
            Отмена
          </button>
        </div>
      </div>
    );
  };

  const renderLessonsList = lessons => {
    return (
      <div className={styles.lessonslist_container}>
        <h3>Предметы</h3>
        <ol>
          {lessons.map(({ id, lesson, teacher }) => {
            return (
              <li key={id}>
                <span
                  onClick={() => {
                    setCurrentLesson({
                      ...DEFAULT_LESSON,
                      id,
                      lesson,
                      teacher,
                    });
                    setIsLessonModalOpen(true);
                  }}
                >
                  {lesson} - {teacher}
                </span>

                <button
                  id={`delete_lesson_${id}`}
                  className="warning"
                  onClick={() => {
                    setIsDeleteModalOpen(true);
                    setCurrentLesson(prev => ({
                      ...prev,
                      id,
                      lesson,
                      teacher,
                    }));
                  }}
                >
                  Удалить
                </button>
              </li>
            );
          })}
        </ol>
        <button onClick={() => setIsLessonModalOpen(true)} className="primary">
          Добавить
        </button>
      </div>
    );
  };

  const renderLessonForm = () => {
    return (
      <form className={styles.lesson_form} autoComplete="off">
        <ul>
          <li>
            <label htmlFor="lesson">Предмет</label>
            <input
              id="lesson"
              type="text"
              maxLength="40"
              autoFocus
              required
              placeholder="Название предмета"
              value={currentLesson.lesson}
              onChange={handleLessonFieldChange}
              className={
                errorMessage.length && !currentLesson.lesson.length
                  ? 'required_field_warning'
                  : ''
              }
            />
          </li>
          <li>
            <label htmlFor="teacher">Преподаватель</label>
            <input
              id="teacher"
              type="text"
              maxLength="60"
              required
              placeholder="ФИО преподавателя"
              value={currentLesson.teacher}
              onChange={handleLessonFieldChange}
              className={
                errorMessage.length && !currentLesson.teacher.length
                  ? 'required_field_warning'
                  : ''
              }
            />
          </li>
          <span className="warning_message">
            {errorMessage.length ? errorMessage : ''}
          </span>
        </ul>
      </form>
    );
  };

  return (
    <PageWrapper>
      <h1>Редактирование расписания занятий</h1>

      <div className={styles.table_container}>
        {renderPairsTable()}
        {renderPairsTimeTable()}
      </div>
      <div className={styles.lessons_container}>
        {renderLessonsList(lessons)}
      </div>
      {isLessonModalOpen ? (
        <ConfirmModal
          open
          title={
            currentLesson.id ? 'Редактирование предмета' : 'Добавление предмета'
          }
          okTitle={currentLesson.id ? 'Сохранить' : 'Добавить'}
          onOk={
            currentLesson.id
              ? () => saveLesson(currentLesson)
              : () => addLesson(currentLesson)
          }
          onCancel={resetLesson}
          onValidate={checkRequirements}
        >
          {renderLessonForm()}
        </ConfirmModal>
      ) : null}
      {isDeleteModalOpen ? (
        <ConfirmModal
          open
          type="danger"
          title="Удаление предмета"
          text="Вы действительно хотите удалить эту запись?"
          accentText={`${currentLesson.lesson} - ${currentLesson.teacher}`}
          okTitle="Удалить"
          onOk={() => deleteLesson(currentLesson.id)}
          onCancel={resetLesson}
        />
      ) : null}
    </PageWrapper>
  );
};

export default ScheduleEdit;

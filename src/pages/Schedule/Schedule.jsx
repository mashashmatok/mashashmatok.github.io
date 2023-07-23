import { useState, useEffect } from 'react';
import { fetchRequest, ENDPOINTS } from 'services/api';
import { DEFAULT_PAIRS, DEFAULT_TIMES } from 'utils/constants';
import PageWrapper from 'components/PageWrapper';
import Tooltip from 'components/Tooltip';
import styles from './Schedule.module.scss';

const Schedule = () => {
  const [time, setTime] = useState(DEFAULT_TIMES);
  const [pairs, setPairs] = useState(DEFAULT_PAIRS);
  const [lessons, setLessons] = useState([]);
  const [tooltipText, setTooltipText] = useState('');

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

  const getLessons = () => {
    fetchRequest({ url: ENDPOINTS.LESSONS }).then(lessons => {
      if (!lessons) return;
      setLessons(lessons);
    });
  };

  useEffect(() => {
    getTime();
    getPairs();
    getLessons();
  }, []);

  const findLessonTeacher = (lessons, findLesson) => {
    const words = findLesson.split('/');
    let filteredLessons = [];

    if (words.length === 1) {
      filteredLessons =
        lessons?.filter(
          ({ lesson }) =>
            lesson.trim().toLowerCase() === words[0].trim().toLowerCase(),
        ) || [];
    } else {
      filteredLessons =
        lessons?.filter(
          ({ lesson }) =>
            lesson.trim().toLowerCase() === words[0].trim().toLowerCase() ||
            lesson.trim().toLowerCase() === words[1].trim().toLowerCase(),
        ) || [];
    }

    let result = '';

    filteredLessons.forEach(({ lesson, teacher }) => {
      result = `${lesson.trim()} - ${teacher.trim()}` + '\r\n' + result;
    });

    return result;
  };

  const handlePairFocus = event => {
    const fieldValue = event.target.value;
    if (!fieldValue.length) return;
    const text = findLessonTeacher(lessons, fieldValue);
    !!text?.length && setTooltipText(text);
  };

  const handlePairFocusLost = () => {
    !!tooltipText.length && setTooltipText('');
  };

  const renderPairsTable = () => {
    return (
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
              <Tooltip text={tooltipText}>
                <input
                  onMouseEnter={handlePairFocus}
                  onMouseLeave={handlePairFocusLost}
                  readOnly
                  type="text"
                  size={pairs.monday[1].length}
                  value={pairs.monday[1]}
                  placeholder="1 пара"
                  id="monday_1"
                />
              </Tooltip>
            </td>
            <td>
              <Tooltip text={tooltipText}>
                <input
                  onMouseEnter={handlePairFocus}
                  onMouseLeave={handlePairFocusLost}
                  readOnly
                  type="text"
                  size={pairs.tuesday[1].length}
                  value={pairs.tuesday[1]}
                  placeholder="1 пара"
                  id="tuesday_1"
                />
              </Tooltip>
            </td>
            <td>
              <Tooltip text={tooltipText}>
                <input
                  onMouseEnter={handlePairFocus}
                  onMouseLeave={handlePairFocusLost}
                  readOnly
                  type="text"
                  size={pairs.wednesday[1].length}
                  value={pairs.wednesday[1]}
                  placeholder="1 пара"
                  id="wednesday_1"
                />
              </Tooltip>
            </td>
          </tr>
          <tr>
            <td>2.</td>
            <td>
              <Tooltip text={tooltipText}>
                <input
                  onMouseEnter={handlePairFocus}
                  onMouseLeave={handlePairFocusLost}
                  readOnly
                  type="text"
                  size={pairs.monday[2].length}
                  value={pairs.monday[2]}
                  placeholder="2 пара"
                  id="monday_2"
                />
              </Tooltip>
            </td>
            <td>
              <Tooltip text={tooltipText}>
                <input
                  onMouseEnter={handlePairFocus}
                  onMouseLeave={handlePairFocusLost}
                  readOnly
                  type="text"
                  size={pairs.tuesday[2].length}
                  value={pairs.tuesday[2]}
                  placeholder="2 пара"
                  id="tuesday_2"
                />
              </Tooltip>
            </td>
            <td>
              <Tooltip text={tooltipText}>
                <input
                  onMouseEnter={handlePairFocus}
                  onMouseLeave={handlePairFocusLost}
                  readOnly
                  type="text"
                  size={pairs.wednesday[2].length}
                  value={pairs.wednesday[2]}
                  placeholder="2 пара"
                  id="wednesday_2"
                />
              </Tooltip>
            </td>
          </tr>
          <tr>
            <td>3.</td>
            <td>
              <Tooltip text={tooltipText}>
                <input
                  onMouseEnter={handlePairFocus}
                  onMouseLeave={handlePairFocusLost}
                  readOnly
                  type="text"
                  size={pairs.monday[3].length}
                  value={pairs.monday[3]}
                  placeholder="3 пара"
                  id="monday_3"
                />
              </Tooltip>
            </td>
            <td>
              <Tooltip text={tooltipText}>
                <input
                  onMouseEnter={handlePairFocus}
                  onMouseLeave={handlePairFocusLost}
                  readOnly
                  type="text"
                  size={pairs.tuesday[3].length}
                  value={pairs.tuesday[3]}
                  placeholder="3 пара"
                  id="tuesday_3"
                />
              </Tooltip>
            </td>
            <td>
              <Tooltip text={tooltipText}>
                <input
                  onMouseEnter={handlePairFocus}
                  onMouseLeave={handlePairFocusLost}
                  readOnly
                  type="text"
                  size={pairs.wednesday[3].length}
                  value={pairs.wednesday[3]}
                  placeholder="3 пара"
                  id="wednesday_3"
                />
              </Tooltip>
            </td>
          </tr>
          <tr>
            <td>4.</td>
            <td>
              <Tooltip text={tooltipText}>
                <input
                  onMouseEnter={handlePairFocus}
                  onMouseLeave={handlePairFocusLost}
                  readOnly
                  type="text"
                  size={pairs.monday[4].length}
                  value={pairs.monday[4]}
                  placeholder="4 пара"
                  id="monday_4"
                />
              </Tooltip>
            </td>
            <td>
              <Tooltip text={tooltipText}>
                <input
                  onMouseEnter={handlePairFocus}
                  onMouseLeave={handlePairFocusLost}
                  readOnly
                  type="text"
                  size={pairs.tuesday[4].length}
                  value={pairs.tuesday[4]}
                  placeholder="4 пара"
                  id="tuesday_4"
                />
              </Tooltip>
            </td>
            <td>
              <Tooltip text={tooltipText}>
                <input
                  onMouseEnter={handlePairFocus}
                  onMouseLeave={handlePairFocusLost}
                  readOnly
                  type="text"
                  size={pairs.wednesday[4].length}
                  value={pairs.wednesday[4]}
                  placeholder="4 пара"
                  id="wednesday_4"
                />
              </Tooltip>
            </td>
          </tr>
          <tr>
            <td>5.</td>
            <td>
              <Tooltip text={tooltipText}>
                <input
                  onMouseEnter={handlePairFocus}
                  onMouseLeave={handlePairFocusLost}
                  readOnly
                  type="text"
                  size={pairs.monday[5].length}
                  value={pairs.monday[5]}
                  placeholder="5 пара"
                  id="monday_5"
                />
              </Tooltip>
            </td>
            <td>
              <Tooltip text={tooltipText}>
                <input
                  onMouseEnter={handlePairFocus}
                  onMouseLeave={handlePairFocusLost}
                  readOnly
                  type="text"
                  size={pairs.tuesday[5].length}
                  value={pairs.tuesday[5]}
                  placeholder="5 пара"
                  id="tuesday_5"
                />
              </Tooltip>
            </td>
            <td>
              <Tooltip text={tooltipText}>
                <input
                  onMouseEnter={handlePairFocus}
                  onMouseLeave={handlePairFocusLost}
                  readOnly
                  type="text"
                  size={pairs.wednesday[5].length}
                  value={pairs.wednesday[5]}
                  placeholder="5 пара"
                  id="wednesday_5"
                />
              </Tooltip>
            </td>
          </tr>
          <tr>
            <td>6.</td>
            <td>
              <Tooltip text={tooltipText}>
                <input
                  onMouseEnter={handlePairFocus}
                  onMouseLeave={handlePairFocusLost}
                  readOnly
                  type="text"
                  size={pairs.monday[6].length}
                  value={pairs.monday[6]}
                  placeholder="6 пара"
                  id="monday_6"
                />
              </Tooltip>
            </td>
            <td>
              <Tooltip text={tooltipText}>
                <input
                  onMouseEnter={handlePairFocus}
                  onMouseLeave={handlePairFocusLost}
                  readOnly
                  type="text"
                  size={pairs.tuesday[6].length}
                  value={pairs.tuesday[6]}
                  placeholder="6 пара"
                  id="tuesday_6"
                />
              </Tooltip>
            </td>
            <td>
              <Tooltip text={tooltipText}>
                <input
                  onMouseEnter={handlePairFocus}
                  onMouseLeave={handlePairFocusLost}
                  readOnly
                  type="text"
                  size={pairs.wednesday[6].length}
                  value={pairs.wednesday[6]}
                  placeholder="6 пара"
                  id="wednesday_6"
                />
              </Tooltip>
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
              <Tooltip text={tooltipText}>
                <input
                  onMouseEnter={handlePairFocus}
                  onMouseLeave={handlePairFocusLost}
                  readOnly
                  type="text"
                  size={pairs.thursday[1].length}
                  value={pairs.thursday[1]}
                  placeholder="1 пара"
                  id="thursday_1"
                />
              </Tooltip>
            </td>
            <td>
              <Tooltip text={tooltipText}>
                <input
                  onMouseEnter={handlePairFocus}
                  onMouseLeave={handlePairFocusLost}
                  readOnly
                  type="text"
                  size={pairs.friday[1].length}
                  value={pairs.friday[1]}
                  placeholder="1 пара"
                  id="friday_1"
                />
              </Tooltip>
            </td>
            <td>
              <Tooltip text={tooltipText}>
                <input
                  onMouseEnter={handlePairFocus}
                  onMouseLeave={handlePairFocusLost}
                  readOnly
                  type="text"
                  size={pairs.saturday[1].length}
                  value={pairs.saturday[1]}
                  placeholder="1 пара"
                  id="saturday_1"
                />
              </Tooltip>
            </td>
          </tr>
          <tr>
            <td>2.</td>
            <td>
              <Tooltip text={tooltipText}>
                <input
                  onMouseEnter={handlePairFocus}
                  onMouseLeave={handlePairFocusLost}
                  readOnly
                  type="text"
                  size={pairs.thursday[2].length}
                  value={pairs.thursday[2]}
                  placeholder="2 пара"
                  id="thursday_2"
                />
              </Tooltip>
            </td>
            <td>
              <Tooltip text={tooltipText}>
                <input
                  onMouseEnter={handlePairFocus}
                  onMouseLeave={handlePairFocusLost}
                  readOnly
                  type="text"
                  size={pairs.friday[2].length}
                  value={pairs.friday[2]}
                  placeholder="2 пара"
                  id="friday_2"
                />
              </Tooltip>
            </td>
            <td>
              <Tooltip text={tooltipText}>
                <input
                  onMouseEnter={handlePairFocus}
                  onMouseLeave={handlePairFocusLost}
                  readOnly
                  type="text"
                  size={pairs.saturday[2].length}
                  value={pairs.saturday[2]}
                  placeholder="2 пара"
                  id="saturday_2"
                />
              </Tooltip>
            </td>
          </tr>
          <tr>
            <td>3.</td>
            <td>
              <Tooltip text={tooltipText}>
                <input
                  onMouseEnter={handlePairFocus}
                  onMouseLeave={handlePairFocusLost}
                  readOnly
                  type="text"
                  size={pairs.thursday[3].length}
                  value={pairs.thursday[3]}
                  placeholder="3 пара"
                  id="thursday_3"
                />
              </Tooltip>
            </td>
            <td>
              <Tooltip text={tooltipText}>
                <input
                  onMouseEnter={handlePairFocus}
                  onMouseLeave={handlePairFocusLost}
                  readOnly
                  type="text"
                  size={pairs.friday[3].length}
                  value={pairs.friday[3]}
                  placeholder="3 пара"
                  id="friday_3"
                />
              </Tooltip>
            </td>
            <td>
              <Tooltip text={tooltipText}>
                <input
                  onMouseEnter={handlePairFocus}
                  onMouseLeave={handlePairFocusLost}
                  readOnly
                  type="text"
                  size={pairs.saturday[3].length}
                  value={pairs.saturday[3]}
                  placeholder="3 пара"
                  id="saturday_3"
                />
              </Tooltip>
            </td>
          </tr>
          <tr>
            <td>4.</td>
            <td>
              <Tooltip text={tooltipText}>
                <input
                  onMouseEnter={handlePairFocus}
                  onMouseLeave={handlePairFocusLost}
                  readOnly
                  type="text"
                  size={pairs.thursday[4].length}
                  value={pairs.thursday[4]}
                  placeholder="4 пара"
                  id="thursday_4"
                />
              </Tooltip>
            </td>
            <td>
              <Tooltip text={tooltipText}>
                <input
                  onMouseEnter={handlePairFocus}
                  onMouseLeave={handlePairFocusLost}
                  readOnly
                  type="text"
                  size={pairs.friday[4].length}
                  value={pairs.friday[4]}
                  placeholder="4 пара"
                  id="friday_4"
                />
              </Tooltip>
            </td>
            <td>
              <Tooltip text={tooltipText}>
                <input
                  onMouseEnter={handlePairFocus}
                  onMouseLeave={handlePairFocusLost}
                  readOnly
                  type="text"
                  size={pairs.saturday[4].length}
                  value={pairs.saturday[4]}
                  placeholder="4 пара"
                  id="saturday_4"
                />
              </Tooltip>
            </td>
          </tr>
          <tr>
            <td>5.</td>
            <td>
              <Tooltip text={tooltipText}>
                <input
                  onMouseEnter={handlePairFocus}
                  onMouseLeave={handlePairFocusLost}
                  readOnly
                  type="text"
                  size={pairs.thursday[5].length}
                  value={pairs.thursday[5]}
                  placeholder="5 пара"
                  id="thursday_5"
                />
              </Tooltip>
            </td>
            <td>
              <Tooltip text={tooltipText}>
                <input
                  onMouseEnter={handlePairFocus}
                  onMouseLeave={handlePairFocusLost}
                  readOnly
                  type="text"
                  size={pairs.friday[5].length}
                  value={pairs.friday[5]}
                  placeholder="5 пара"
                  id="friday_5"
                />
              </Tooltip>
            </td>
            <td>
              <Tooltip text={tooltipText}>
                <input
                  onMouseEnter={handlePairFocus}
                  onMouseLeave={handlePairFocusLost}
                  readOnly
                  type="text"
                  size={pairs.saturday[5].length}
                  value={pairs.saturday[5]}
                  placeholder="5 пара"
                  id="saturday_5"
                />
              </Tooltip>
            </td>
          </tr>
          <tr>
            <td>6.</td>
            <td>
              <Tooltip text={tooltipText}>
                <input
                  onMouseEnter={handlePairFocus}
                  onMouseLeave={handlePairFocusLost}
                  readOnly
                  type="text"
                  size={pairs.thursday[6].length}
                  value={pairs.thursday[6]}
                  placeholder="6 пара"
                  id="thursday_6"
                />
              </Tooltip>
            </td>
            <td>
              <Tooltip text={tooltipText}>
                <input
                  onMouseEnter={handlePairFocus}
                  onMouseLeave={handlePairFocusLost}
                  readOnly
                  type="text"
                  size={pairs.friday[6].length}
                  value={pairs.friday[6]}
                  placeholder="6 пара"
                  id="friday_6"
                />
              </Tooltip>
            </td>
            <td>
              <Tooltip text={tooltipText}>
                <input
                  onMouseEnter={handlePairFocus}
                  onMouseLeave={handlePairFocusLost}
                  readOnly
                  type="text"
                  size={pairs.saturday[6].length}
                  value={pairs.saturday[6]}
                  placeholder="6 пара"
                  id="saturday_6"
                />
              </Tooltip>
            </td>
          </tr>
        </tbody>
      </table>
    );
  };

  const renderPairsTimeTable = () => {
    return (
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
                readOnly
                type="text"
                value={time[1].start}
                placeholder="00:00"
                id="start_pair_1"
              />
            </td>
            <td>
              <input
                readOnly
                type="text"
                value={time[1].end}
                placeholder="00:00"
                id="end_pair_1"
              />
            </td>
          </tr>
          <tr>
            <td>2.</td>
            <td>
              <input
                readOnly
                type="text"
                value={time[2].start}
                placeholder="00:00"
                id="start_pair_2"
              />
            </td>
            <td>
              <input
                readOnly
                type="text"
                value={time[2].end}
                placeholder="00:00"
                id="end_pair_2"
              />
            </td>
          </tr>
          <tr>
            <td>3.</td>
            <td>
              <input
                readOnly
                type="text"
                value={time[3].start}
                placeholder="00:00"
                id="start_pair_3"
              />
            </td>
            <td>
              <input
                readOnly
                type="text"
                value={time[3].end}
                placeholder="00:00"
                id="end_pair_3"
              />
            </td>
          </tr>
          <tr>
            <td>4.</td>
            <td>
              <input
                readOnly
                type="text"
                value={time[4].start}
                placeholder="00:00"
                id="start_pair_4"
              />
            </td>
            <td>
              <input
                readOnly
                type="text"
                value={time[4].end}
                placeholder="00:00"
                id="end_pair_4"
              />
            </td>
          </tr>
          <tr>
            <td>5.</td>
            <td>
              <input
                readOnly
                type="text"
                value={time[5].start}
                placeholder="00:00"
                id="start_pair_5"
              />
            </td>
            <td>
              <input
                readOnly
                type="text"
                value={time[5].end}
                placeholder="00:00"
                id="end_pair_5"
              />
            </td>
          </tr>
          <tr>
            <td>6.</td>
            <td>
              <input
                readOnly
                type="text"
                value={time[6].start}
                placeholder="00:00"
                id="start_pair_6"
              />
            </td>
            <td>
              <input
                readOnly
                type="text"
                value={time[6].end}
                placeholder="00:00"
                id="end_pair_6"
              />
            </td>
          </tr>
        </tbody>
      </table>
    );
  };

  return (
    <PageWrapper>
      <h1>Расписания занятий</h1>

      <div className={styles.table_container}>
        {renderPairsTable()}
        {renderPairsTimeTable()}
      </div>
    </PageWrapper>
  );
};

export default Schedule;

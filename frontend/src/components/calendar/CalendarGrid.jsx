import { FiPlus } from 'react-icons/fi';
import './CalendarGrid.css';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const CalendarGrid = ({
  month, year, events, selectedDate,
  today, onDateClick, onAddEvent
}) => {

  // Build the array of days to display in the grid
  const buildCalendarDays = () => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const days = [];

    // Previous month filler days
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, daysInPrevMonth - i),
        isCurrentMonth: false,
      });
    }

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      days.push({
        date: new Date(year, month, d),
        isCurrentMonth: true,
      });
    }

    // Next month filler days — fill to complete 6 rows (42 cells)
    const remaining = 42 - days.length;
    for (let d = 1; d <= remaining; d++) {
      days.push({
        date: new Date(year, month + 1, d),
        isCurrentMonth: false,
      });
    }

    return days;
  };

  const days = buildCalendarDays();

  // Get events for a specific date
  const getEventsForDate = (date) => {
    return events.filter(e =>
      new Date(e.date).toDateString() === date.toDateString()
    );
  };

  return (
    <div className="calendar-grid">

      {/* Day headers */}
      <div className="calendar-day-headers">
        {DAYS.map(day => (
          <div key={day} className="calendar-day-header">{day}</div>
        ))}
      </div>

      {/* Day cells */}
      <div className="calendar-days">
        {days.map(({ date, isCurrentMonth }, idx) => {
          const dayEvents = getEventsForDate(date);
          const isToday = date.toDateString() === today.toDateString();
          const isSelected = date.toDateString() === selectedDate.toDateString();
          const hasEvents = dayEvents.length > 0;

          return (
            <div
              key={idx}
              className={[
                'calendar-cell',
                !isCurrentMonth ? 'other-month' : '',
                isToday ? 'is-today' : '',
                isSelected ? 'is-selected' : '',
                hasEvents ? 'has-events' : '',
              ].join(' ')}
              onClick={() => onDateClick(date)}
            >
              {/* Date number */}
              <div className="cell-date">
                <span className="cell-date-number">{date.getDate()}</span>
                {isCurrentMonth && (
                  <button
                    className="cell-add-btn"
                    onClick={e => { e.stopPropagation(); onAddEvent(date); }}
                    title="Add event"
                  >
                    <FiPlus size={10} />
                  </button>
                )}
              </div>

              {/* Events dots/labels */}
              <div className="cell-events">
                {dayEvents.slice(0, 2).map(event => (
                  <div
                    key={event._id}
                    className="cell-event-dot"
                    style={{ backgroundColor: event.color || 'var(--accent-primary)' }}
                    title={event.title}
                  >
                    <span className="cell-event-label">{event.title}</span>
                  </div>
                ))}
                {dayEvents.length > 2 && (
                  <span className="cell-event-more">+{dayEvents.length - 2}</span>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};

export default CalendarGrid;

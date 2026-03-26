import { useState, useEffect } from 'react';
import { FiPlus, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Layout from '../components/layout/Layout';
import CalendarGrid from '../components/calendar/CalendarGrid';
import EventModal from '../components/calendar/EventModal';
import EventList from '../components/calendar/EventList';
import { getEvents, createEvent, updateEvent, deleteEvent } from '../services/api';
import './Calendar.css';
import Spinner from '../components/common/Spinner';

const CalendarPage = () => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(today);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  // Fetch events whenever month or year changes
  useEffect(() => {
    fetchEvents();
  }, [currentMonth, currentYear]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await getEvents({
        month: currentMonth + 1,
        year: currentYear,
      });
      setEvents(res.data);
    } catch (err) {
      console.error('Fetch events error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Navigate months
  const goToPrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(y => y - 1);
    } else {
      setCurrentMonth(m => m - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(y => y + 1);
    } else {
      setCurrentMonth(m => m + 1);
    }
  };

  const goToToday = () => {
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
    setSelectedDate(today);
  };

  // Save event (create or update)
  const handleSaveEvent = async (eventData) => {
    if (editingEvent) {
      const res = await updateEvent(editingEvent._id, eventData);
      setEvents(events.map(e =>
        e._id === editingEvent._id ? res.data : e
      ));
    } else {
      const res = await createEvent(eventData);
      setEvents([...events, res.data]);
    }
    setEditingEvent(null);
  };

  // Delete event
  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Delete this event?')) return;
    try {
      await deleteEvent(eventId);
      setEvents(events.filter(e => e._id !== eventId));
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  // Toggle pin
  const handleTogglePin = async (event) => {
    try {
      const res = await updateEvent(event._id, { isPinned: !event.isPinned });
      setEvents(events.map(e =>
        e._id === event._id ? res.data : e
      ));
    } catch (err) {
      console.error('Pin error:', err);
    }
  };

  // Open modal for new event on a specific date
  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  const handleAddEventOnDate = (date) => {
    setSelectedDate(date);
    setEditingEvent(null);
    setModalOpen(true);
  };

  // Events for selected date
  const selectedDateStr = selectedDate.toDateString();
  const selectedDateEvents = events.filter(e =>
    new Date(e.date).toDateString() === selectedDateStr
  );

  // Month name
  const monthName = new Date(currentYear, currentMonth).toLocaleDateString('en-US', {
    month: 'long', year: 'numeric'
  });

  return (
    <Layout>
      <div className="calendar-page">

        {/* Header */}
        <div className="calendar-header">
          <div className="calendar-nav">
            <button className="cal-nav-btn" onClick={goToPrevMonth}>
              <FiChevronLeft />
            </button>
            <h2 className="calendar-month-title">{monthName}</h2>
            <button className="cal-nav-btn" onClick={goToNextMonth}>
              <FiChevronRight />
            </button>
          </div>
          <div className="calendar-header-actions">
            <button className="btn btn-outline" onClick={goToToday}>
              Today
            </button>
            <button
              className="btn btn-primary"
              onClick={() => { setEditingEvent(null); setModalOpen(true); }}
            >
              <FiPlus /> New Event
            </button>
          </div>
        </div>

        {/* Main layout — calendar grid + event panel */}
        <div className="calendar-layout">

          {/* Calendar Grid */}
          <div className="calendar-grid-wrapper">
            <CalendarGrid
              month={currentMonth}
              year={currentYear}
              events={events}
              selectedDate={selectedDate}
              today={today}
              onDateClick={handleDateClick}
              onAddEvent={handleAddEventOnDate}
            />
          </div>

          {/* Side Panel — events for selected date */}
          <div className="calendar-side-panel">
            <div className="side-panel-header">
              <h3 className="side-panel-title">
                {selectedDate.toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                })}
              </h3>
              <button
                className="btn btn-outline side-add-btn"
                onClick={() => handleAddEventOnDate(selectedDate)}
              >
                <FiPlus /> Add
              </button>
            </div>

            {loading ? (
                <Spinner text="Loading calendar..." />
            ) : (
              <EventList
                events={selectedDateEvents}
                onEdit={(event) => { setEditingEvent(event); setModalOpen(true); }}
                onDelete={handleDeleteEvent}
                onTogglePin={handleTogglePin}
              />
            )}
          </div>

        </div>

        {/* Event Modal */}
        <EventModal
          isOpen={modalOpen}
          onClose={() => { setModalOpen(false); setEditingEvent(null); }}
          onSave={handleSaveEvent}
          editingEvent={editingEvent}
          defaultDate={selectedDate}
        />

      </div>
    </Layout>
  );
};

export default CalendarPage;

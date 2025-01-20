import React from "react";

const AddEvent = ({
  selectedGroup,
  setSelectedGroup,
  eventName,
  setEventName,
  eventDateStart,
  setEventDateStart,
  eventTimeStart,
  setEventTimeStart,
  eventDateEnd,
  setEventDateEnd,
  eventTimeEnd,
  setEventTimeEnd,
  repetition,
  setRepetition,
  eventGroups,
  handleAddEvent,
}) => {
  return (
    <div className="card mb-4">
      <div className="card-header">Add Event</div>
      <div className="card-body">
        <div className="mb-3">
          <label htmlFor="groupSelect" className="form-label">
            Select Group
          </label>
          <select
            className="form-select"
            id="groupSelect"
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
          >
            <option value="">-- Select Group --</option>
            {eventGroups.map((group, index) => (
              <option key={index} value={group.group_id}>
                {group.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="eventName" className="form-label">
            Event Name
          </label>
          <input
            type="text"
            className="form-control"
            id="eventName"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="eventDateStart" className="form-label">
            Event Date Start
          </label>
          <input
            type="date"
            className="form-control"
            id="eventDateStart"
            value={eventDateStart}
            onChange={(e) => setEventDateStart(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="eventTimeStart" className="form-label">
            Event Time Start
          </label>
          <input
            type="time"
            className="form-control"
            id="eventTimeStart"
            value={eventTimeStart}
            onChange={(e) => setEventTimeStart(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="eventDateEnd" className="form-label">
            Event Date End
          </label>
          <input
            type="date"
            className="form-control"
            id="eventDateEnd"
            value={eventDateEnd}
            onChange={(e) => setEventDateEnd(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="eventTimeEnd" className="form-label">
            Event Time End
          </label>
          <input
            type="time"
            className="form-control"
            id="eventTimeEnd"
            value={eventTimeEnd}
            onChange={(e) => setEventTimeEnd(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="repetition" className="form-label">
            Repetition
          </label>
          <select
            className="form-select"
            id="repetition"
            value={repetition}
            onChange={(e) => setRepetition(e.target.value)}
          >
            <option value="Once">Once</option>
            <option value="Daily">Daily</option>
            <option value="Weekly">Weekly</option>
          </select>
        </div>
        <button className="btn btn-success" onClick={handleAddEvent}>
          Add Event
        </button>
      </div>
    </div>
  );
};

export default AddEvent;

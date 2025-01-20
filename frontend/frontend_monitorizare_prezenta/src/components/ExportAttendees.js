import React from "react";

const ExportAttendees = ({ handleExportAttendees, events, eventGroups }) => {
  return (
    <div className="card">
      <div className="card-header">Export Attendees</div>
      <div className="card-body">
        <h5>For All Attendees</h5>
        <button
          className="btn btn-secondary me-2"
          onClick={() => handleExportAttendees("csv")}
        >
          Export All as CSV
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => handleExportAttendees("xlsx")}
        >
          Export All as XLSX
        </button>
        <h5 className="mt-3">For Specific Event</h5>
        {events.map((event) => (
          <div key={event.event_id} className="mb-2">
            <strong>{event.name}</strong>
            <button
              className="btn btn-outline-primary ms-2 me-2"
              onClick={() => handleExportAttendees("csv", event.event_id)}
            >
              CSV
            </button>
            <button
              className="btn btn-outline-primary"
              onClick={() => handleExportAttendees("xlsx", event.event_id)}
            >
              XLSX
            </button>
          </div>
        ))}
        <h5 className="mt-3">For Event Groups</h5>
        {eventGroups.map((group) => (
          <div key={group.group_id} className="mb-2">
            <strong>{group.name}</strong>
            <button
              className="btn btn-outline-success ms-2 me-2"
              onClick={() => handleExportAttendees("csv", null, group.group_id)}
            >
              CSV
            </button>
            <button
              className="btn btn-outline-success"
              onClick={() =>
                handleExportAttendees("xlsx", null, group.group_id)
              }
            >
              XLSX
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExportAttendees;

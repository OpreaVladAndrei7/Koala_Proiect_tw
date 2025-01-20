import React from "react";
import formatDateTime from "../utils/formatDateTime";

const AttendeesList = ({ attendees, events, users }) => {
  return (
    <div className="card mb-4">
      <div className="card-header">Attendees</div>
      <div className="card-body">
        <ul className="list-group">
          {attendees.map((attendee, index) => (
            <li key={index} className="list-group-item">
              {users.find((user) => user.user_id === attendee.user_id)?.name} -{" "}
              Confirmed at {formatDateTime(attendee.attendance_time)} for{" "}
              {
                events.find((event) => attendee.event_id === event.event_id)
                  ?.name
              }
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AttendeesList;

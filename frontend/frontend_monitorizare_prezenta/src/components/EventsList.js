import React from "react";
import { QRCodeCanvas } from "qrcode.react";
import formatDateTime from "../utils/formatDateTime";

const EventsList = ({ events, eventGroups, toggleQRCode, showQRCode }) => {
  return (
    <div className="card mb-4">
      <div className="card-header">Events</div>
      <div className="card-body">
        <ul className="list-group">
          {events.map((event) => (
            <li
              key={event.event_id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div style={{ width: "100%" }}>
                <strong>{event.name}</strong> -{" "}
                {formatDateTime(event.start_time)}
                {" - "}
                {formatDateTime(event.end_time)}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    float: "right",
                  }}
                >
                  <strong>
                    STATUS:{" "}
                    {event.status === "CLOSED" ? (
                      <span className="text-danger">{event.status}</span>
                    ) : (
                      <span className="text-success">{event.status}</span>
                    )}
                  </strong>
                  <button
                    className="btn btn-sm btn-primary mt-2"
                    style={{ marginLeft: "0.5rem" }}
                    onClick={() => toggleQRCode(event.event_id)}
                  >
                    {showQRCode[event.event_id]
                      ? "Hide QR Code"
                      : "Show QR Code"}
                  </button>
                  {showQRCode[event.event_id] && (
                    <QRCodeCanvas
                      value={event.access_code}
                      size={128}
                      className="mt-2"
                    />
                  )}
                </div>
                <br />
                <small>
                  Group:{" "}
                  {
                    eventGroups.find(
                      (group) => group.group_id === event.group_id
                    )?.name
                  }
                </small>
                <br />
                <small>
                  Access Code: <strong>{event.access_code}</strong>
                </small>
                <br />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default EventsList;

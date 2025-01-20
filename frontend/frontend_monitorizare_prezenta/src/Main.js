import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import AddEventGroup from "./components/AddEventGroup";
import AddEvent from "./components/AddEvent";
import EventsList from "./components/EventsList";
import AttendeesList from "./components/AttendeesList";
import ExportAttendees from "./components/ExportAttendees";
import * as XLSX from "xlsx";

function Main() {
  const [eventGroups, setEventGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [eventName, setEventName] = useState("");
  const [eventGroupName, setEventGroupName] = useState("");
  const [eventDateStart, setEventDateStart] = useState("");
  const [eventTimeStart, setEventTimeStart] = useState("");
  const [eventDateEnd, setEventDateEnd] = useState("");
  const [eventTimeEnd, setEventTimeEnd] = useState("");
  const [repetition, setRepetition] = useState("Once");
  const [events, setEvents] = useState([]);
  const [attendees, setAttendees] = useState([]);
  const [users, setUsers] = useState([]);
  const [showQRCode, setShowQRCode] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await fetch("/api/users");
        const usersBack = await usersResponse.json();
        setUsers(Array.isArray(usersBack) ? usersBack : [usersBack]);

        const groupResponse = await fetch("/api/event_groups");
        const groups = await groupResponse.json();
        setEventGroups(Array.isArray(groups) ? groups : [groups]);

        const eventsResponse = await fetch("/api/events");
        const eventList = await eventsResponse.json();
        setEvents(Array.isArray(eventList) ? eventList : [eventList]);

        const attendeesResponse = await fetch("/api/attendees");
        const attendeeList = await attendeesResponse.json();
        setAttendees(
          Array.isArray(attendeeList) ? attendeeList : [attendeeList]
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const updateEventStatusOnBackend = async (eventId, status) => {
    try {
      const response = await fetch(`/api/events/${eventId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        console.error(`Failed to update status for event ID ${eventId}`);
      }
    } catch (error) {
      console.error("Error updating event status on backend:", error);
    }
  };

  useEffect(() => {
    const updateEventStatus = () => {
      const now = new Date();

      setEvents((prevEvents) =>
        prevEvents.map((event) => {
          const startTime = new Date(event.start_time);
          const endTime = new Date(event.end_time);
          let newStatus = "CLOSED";

          if (now >= startTime && now <= endTime) {
            newStatus = "OPEN";
          }

          if (event.status !== newStatus) {
            updateEventStatusOnBackend(event.event_id, newStatus);
          }

          return { ...event, status: newStatus };
        })
      );
    };

    const interval = setInterval(updateEventStatus, 60000);
    updateEventStatus();

    return () => clearInterval(interval);
  }, []);

  const handleAddEventGroup = async () => {
    if (eventGroupName) {
      try {
        const response = await fetch("/api/event_groups", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: eventGroupName }),
        });

        if (response.ok) {
          const newGroup = await response.json();
          setEventGroups([...eventGroups, newGroup]);
          setEventGroupName("");
          alert(`Group "${eventGroupName}" added.`);
        } else {
          alert("Failed to add group.");
        }
      } catch (error) {
        console.error("Error adding group:", error);
      }
    }
  };

  const handleAddEvent = async () => {
    if (!selectedGroup) {
      alert("Please select a group before adding an event.");
      return;
    }

    if (
      !eventName ||
      !eventDateStart ||
      !eventDateEnd ||
      !eventTimeStart ||
      !eventTimeEnd
    ) {
      alert("Please fill in all fields to create an event.");
      return;
    }
    const generatedAccessCode = Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase();
    const newEvent = {
      name: eventName,
      dateStart: eventDateStart,
      timeStart: eventTimeStart,
      dateEnd: eventDateEnd,
      timeEnd: eventTimeEnd,
      repetition: repetition,
      groupId: selectedGroup,
      accessCode: generatedAccessCode,
    };

    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEvent),
      });

      if (response.ok) {
        const addedEvent = await response.json();
        setEvents([...events, addedEvent]);
        setEventName("");
        setEventDateStart("");
        setEventTimeStart("");
        setEventDateEnd("");
        setEventTimeEnd("");
        setRepetition("Once");
        alert(`Event "${addedEvent.name}" added to group "${selectedGroup}".`);
      } else {
        alert("Failed to add event.");
      }
    } catch (error) {
      console.error("Error adding event:", error);
    }
  };

  const handleExportAttendees = (type, eventId = null, groupId = null) => {
    let filteredAttendees = attendees;
    if (eventId) {
      filteredAttendees = attendees.filter((a) => a.event_id === eventId);
    } else if (groupId) {
      const groupEvents = events
        .filter((e) => e.group_id === groupId)
        .map((e) => e.event_id);
      filteredAttendees = attendees.filter((a) =>
        groupEvents.includes(a.event_id)
      );
    }

    const exportData = filteredAttendees.map((a) => ({
      Name: users.find((user) => user.user_id === a.user_id)?.name || "Unknown",
      "Event Name":
        events.find((event) => event.event_id === a.event_id)?.name ||
        "Unknown",
      "Attendance Time": new Date(a.attendance_time).toLocaleString("en-GB"),
    }));

    if (type === "csv") {
      const csvContent =
        "data:text/csv;charset=utf-8," +
        ["Name,Event Name,Attendance Time"]
          .concat(
            exportData.map(
              (row) =>
                `${row.Name},${row["Event Name"]},${row["Attendance Time"]}`
            )
          )
          .join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "attendees.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (type === "xlsx") {
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Attendees");
      XLSX.writeFile(workbook, "attendees.xlsx");
    }
  };

  const toggleQRCode = (eventId) => {
    setShowQRCode((prev) => ({
      ...prev,
      [eventId]: !prev[eventId],
    }));
  };
  return (
    <div className="container mt-5 pb-5">
      <h1 className="text-center mb-4">Organizer Dashboard</h1>
      <AddEventGroup
        eventGroupName={eventGroupName}
        setEventGroupName={setEventGroupName}
        handleAddEventGroup={handleAddEventGroup}
      />
      <AddEvent
        selectedGroup={selectedGroup}
        setSelectedGroup={setSelectedGroup}
        eventName={eventName}
        setEventName={setEventName}
        eventDateStart={eventDateStart}
        setEventDateStart={setEventDateStart}
        eventTimeStart={eventTimeStart}
        setEventTimeStart={setEventTimeStart}
        eventDateEnd={eventDateEnd}
        setEventDateEnd={setEventDateEnd}
        eventTimeEnd={eventTimeEnd}
        setEventTimeEnd={setEventTimeEnd}
        repetition={repetition}
        setRepetition={setRepetition}
        eventGroups={eventGroups}
        handleAddEvent={handleAddEvent}
      />
      <EventsList
        events={events}
        eventGroups={eventGroups}
        toggleQRCode={toggleQRCode}
        showQRCode={showQRCode}
      />
      <AttendeesList attendees={attendees} events={events} users={users} />
      <ExportAttendees
        handleExportAttendees={handleExportAttendees}
        events={events}
        eventGroups={eventGroups}
      />
    </div>
  );
}

export default Main;

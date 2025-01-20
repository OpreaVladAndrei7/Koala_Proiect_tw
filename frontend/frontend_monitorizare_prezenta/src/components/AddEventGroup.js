const AddEventGroup = ({
  eventGroupName,
  setEventGroupName,
  handleAddEventGroup,
}) => {
  return (
    <div className="card mb-4">
      <div className="card-header">Add Event Group</div>
      <div className="card-body">
        <div className="mb-3">
          <label htmlFor="eventGroupName" className="form-label">
            Event Group Name
          </label>
          <input
            type="text"
            className="form-control"
            id="eventGroupName"
            value={eventGroupName}
            onChange={(e) => setEventGroupName(e.target.value)}
          />
        </div>
        <button className="btn btn-primary" onClick={handleAddEventGroup}>
          Add Group
        </button>
      </div>
    </div>
  );
};

export default AddEventGroup;

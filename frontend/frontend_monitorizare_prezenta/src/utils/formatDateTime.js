export default function formatDateTime(dateTime) {
  const date = new Date(dateTime);
  const time = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const formattedDate = date.toLocaleDateString("en-GB");
  return `${time} ${formattedDate}`;
}

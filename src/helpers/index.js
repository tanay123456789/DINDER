import format from "date-fns/format";
import isToday from "date-fns/isToday";
import isYesterday from "date-fns/isYesterday";
import isThisWeek from "date-fns/isThisWeek";

export const getFormatedTimestamp = (timestamp) => {
  if (!timestamp) return null;
  let createdAt =
    typeof date === "number" ? new Date(timestamp) : timestamp.toDate();

  if (isToday(createdAt)) return format(createdAt, "KK:mm aaa");
  if (isYesterday(createdAt)) return "Yesterday";
  if (isThisWeek(createdAt)) return format(createdAt, "EEEE");

  return format(createdAt, "yyyy-MM-dd");
};

import {
  addDays,
  isValid,
  formatDistanceToNow,
  differenceInDays,
  fromUnixTime,
  getUnixTime,
} from "date-fns";
import format from "date-fns/format";

export const DateFormat = {
  date: "MM/dd/yyyy",
  dateTime: "MMM dd, yyyy 'at' hh:mm a",
};

export class DateUtility {
  static dateToString(date, formatStr = DateFormat.date) {
    if (!date) return "";
    if (isValid(date)) {
      return format(date, formatStr);
    }
    return "";
  }

  static msToDate(ms) {
    return fromUnixTime(ms);
  }

  static currentTime() {
    return Math.floor(Date.now() / 1000);
  }
  static addDay(date, day) {
    return addDays(date, day);
  }

  static diff(date1, date2) {
    return differenceInDays(date2, date1);
  }

  static getDistanceInWord(date) {
    return formatDistanceToNow(new Date(date));
  }

  static getUnixTimeStamp() {
    return getUnixTime(new Date());
  }

  static convertDateToUnix(date) {
    return getUnixTime(new Date(date));
  }

  static convertStringToDateFormat(date, formatStr = DateFormat.dateTime) {
    let unixDate = getUnixTime(new Date(date));
    unixDate += unixDate * 1000;
    if (!unixDate) return "";
    if (isValid(unixDate)) {
      return format(unixDate, formatStr);
    }
    return "";
  }

  static convertDateFormat(date, formatStr = DateFormat.dateTime) {
    if (!date) return "";
    if (isValid(date)) {
      return format(date, formatStr);
    }
    return "";
  }

  static unixTimestampToString(timestamp) {
    return new Date(timestamp * 1000).toLocaleString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    });
  }

  static dateFormated(dates) {
    const date = new Date(dates * 1000); // convert seconds to milliseconds
    const options = {
      timeZone: "UTC",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    const formattedDate = date.toLocaleDateString("en-US", options); // format date string
    return formattedDate;
  }

  static dateFormattedPlusDays(dateInSeconds, daysToAdd) {
    const date = new Date(dateInSeconds * 1000); // convert seconds to milliseconds
    const futureDate = new Date(date); // create a copy of the date

    futureDate.setDate(date.getDate() + daysToAdd); // add 'daysToAdd' to the date

    const options = {
      timeZone: "UTC",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };

    const formattedDate = futureDate.toLocaleDateString("en-US", options); // format the future date string

    return formattedDate;
  }

  static createdFormated(dates) {
    const date = new Date(dates); // convert seconds to milliseconds
    const options = {
      timeZone: "UTC",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    const formattedDate = date.toLocaleDateString("en-US", options); // format date string
    return formattedDate;
  }

  static timeInSecondToUtcTime(seconds) {
    const date = new Date(Number(seconds) * 1000); // create a Date object from the number of seconds
    const utcSeconds = date.getTime() / 1000 - date.getTimezoneOffset() * 60;

    return Number(seconds) * 1000;
  }

  static unixtimeStampToDateTime(unixTimestamp) {
    const dateObject = new Date(unixTimestamp * 1000);
    const year = dateObject.getFullYear();
    const month = String(dateObject.getMonth() + 1).padStart(2, "0");
    const date = String(dateObject.getDate()).padStart(2, "0");
    const hours = String(dateObject.getHours()).padStart(2, "0");
    const minutes = String(dateObject.getMinutes()).padStart(2, "0");

    return `${date}/${month}/${year} ${hours}:${minutes}`;
  }
  static getTimeFromDateObj(dateObj) {
    const date = new Date(dateObj);
    const timeString = format(date, "h:mm a");
    return timeString;
  }

  static convertUnixTimestamp(timestamp) {
    const date = new Date(timestamp * 1000);
    const formattedDate = `${date.getDate()}/${
      date.getMonth() + 1
    }/${date.getFullYear()}, ${this.formatTime(date)}`;
    return formattedDate;
  }

  static formatTime(date) {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? "0" + minutes : minutes;

    const formattedTime = `${hours}:${minutes} ${ampm}`;
    return formattedTime;
  }

  static monthYear(createdAt) {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    // Make sure createdAt is a date object
    const date = new Date(createdAt);
    const monthName = monthNames[date.getMonth()];
    const year = date.getFullYear();

    // Create formatted date string
    const formattedDate = `${monthName} ${year}`;
    return formattedDate;
  }
}

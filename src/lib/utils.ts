import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function toTitleCase(str: string) {
  return str.charAt(0).toUpperCase() + str.substring(1).toLowerCase()
}

export function shortenString(str: string, maxLength: number) {
  if (str.length <= maxLength) {
    return str;
  }
  return str.substring(0, maxLength) + "...";
}

export function toAmPm(time: string) {
  const [hours, minutes] = time.split(":");
  const hoursInt = parseInt(hours);
  const amPm = hoursInt >= 12 ? "PM" : "AM";
  const formattedHours = (hoursInt % 12) || 12;
  return `${formattedHours}:${minutes} ${amPm}`;
}

export function isTime1GreaterOrEqualToTime2(timeString1: string, timeString2: string): boolean {
  // receives two time strings in the format "HH:MM" at 24h
  // returns true if timeString1 is greater than timeString2 or equal to it
  const [hours1, minutes1] = timeString1.split(":").map(Number);
  const [hours2, minutes2] = timeString2.split(":").map(Number);
  if (hours1 > hours2) {
    return true;
  }
  if (hours1 === hours2 && minutes1 >= minutes2) {
    return true;
  }

  return false;

}


// Extend the Date interface
declare global {
  interface Date {
    updateTime(time: string): Date;
  }
}

// Implement the updateTime method
Date.prototype.updateTime = function (time: string): Date {
  const [hours, minutes, seconds] = time.split(':').map(Number);

  // Create a new Date object to avoid mutating the original date
  const updatedDate = new Date(this);

  // Set the hours, minutes, and seconds
  updatedDate.setHours(hours, minutes, seconds);

  return updatedDate;
};

export function getMonthName({
  month,
}: {
  month: number;
}) {
  const months = [
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
  return months[month];
}
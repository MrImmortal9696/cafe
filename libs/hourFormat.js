export function convertTo12HourFormat(timeStr) {
    const [hour, minute] = timeStr.split(":");
    let hour12 = (hour % 12) || 12;  // Convert 0 to 12
    let period = hour >= 12 ? "PM" : "AM";
    return `${hour12}:${minute} ${period}`;
}

export function convertTo24Hour(timeStr) {
    if (!timeStr) return null;

    const [time, modifier] = timeStr.split(" ");
    let [hours, minutes] = time.split(":");

    if (modifier === "PM" && hours !== "12") {
        hours = String(parseInt(hours, 10) + 12);
    }
    if (modifier === "AM" && hours === "12") {
        hours = "00";
    }

    return `${hours.padStart(2, "0")}:${minutes}`;
}

export function getLocalDate() {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
    
    return `${day}-${month}-${year}`;
}

export function getLocalDate_YMD() {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
    
    return `${year}-${month}-${day}`;
}

export function getLocalTime(){
    const time = new Date().toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      })
    return time
}
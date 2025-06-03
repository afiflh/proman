class DateFormatter {
  static formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  static formatDateNoTime(date) {

    if (!(date instanceof Date)) {
      throw new Error('Invalid date object');
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  static dateNow() {
    const now = new Date();
    return DateFormatter.formatDate(now);
  }

  static formatDuration(duration) {
    const days = duration?.days ?? 0;
    const hours = duration?.hours ?? 0;
    const minutes = duration?.minutes ?? 0;
    const seconds = duration?.seconds ?? 0;

    let result = '';
    if (days > 0) result += `${days}d `;
    if (hours > 0) result += `${hours}h `;
    if (minutes > 0) result += `${minutes}m `;
    result += `${seconds}s`;
    return result.trim();

    // let result = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    // return result;
  }

  static getCurrentYearMonth() {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');

    return `${year}${month}`
  }

  static generateDateRange(start_date, end_date) {
    const start = new Date(start_date);
    const end = new Date(end_date);
    const dateArray = [];

    while (start >= end) {
      dateArray.push(start.toISOString().split('T')[0]);
      start.setDate(start.getDate() - 1);
    }

    return dateArray;
  }


  static generateDateLast7Days() {
    const dates = [];
    const today = new Date();
    today.setHours(today.getHours() + 7);
    
    console.log('tanggal awal: ', today);

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      dates.push(date.toISOString().split('T')[0]);
    }

    return dates;
  }

}

module.exports = DateFormatter;

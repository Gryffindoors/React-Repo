// -------- TEXT HELPERS --------

// Capitalize each word in a string
export function capitalizeWords(str = '') {
  return str.replace(/\b\w/g, char => char.toUpperCase());
}

// Remove extra spaces from a string
export function normalizeText(text = '') {
  return text.replace(/\s+/g, ' ').trim();
}

// -------- NUMBER HELPERS --------

// Normalize Arabic or Persian digits to Latin digits
export function normalizeToLatinNumbers(input = '') {
  const map = {
    '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4',
    '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9',
    '۰': '0', '۱': '1', '۲': '2', '۳': '3', '۴': '4',
    '۵': '5', '۶': '6', '۷': '7', '۸': '8', '۹': '9'
  };
  return input.toString().replace(/[٠-٩۰-۹]/g, d => map[d] || d);
}

// -------- DATE HELPERS --------

// Parse 'YYYY-MM-DD' or 'YYYY-MM-DD HH:mm' or ISO string as Cairo time
export function parseCairoDateTime(dateStr) {
  if (!dateStr) return null;

  if (dateStr.includes('T')) {
    try {
      const utcDate = new Date(dateStr);
      const cairoOffset = 2 * 60; // UTC+2 for Cairo (non-DST)
      return new Date(utcDate.getTime() + cairoOffset * 60 * 1000);
    } catch {
      return null;
    }
  }

  const parts = dateStr.trim().split(' ');
  const [y, m, d] = parts[0].split('-').map(Number);
  if (!y || !m || !d) return null;

  if (parts[1]) {
    const [h, min] = parts[1].split(':').map(Number);
    return new Date(y, m - 1, d, h, min);
  }

  return new Date(y, m - 1, d);
}

// Check if date is valid
export function isValidDate(d) {
  return d instanceof Date && !isNaN(d);
}

// Format: 'Friday, June 14th'
export function formatDateISO(date) {
  if (!isValidDate(date)) return '';

  const weekday = date.toLocaleDateString('en-US', {
    weekday: 'long',
    timeZone: 'Africa/Cairo',
  });

  const month = date.toLocaleDateString('en-US', {
    month: 'long',
    timeZone: 'Africa/Cairo',
  });

  const day = new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    timeZone: 'Africa/Cairo',
  }).format(date);

  return `${weekday}, ${month} ${getOrdinal(Number(day))}`;
}

// Format time like '2:30 PM'
export function formatTime(date) {
  if (!isValidDate(date)) return '';
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Africa/Cairo',
  });
}

// Private helper: ordinal suffix
function getOrdinal(n) {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

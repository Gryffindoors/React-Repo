// src/utils/safeJson.js
export function safeParseJson(value, fallback = null) {
  if (value == null) return fallback;          // null or undefined
  if (value === 'undefined' || value === 'null') return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

export function safeStringifyJson(value) {
  try {
    return JSON.stringify(value);
  } catch {
    return '';
  }
}

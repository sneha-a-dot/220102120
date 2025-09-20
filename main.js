// log.js
/**
 * Sends a structured log entry to the Test Server
 * @param {string} stack - e.g., "backend", "frontend"
 * @param {string} level - log severity, e.g., "info", "warn", "error", "fatal"
 * @param {string} pkg - which part/package of the app, e.g., "auth", "db"
 * @param {string} message - specific, descriptive log message
 */
async function Log(stack, level, pkg, message) {
  const logBody = {
    timestamp: new Date().toISOString(),
    stack: stack,
    level: level,
    package: pkg,
    message: message,
  };
  try {
    await fetch("https://www.affordmed.com/api/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(logBody),
    });
  } catch (err) {
    console.error("Log API call failed", logBody, err);
  }
}

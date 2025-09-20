// src/utils/log.js
export async function Log(stack, level, pkg, message) {
  const logBody = {
    timestamp: new Date().toISOString(),
    stack,
    level,
    package: pkg,
    message,
  };
  try {
    // Same logging API endpoint
    await fetch("https://www.affordmed.com/api/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(logBody),
    });
  } catch (err) {
    console.error("Log API call failed", logBody, err);
  }
}

import moment from "moment";

// add global util function

/**
 * Get the base64 string from a data URL.
 *
 * @param {string} dataURL - the data URL
 * @return {string} the base64 string
 */
function getBase64StringFromDataURL(dataURL) {
  return dataURL.replace("data:", "").replace(/^.+,/, "");
}

/**
 * Captures a video frame and returns the data as a base64 string.
 *
 * @param {HTMLVideoElement} video - The video element to capture the frame from.
 * @param {number} [quality=0.92] - The quality of the captured frame.
 * @return {string} The base64 string representation of the captured frame.
 */
function captureVideoFrame(video, quality) {
  quality = quality || 0.92;

  //canvas width and height
  const canvasWidth = 640,
    canvasHeight = 640;

  if (!video) {
    return false;
  }

  const canvas = document.createElement("canvas");
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  canvas
    .getContext("2d", { willReadFrequently: true })
    .drawImage(video, 0, 0, canvasWidth, canvasHeight);

  let data = getBase64StringFromDataURL(canvas.toDataURL("image/jpeg", quality));
  return data;
}

// add all exports

export { getBase64StringFromDataURL, captureVideoFrame };

/**
 * Generate a human-readable string representing the time left from the current moment to a specified future date.
 *
 * @param {Date} futureDate - The future date to calculate the time left from.
 * @return {string} A string representing the time left in hours, minutes, or seconds.
 */
export function timeLeftFrom(futureDate) {
  const now = moment();
  const duration = moment.duration(moment(futureDate).diff(now));

  const hour = duration.hours();
  const minute = duration.minutes();
  const second = duration.seconds();

  let timeLeft;

  if (hour >= 1) {
    timeLeft = `${hour} hrs`;
  } else if (minute >= 1) {
    timeLeft = `${minute} mins`;
  } else {
    timeLeft = `${second} ${second > 1 ? "secs" : "sec"}`;
  }

  return timeLeft;
}

/**
 * Shuffles an array in-place using the Fisher-Yates algorithm.
 * @param {Array} array - The array to shuffle.
 * @returns {Array} - The shuffled array.
 */
export function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/**
 * Takes the OCEAN scores object from Data Science API and returns an array of objects with scores and labels.
 * @param {Object} object - The OCEAN scores object from Data Science API.
 * @returns {Array} - The OCEAN scores array.
 */
export function extractOCEANScores(report) {
  const scoresArray = [];
  for (const [key, value] of Object.entries(report.OCEAN_scores)) {
    scoresArray.push({ score: value.score, label: key.toLowerCase() });
  }
  return scoresArray;
}

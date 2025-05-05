// code changes for security

import DOMPurify from "dompurify";

export const validateAndSanitizeURL = async (url) => {
    // Define a regular expression or a set of rules to validate the URL.
    const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/;
  
    // Check if the URL matches the expected pattern.
    if (urlPattern.test(url)) {
      // If the URL is valid, you can further sanitize it to ensure it's safe.
      const sanitizedURL = sanitizeURL(url);
      return sanitizedURL;
    } else {
      // If the URL is not valid, you can handle it as needed. For example, you might return a default URL or show an error message.
      // TODO
      
    }
  }
  
  function sanitizeURL(url) {
    return DOMPurify.sanitize(url);
  }
import Cookies from "js-cookie";

/**
 * Get cookie name for user's saved properties
 * @param {string} userId - User ID
 * @returns {string} Cookie name
 */
const getCookieName = (userId) => `saved_properties_${userId}`;

/**
 * Get saved property IDs from cookies for a specific user
 * @param {string} userId - User ID
 * @returns {Array<string>} Array of property IDs
 */
export const getSavedPropertiesFromCookies = (userId) => {
  if (!userId) return [];

  try {
    const cookieName = getCookieName(userId);
    const cookieValue = Cookies.get(cookieName);

    if (!cookieValue) return [];

    return JSON.parse(cookieValue);
  } catch (error) {
    console.error("Error reading saved properties from cookies:", error);
    return [];
  }
};

/**
 * Save property IDs to cookies for a specific user
 * @param {string} userId - User ID
 * @param {Array<string>} propertyIds - Array of property IDs
 */
export const saveSavedPropertiesToCookies = (userId, propertyIds) => {
  if (!userId) return;

  try {
    const cookieName = getCookieName(userId);
    Cookies.set(cookieName, JSON.stringify(propertyIds), {
      expires: 365, // 1 year
      sameSite: 'lax',
    });
  } catch (error) {
    console.error("Error saving properties to cookies:", error);
  }
};

/**
 * Check if a property is saved (from cookies)
 * @param {string} userId - User ID
 * @param {string} propertyId - Property ID to check
 * @returns {boolean}
 */
export const isPropertySaved = (userId, propertyId) => {
  const savedIds = getSavedPropertiesFromCookies(userId);
  return savedIds.includes(propertyId);
};

/**
 * Clear saved properties cookies for a user (e.g., on logout)
 * @param {string} userId - User ID
 */
export const clearSavedPropertiesCookies = (userId) => {
  if (!userId) return;

  const cookieName = getCookieName(userId);
  Cookies.remove(cookieName);
};

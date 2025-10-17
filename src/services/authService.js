/**
 * Enhanced Authentication Service
 * Supports: Email/Password, Google OAuth, Phone OTP, Anonymous (Guest), Account Linking
 */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signInWithPhoneNumber,
  signInAnonymously,
  linkWithCredential,
  linkWithPopup,
  unlink,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  updateEmail,
  updatePassword,
  EmailAuthProvider,
  GoogleAuthProvider,
  PhoneAuthProvider,
  RecaptchaVerifier,
  reauthenticateWithCredential,
  fetchSignInMethodsForEmail,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";

// ============================================
// PROVIDERS CONFIGURATION
// ============================================

/**
 * Get configured Google OAuth provider
 */
export const getGoogleProvider = () => {
  const provider = new GoogleAuthProvider();
  provider.addScope('profile');
  provider.addScope('email');
  provider.setCustomParameters({
    prompt: 'select_account' // Always show account selection
  });
  return provider;
};

/**
 * Get configured Phone Auth provider
 */
export const getPhoneProvider = () => {
  return new PhoneAuthProvider(auth);
};

// ============================================
// USER PROFILE MANAGEMENT
// ============================================

/**
 * Create or update user profile in Firestore
 * @param {Object} user - Firebase user object
 * @param {Object} additionalData - Additional profile data
 */
export const createOrUpdateUserProfile = async (user, additionalData = {}) => {
  if (!user) return null;

  const userDocRef = doc(db, "users", user.uid);
  const userDoc = await getDoc(userDocRef);

  // Extract data from provider
  const providerData = user.providerData[0] || {};

  // Parse name from Google OAuth or displayName
  let firstName = null;
  let lastName = null;

  if (providerData.providerId === 'google.com') {
    // Google provides displayName as "FirstName LastName"
    const nameParts = (providerData.displayName || user.displayName || '').split(' ');
    firstName = nameParts[0] || null;
    lastName = nameParts.slice(1).join(' ') || null;
  }

  // Build linked providers array
  const linkedProviders = user.providerData.map(provider => ({
    providerId: provider.providerId,
    email: provider.email || null,
    phone: provider.phoneNumber || null,
    displayName: provider.displayName || null,
    photoURL: provider.photoURL || null,
    uid: provider.uid,
  }));

  const profileData = {
    uid: user.uid,
    email: user.email || additionalData.email || null,
    phone: user.phoneNumber || additionalData.phone || null,
    fullName: additionalData.fullName || user.displayName || `${firstName} ${lastName}`.trim() || '',
    firstName: additionalData.firstName || firstName,
    lastName: additionalData.lastName || lastName,
    photoURL: user.photoURL || additionalData.photoURL || null,
    isAnonymous: user.isAnonymous,
    linkedProviders,
    contactType: getContactType(user),
    updatedAt: serverTimestamp(),
    lastLoginAt: serverTimestamp(),
    ...additionalData,
  };

  if (!userDoc.exists()) {
    // New user - add createdAt
    profileData.createdAt = serverTimestamp();
  }

  await setDoc(userDocRef, profileData, { merge: true });

  return profileData;
};

/**
 * Determine primary contact type from user
 */
const getContactType = (user) => {
  if (!user.providerData.length) return user.isAnonymous ? 'anonymous' : 'email';

  const providers = user.providerData.map(p => p.providerId);

  if (providers.includes('google.com')) return 'google';
  if (providers.includes('phone')) return 'phone';
  if (providers.includes('password')) return 'email';

  return 'email';
};

// ============================================
// EMAIL/PASSWORD AUTHENTICATION
// ============================================

/**
 * Sign up with email and password
 * @param {string} email
 * @param {string} password
 * @param {string} fullName
 * @returns {Promise<Object>} User credential
 */
export const signUpWithEmail = async ({ email, password, fullName }) => {
  try {
    // Create user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update display name
    if (fullName) {
      await updateProfile(user, { displayName: fullName });
    }

    // Create user profile
    await createOrUpdateUserProfile(user, { fullName });

    // Send verification email (optional)
    // await sendEmailVerification(user);

    return userCredential;
  } catch (error) {
    console.error('Email signup error:', error);
    throw handleAuthError(error);
  }
};

/**
 * Sign in with email and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<Object>} User credential
 */
export const signInWithEmail = async ({ email, password }) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);

    // Update last login
    await createOrUpdateUserProfile(userCredential.user);

    return userCredential;
  } catch (error) {
    console.error('Email signin error:', error);
    throw handleAuthError(error);
  }
};

/**
 * Send password reset email
 * @param {string} email
 */
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error('Password reset error:', error);
    throw handleAuthError(error);
  }
};

/**
 * Change user password
 * @param {Object} user - Current user
 * @param {string} currentPassword
 * @param {string} newPassword
 */
export const changePassword = async (user, currentPassword, newPassword) => {
  try {
    // Reauthenticate
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);

    // Update password
    await updatePassword(user, newPassword);
  } catch (error) {
    console.error('Change password error:', error);
    throw handleAuthError(error);
  }
};

// ============================================
// GOOGLE OAUTH AUTHENTICATION
// ============================================

/**
 * Sign in with Google (popup method)
 * @returns {Promise<Object>} User credential
 */
export const signInWithGoogle = async () => {
  try {
    const provider = getGoogleProvider();
    const result = await signInWithPopup(auth, provider);

    // Extract profile data from Google
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const user = result.user;

    // Google ID token (if needed for additional API calls)
    // const idToken = credential.idToken;

    // Create/update user profile with Google data
    await createOrUpdateUserProfile(user);

    return result;
  } catch (error) {
    console.error('Google signin error:', error);
    throw handleAuthError(error);
  }
};

/**
 * Sign in with Google (redirect method - better for mobile)
 * Call this to initiate, then call handleGoogleRedirectResult on page load
 */
export const signInWithGoogleRedirect = async () => {
  try {
    const provider = getGoogleProvider();
    await signInWithRedirect(auth, provider);
  } catch (error) {
    console.error('Google redirect error:', error);
    throw handleAuthError(error);
  }
};

/**
 * Handle Google OAuth redirect result
 * Call this on app initialization to check for redirect result
 */
export const handleGoogleRedirectResult = async () => {
  try {
    const result = await getRedirectResult(auth);

    if (result) {
      // User successfully signed in via redirect
      await createOrUpdateUserProfile(result.user);
      return result;
    }

    return null;
  } catch (error) {
    console.error('Google redirect result error:', error);
    throw handleAuthError(error);
  }
};

// ============================================
// PHONE AUTHENTICATION (SMS OTP)
// ============================================

// Global recaptcha verifier instance
let recaptchaVerifierInstance = null;

/**
 * Initialize reCAPTCHA verifier
 * @param {string} containerId - DOM element ID for reCAPTCHA
 * @param {Object} options - reCAPTCHA options
 */
export const initRecaptchaVerifier = (containerId = 'recaptcha-container', options = {}) => {
  if (recaptchaVerifierInstance) {
    recaptchaVerifierInstance.clear();
  }

  const defaultOptions = {
    size: 'invisible',
    callback: (response) => {
      console.log('reCAPTCHA solved:', response);
    },
    'expired-callback': () => {
      console.warn('reCAPTCHA expired');
    },
    ...options
  };

  recaptchaVerifierInstance = new RecaptchaVerifier(containerId, defaultOptions, auth);

  return recaptchaVerifierInstance;
};

/**
 * Get existing reCAPTCHA verifier or create new one
 */
export const getRecaptchaVerifier = (containerId = 'recaptcha-container') => {
  if (!recaptchaVerifierInstance) {
    return initRecaptchaVerifier(containerId);
  }
  return recaptchaVerifierInstance;
};

/**
 * Send OTP to phone number
 * @param {string} phoneNumber - Phone number with country code (e.g., +1234567890)
 * @param {RecaptchaVerifier} recaptchaVerifier - reCAPTCHA verifier instance
 * @returns {Promise<Object>} Confirmation result
 */
export const sendPhoneOTP = async (phoneNumber, recaptchaVerifier) => {
  try {
    // Format phone number (ensure it has + prefix)
    const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;

    // Send OTP
    const confirmationResult = await signInWithPhoneNumber(
      auth,
      formattedPhone,
      recaptchaVerifier
    );

    return confirmationResult;
  } catch (error) {
    console.error('Send OTP error:', error);
    throw handleAuthError(error);
  }
};

/**
 * Verify phone OTP and sign in
 * @param {Object} confirmationResult - Result from sendPhoneOTP
 * @param {string} code - 6-digit verification code
 * @returns {Promise<Object>} User credential
 */
export const verifyPhoneOTP = async (confirmationResult, code) => {
  try {
    const result = await confirmationResult.confirm(code);

    // Create/update user profile
    await createOrUpdateUserProfile(result.user);

    return result;
  } catch (error) {
    console.error('Verify OTP error:', error);
    throw handleAuthError(error);
  }
};

// ============================================
// ANONYMOUS (GUEST) AUTHENTICATION
// ============================================

/**
 * Sign in as guest (anonymous)
 * @returns {Promise<Object>} User credential
 */
export const signInAsGuest = async () => {
  try {
    const userCredential = await signInAnonymously(auth);

    // Create guest profile
    await createOrUpdateUserProfile(userCredential.user, {
      fullName: 'Guest User',
    });

    return userCredential;
  } catch (error) {
    console.error('Guest signin error:', error);
    throw handleAuthError(error);
  }
};

/**
 * Check if current user is guest
 */
export const isGuestUser = (user) => {
  return user && user.isAnonymous;
};

// ============================================
// ACCOUNT LINKING
// ============================================

/**
 * Link email/password to current account
 * @param {Object} user - Current user
 * @param {string} email
 * @param {string} password
 */
export const linkEmailPassword = async (user, email, password) => {
  try {
    const credential = EmailAuthProvider.credential(email, password);
    const result = await linkWithCredential(user, credential);

    // Update profile
    await createOrUpdateUserProfile(result.user);

    return result;
  } catch (error) {
    console.error('Link email error:', error);
    throw handleAuthError(error);
  }
};

/**
 * Link Google account to current account
 * @param {Object} user - Current user
 */
export const linkGoogleAccount = async (user) => {
  try {
    const provider = getGoogleProvider();
    const result = await linkWithPopup(user, provider);

    // Update profile with Google data
    await createOrUpdateUserProfile(result.user);

    return result;
  } catch (error) {
    console.error('Link Google error:', error);
    throw handleAuthError(error);
  }
};

/**
 * Link phone number to current account
 * @param {Object} user - Current user
 * @param {string} verificationId - Verification ID from sendPhoneOTP
 * @param {string} code - 6-digit verification code
 */
export const linkPhoneNumber = async (user, verificationId, code) => {
  try {
    const credential = PhoneAuthProvider.credential(verificationId, code);
    const result = await linkWithCredential(user, credential);

    // Update profile
    await createOrUpdateUserProfile(result.user);

    return result;
  } catch (error) {
    console.error('Link phone error:', error);
    throw handleAuthError(error);
  }
};

/**
 * Unlink authentication provider
 * @param {Object} user - Current user
 * @param {string} providerId - Provider ID to unlink ('google.com', 'phone', 'password')
 */
export const unlinkProvider = async (user, providerId) => {
  try {
    // Check if user has other providers
    if (user.providerData.length <= 1) {
      throw new Error('Cannot unlink the only sign-in method. Please add another method first.');
    }

    await unlink(user, providerId);

    // Update profile
    await createOrUpdateUserProfile(user);

    return true;
  } catch (error) {
    console.error('Unlink provider error:', error);
    throw handleAuthError(error);
  }
};

/**
 * Get list of sign-in methods for an email
 * @param {string} email
 * @returns {Promise<Array>} Array of provider IDs
 */
export const getSignInMethodsForEmail = async (email) => {
  try {
    return await fetchSignInMethodsForEmail(auth, email);
  } catch (error) {
    console.error('Fetch sign-in methods error:', error);
    return [];
  }
};

// ============================================
// GUEST ACCOUNT UPGRADE
// ============================================

/**
 * Upgrade guest account to permanent with email/password
 * @param {Object} guestUser - Current anonymous user
 * @param {string} email
 * @param {string} password
 * @param {string} fullName
 */
export const upgradeGuestToEmail = async (guestUser, email, password, fullName) => {
  try {
    if (!guestUser.isAnonymous) {
      throw new Error('User is not a guest account');
    }

    // Link email/password credential
    const credential = EmailAuthProvider.credential(email, password);
    const result = await linkWithCredential(guestUser, credential);

    // Update profile
    await updateProfile(result.user, { displayName: fullName });
    await createOrUpdateUserProfile(result.user, { fullName });

    return result;
  } catch (error) {
    console.error('Upgrade guest to email error:', error);
    throw handleAuthError(error);
  }
};

/**
 * Upgrade guest account to permanent with Google
 * @param {Object} guestUser - Current anonymous user
 */
export const upgradeGuestToGoogle = async (guestUser) => {
  try {
    if (!guestUser.isAnonymous) {
      throw new Error('User is not a guest account');
    }

    return await linkGoogleAccount(guestUser);
  } catch (error) {
    console.error('Upgrade guest to Google error:', error);
    throw handleAuthError(error);
  }
};

/**
 * Upgrade guest account to permanent with phone
 * @param {Object} guestUser - Current anonymous user
 * @param {string} verificationId
 * @param {string} code
 */
export const upgradeGuestToPhone = async (guestUser, verificationId, code) => {
  try {
    if (!guestUser.isAnonymous) {
      throw new Error('User is not a guest account');
    }

    return await linkPhoneNumber(guestUser, verificationId, code);
  } catch (error) {
    console.error('Upgrade guest to phone error:', error);
    throw handleAuthError(error);
  }
};

// ============================================
// SESSION MANAGEMENT
// ============================================

/**
 * Sign out current user
 */
export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Sign out error:', error);
    throw handleAuthError(error);
  }
};

/**
 * Get current user's ID token (for API requests)
 * @param {boolean} forceRefresh - Force token refresh
 * @returns {Promise<string>} ID token
 */
export const getUserIdToken = async (forceRefresh = false) => {
  try {
    const user = auth.currentUser;
    if (!user) return null;

    return await user.getIdToken(forceRefresh);
  } catch (error) {
    console.error('Get ID token error:', error);
    return null;
  }
};

/**
 * Refresh user's ID token
 */
export const refreshUserToken = async () => {
  return await getUserIdToken(true);
};

// ============================================
// ERROR HANDLING
// ============================================

/**
 * Convert Firebase auth errors to user-friendly messages
 */
export const handleAuthError = (error) => {
  const errorMessages = {
    // Email/Password errors
    'auth/email-already-in-use': 'This email is already registered. Please sign in instead.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/weak-password': 'Password must be at least 6 characters long.',
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/too-many-requests': 'Too many failed attempts. Please try again later.',

    // Google OAuth errors
    'auth/popup-closed-by-user': 'Sign-in popup was closed. Please try again.',
    'auth/cancelled-popup-request': 'Sign-in cancelled. Please try again.',
    'auth/popup-blocked': 'Popup blocked by browser. Please allow popups and try again.',
    'auth/account-exists-with-different-credential': 'An account with this email already exists with a different sign-in method.',

    // Phone auth errors
    'auth/invalid-phone-number': 'Please enter a valid phone number with country code.',
    'auth/missing-phone-number': 'Please enter your phone number.',
    'auth/quota-exceeded': 'SMS quota exceeded. Please try again later.',
    'auth/invalid-verification-code': 'Invalid verification code. Please try again.',
    'auth/invalid-verification-id': 'Verification session expired. Please request a new code.',
    'auth/captcha-check-failed': 'reCAPTCHA verification failed. Please try again.',

    // Account linking errors
    'auth/credential-already-in-use': 'This account is already linked to another user.',
    'auth/provider-already-linked': 'This sign-in method is already linked to your account.',
    'auth/email-already-in-use': 'This email is already linked to another account.',

    // Session errors
    'auth/requires-recent-login': 'Please sign in again to continue.',
    'auth/user-disabled': 'This account has been disabled.',
    'auth/user-token-expired': 'Your session has expired. Please sign in again.',

    // Network errors
    'auth/network-request-failed': 'Network error. Please check your internet connection.',
    'auth/timeout': 'Request timed out. Please try again.',
  };

  const friendlyMessage = errorMessages[error.code] || error.message || 'An error occurred. Please try again.';

  return new Error(friendlyMessage);
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Format phone number for display
 * @param {string} phoneNumber - Phone number with country code
 * @returns {string} Formatted phone number
 */
export const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return '';

  // Remove + and format as needed
  const cleaned = phoneNumber.replace(/\D/g, '');

  // US/Canada format
  if (cleaned.length === 11 && cleaned[0] === '1') {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }

  // International format
  return `+${cleaned}`;
};

/**
 * Get provider display name
 */
export const getProviderDisplayName = (providerId) => {
  const names = {
    'password': 'Email/Password',
    'google.com': 'Google',
    'phone': 'Phone',
    'anonymous': 'Guest',
  };
  return names[providerId] || providerId;
};

/**
 * Check if email is valid format
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Check if phone is valid format
 */
export const isValidPhone = (phone) => {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

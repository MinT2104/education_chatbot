/**
 * Cookie utility functions
 */

interface CookieOptions {
  expires?: Date | number; // Date object or days from now
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: "strict" | "lax" | "none";
}

/**
 * Set a cookie
 */
export const setCookie = (
  name: string,
  value: string,
  options: CookieOptions = {}
): void => {
  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

  if (options.expires) {
    let expiresDate: Date;
    if (typeof options.expires === "number") {
      expiresDate = new Date();
      expiresDate.setTime(
        expiresDate.getTime() + options.expires * 24 * 60 * 60 * 1000
      );
    } else {
      expiresDate = options.expires;
    }
    cookieString += `; expires=${expiresDate.toUTCString()}`;
  }

  if (options.path) {
    cookieString += `; path=${options.path}`;
  }

  if (options.domain) {
    cookieString += `; domain=${options.domain}`;
  }

  if (options.secure) {
    cookieString += `; secure`;
  }

  if (options.sameSite) {
    cookieString += `; sameSite=${options.sameSite}`;
  }

  document.cookie = cookieString;
};

/**
 * Get a cookie value
 */
export const getCookie = (name: string): string | null => {
  const nameEQ = encodeURIComponent(name) + "=";
  const cookies = document.cookie.split(";");

  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i];
    while (cookie.charAt(0) === " ") {
      cookie = cookie.substring(1, cookie.length);
    }
    if (cookie.indexOf(nameEQ) === 0) {
      return decodeURIComponent(cookie.substring(nameEQ.length, cookie.length));
    }
  }

  return null;
};

/**
 * Remove a cookie
 */
export const removeCookie = (
  name: string,
  options: Pick<CookieOptions, "path" | "domain"> = {}
): void => {
  setCookie(name, "", {
    ...options,
    expires: new Date(0), // Set to past date to delete
  });
};

/**
 * Check if cookies are enabled
 */
export const areCookiesEnabled = (): boolean => {
  try {
    setCookie("__test_cookie__", "test");
    const enabled = getCookie("__test_cookie__") === "test";
    removeCookie("__test_cookie__");
    return enabled;
  } catch {
    return false;
  }
};


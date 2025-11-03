export const getCookieValue = (cookieString: string, cookieName: string): string | undefined => {
  if (!cookieString) return undefined

  const cookies = cookieString.split(';').map((cookie) => cookie.trim())
  const targetCookie = cookies.find((cookie) => cookie.startsWith(`${cookieName}=`))

  if (!targetCookie) return undefined

  return targetCookie.split('=')[1]
}

export const setCookieOptions = (maxAge: number = 7 * 24 * 60 * 60 * 1000) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge,
  path: '/',
})



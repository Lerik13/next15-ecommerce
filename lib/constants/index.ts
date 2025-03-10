export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'e-Store project'
export const APP_DESCRIPTION =
  process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
  'A modern e-commerce store built with Next.js 15'
export const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
export const LATEST_PRODUCTS_LIMIT = Number(
  process.env.LATEST_PRODUCTS_LIMIT || 4
)

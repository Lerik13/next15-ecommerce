import { generateAccessToken } from '../lib/paypal'

// Test to generate access token from Paypal
test('generates token from Paypal', async () => {
  const tokenResponse = await generateAccessToken()
  console.log(tokenResponse)
  expect(typeof tokenResponse).toBe('string')
  expect(tokenResponse.length).toBeGreaterThan(0)
})

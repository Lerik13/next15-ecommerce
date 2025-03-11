'use server'

import { isRedirectError } from 'next/dist/client/components/redirect'
import { signIn, signOut } from '@/auth'
import { signInFormSchema } from '../validators'

// Sign in User with credentials
export async function signInWithCredentials(
  prevState: unknown,
  formData: FormData
) {
  try {
    const user = signInFormSchema.parse({
      email: formData.get('email'),
      password: formData.get('password'),
    })

    await signIn('credentials', user)

    return { success: true, message: 'Signed in successfully' }
  } catch (error) {
    if (isRedirectError(error)) {
      throw error
    }

    return { success: false, message: 'Invalid email or password' }
  }
}

//Sign User out
export async function signOutUser() {
  await signOut()
}

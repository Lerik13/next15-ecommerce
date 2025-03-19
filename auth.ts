import { compareSync } from 'bcrypt-ts-edge'
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { authConfig } from './auth.config'
import { prisma } from '@/db/prisma'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { cookies } from 'next/headers'

export const config = {
  pages: {
    signIn: '/sign-in',
    error: '/sign-in',
  },

  session: {
    strategy: 'jwt' as const,
    maxAge: 30 * 24 * 60 * 60,
  },

  adapter: PrismaAdapter(prisma),

  providers: [
    CredentialsProvider({
      credentials: {
        email: {
          type: 'email',
        },
        password: { type: 'password' },
      },
      async authorize(credentials) {
        if (credentials == null) return null

        // Find user in database
        const user = await prisma.user.findFirst({
          where: {
            email: credentials.email as string,
          },
        })
        // Check if user exists and password is correct
        if (user && user.password) {
          const isMatch = compareSync(
            credentials.password as string,
            user.password
          )
          // If password is correct, return user object
          if (isMatch) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            }
          }
        }
        // If user doesn't exist or password is incorrect, return null
        return null
      },
    }),
  ],

  callbacks: {
    async session({ session, user, trigger, token }: any) {
      // Set the user id on the session
      session.user.id = token.sub
      session.user.name = token.name
      session.user.role = token.role

      // If there is an update, set the name on the session
      if (trigger === 'update') {
        session.user.name = user.name
      }
      return session
    },
    async jwt({ token, user, trigger, session }: any) {
      // Assign user fields to token
      if (user) {
        token.id = user.id
        token.role = user.role

        // If user has no name, then use the email (first part)
        if (user.name === 'NO_NAME') {
          token.name = user.email!.split('@')[0]
          // Update database to reflect to token name
          await prisma.user.update({
            where: { id: user.id },
            data: { name: token.name },
          })
        }

        if (trigger === 'signIn' || trigger === 'signUp') {
          const cookiesObject = await cookies()
          const sessionCartId = cookiesObject.get('sessionCartId')?.value

          if (sessionCartId) {
            const sessionCart = await prisma.cart.findFirst({
              where: { sessionCartId },
            })

            if (sessionCart) {
              // Delete current user cart
              await prisma.cart.deleteMany({
                where: { userId: user.id },
              })

              // Assign new cart
              await prisma.cart.update({
                where: { id: sessionCart.id },
                data: { userId: user.id },
              })
            }
          }
        }
      }

      // Handle session updates (e.g., name change)
      if (session?.user.name && trigger === 'update') {
        token.name = session.user.name
      }

      return token
    },
    ...authConfig.callbacks,
  },
}

export const { handlers, auth, signIn, signOut } = NextAuth(config)

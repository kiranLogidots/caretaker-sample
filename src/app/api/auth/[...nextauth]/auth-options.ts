import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { env } from '@/env.mjs';
import isEqual from 'lodash/isEqual';
import { pagesOptions } from './pages-options';
import axios from 'axios';

const apiBaseUrl = 'https://api.nexsysi.alpha2.logidots.com/api';

export const authOptions: NextAuthOptions = {
  // debug: true,
  pages: {
    ...pagesOptions,
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.idToken as string,
        },
      };
    },
    async jwt({ token, user }) {
      if (user) {
        // return user as JWT
        token.user = user;
      }
      return token;
    },
    async redirect({ url, baseUrl }) {
      // const parsedUrl = new URL(url, baseUrl);
      // if (parsedUrl.searchParams.has('callbackUrl')) {
      //   alert(parsedUrl.searchParams.get('callbackUrl'))
      //   return `${baseUrl}${parsedUrl.searchParams.get('callbackUrl')}`;
      // }
      // if (parsedUrl.origin === baseUrl) {
      //   return url;
      // }

      // In our case, the redirect url will always be the base url
      return baseUrl;
    },
  },
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials: any) {
        try {
          const response = await axios.post(`${apiBaseUrl}/auth/login`, {
            email: credentials?.email,
            password: credentials?.password,
          });
          const user = response.data;

          // Return user object to set the JWT token
          if (user) {
            return {
              id: user.id,
              email: user.email,
              roles: user.roles,
            };
          } else {
            return null;
          }
        } catch (error) {
          console.error('Login failed', error);
          return null;
        }
        // You need to provide your own logic here that takes the credentials
        // submitted and returns either a object representing a user or value
        // that is false/null if the credentials are invalid
        // const user = {
        //   email: 'admin@caretaker.com',
        //   password: 'password',
        // };

        // if (
        //   isEqual(user, {
        //     email: credentials?.email,
        //     password: credentials?.password,
        //   })
        // ) {
        //   return user as any;
        // }
        // return null;
      },
    }),
    // GoogleProvider({
    //   clientId: env.GOOGLE_CLIENT_ID || '',
    //   clientSecret: env.GOOGLE_CLIENT_SECRET || '',
    //   allowDangerousEmailAccountLinking: true,
    // }),
  ],
};

import moment from 'moment/moment';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { signOut } from 'next-auth/react';
import {httpRequest} from '../../../helpers/utils';

async function refreshAccessToken(token) {
  try {
    if(token) {
    httpRequest.defaults.headers[
      'Authorization'
    ] = `Bearer ${token?.accessToken}`;
    const response = await  httpRequest.get('/auth/refresh')
    const refreshedTokens = response?.data?.data;
    

    return {
      ...token,
      accessToken: refreshedTokens.accessToken,
    }
  }
  } catch (error) {
    return token
    // signOut({
    //   callbackUrl: '/',
    // });



  }
}

export const authOptions = {
  session: {
    strategy: 'jwt',
    maxAge: 31536000, 
  },
  strategy: 'jwt',
  secret: process.env.nextAuthSecret,
  providers: [
    CredentialsProvider({
      type: 'credentials',

      async authorize(credentials) {
        try {
          const {email, phone, password} = credentials;
          let loginData = null;
          if (phone !== 'undefined' && phone) {
            loginData = {
              phone: phone,
              password: password,
            };
          } else {
            loginData = {
              email: email,
              password: password,
            };
          }
          const response = await httpRequest.post('/auth/login', {
            ...loginData,
          });
          const user = response.data.data;
          if (user) {
            return user;
          } else {
            return null;
          }
        } catch (error) {
          
        }
      },
    }),
  ],
  callbacks: {
    
    async jwt({token, user, account}) {
      if (account && user) {
        return {
          ...token,
          accessToken: user.accessToken,
        };
      }
      // const newToken = await refreshAccessToken(token)
      return token;

    },

    async session(props) {
      
      const {session, token}  = props
      delete session.user?.image;
      session.user.accessToken = token?.accessToken;
      return session;
    },
  },
};

export default NextAuth(authOptions);

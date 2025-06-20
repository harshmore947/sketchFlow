import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import {PrismaAdapter} from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";


const handler = NextAuth({
  adapter:PrismaAdapter(prisma),
  providers:[
    GoogleProvider({
      clientId:process.env.GOOGLE_CLIENT_ID!,
      clientSecret:process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  session:{
    strategy:"jwt"
  },
  callbacks:{
    async session({session,token})  {
      if(session.user){
        session.user.id = token.sub!;
      }
      return session;
    },
    async jwt({token,user}){
      if(user){
        token.id = user.id;
      }
      return token;
    }
  },
  pages:{
    signIn:"/"
  }
});

export {handler as GET, handler as POST}
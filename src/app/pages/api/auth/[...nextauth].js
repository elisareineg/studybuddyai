import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import dynamo from '../../../../utils/dynamo';
import bcrypt from 'bcryptjs';

async function getUserByEmailAndPassword(email, password) {
  // Fetch user from DynamoDB
  const result = await dynamo.get({
    TableName: 'Users',
    Key: { email }
  }).promise();
  const user = result.Item;
  if (user && await bcrypt.compare(password, user.password)) {
    return { id: user.email, email: user.email };
  }
  return null;
}

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        return await getUserByEmailAndPassword(credentials.email, credentials.password);
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
  }
}); 
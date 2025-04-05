import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connect_mysql } from "@/libs/mysql";
// import bcrypt from "bcryptjs";  // Uncomment and use for hashed passwords

const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},
      async authorize(credentials) {
        const { email, password } = credentials;

        try {
          // Check in 'Users' table
          const [userRows] = await connect_mysql.query(
            "SELECT Email, PasswordHash, FullName FROM Users WHERE Email = ?",
            [email]
          );

          console.log("User Rows from Users table:", userRows);

          if (userRows.length > 0) {
            const user = {
              email: userRows[0].Email,
              name: userRows[0].FullName,
              password: userRows[0].PasswordHash,
              role: "User", // Explicitly set role as "User"
            };

            // Verify password (Use bcrypt.compareSync(password, user.password) if passwords are hashed)
            if (user.password !== password) {
              console.log("Invalid password");
              return null;
            }

            return { email: user.email, name: user.name, role: user.role };
          }

          // If not found in 'Users', check in 'Customers' table
          const [customerRows] = await connect_mysql.query(
            "SELECT CustomerEmail, CustomerName, Customer_Password, Phone FROM Customers WHERE CustomerEmail = ?",
            [email]
          );

          console.log("Customer Rows from Customers table:", customerRows);

          if (customerRows.length > 0) {
            const customer = {
              email: customerRows[0].CustomerEmail,
              name: customerRows[0].CustomerName,
              password: customerRows[0].Customer_Password,
              phone:customerRows[0].Phone,
              role: "customer", // Explicitly set role as "Customer"
            };

            // Verify password (Use bcrypt.compareSync(password, customer.password) if hashed)
            if (customer.password !== password) {
              console.log("Invalid password");
              return null;
            }

            return { email: customer.email, name: customer.name, role: customer.role,phone:customer.phone };
          }

          // No matching user found in either table
          return null;
        } catch (error) {
          console.error("Error during authorization:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;  
        token.name = user.name;
        token.phone = user.phone;  // ✅ Store phone in JWT token
      }
      return token;
    },
    async session({ session, token }) {
      session.user.role = token.role;  
      session.user.name = token.name;
      session.user.phone = token.phone;  // ✅ Include phone in session
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

const config = {
    adapter: PrismaAdapter(prisma),
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                const inputEmail = credentials.email as string;
                const inputPassword = credentials.password as string;

                // Check Environment Variables
                const envEmail = process.env.ADMIN_EMAIL;
                const envPassword = process.env.ADMIN_PASSWORD;

                let user: any = await (prisma as any).user.findUnique({
                    where: { email: inputEmail }
                });

                // If user doesn't exist, but matches ENV, create them
                if (!user && envEmail && envPassword && inputEmail === envEmail && inputPassword === envPassword) {
                    const hashedPassword = await bcrypt.hash(inputPassword, 10);
                    user = await (prisma as any).user.create({
                        data: {
                            email: inputEmail,
                            name: "Administrator",
                            passwordHash: hashedPassword,
                            role: "ADMIN"
                        }
                    });
                }

                if (!user || !user.passwordHash) return null;

                // Compare with hashed password in DB
                const isValid = await bcrypt.compare(inputPassword, user.passwordHash);

                if (!isValid) return null;

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role || "ADMIN",
                };
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }: any) {
            if (user) {
                token.role = (user as any).role;
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }: any) {
            if (session.user) {
                (session.user as any).role = token.role;
                (session.user as any).id = token.id;
            }
            return session;
        }
    },
    // Required when the app runs behind a reverse proxy (Nginx Proxy Manager,
    // Caddy, Traefik, ...). Without it every /api/auth/* request fails with
    // UntrustedHost once the site is served on a real domain.
    trustHost: true,
    pages: {
        signIn: "/admin/login",
    },
    session: {
        strategy: "jwt" as const,
    }
}

const result = NextAuth(config);
export const handlers = result.handlers;
export const auth = result.auth;
export const signIn = result.signIn;
export const signOut = result.signOut;

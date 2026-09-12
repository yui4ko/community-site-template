import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { NextAuthProvider } from "@/providers/NextAuthProvider";
import { auth } from "@/auth";
import { getTheme } from "@/actions/theme";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
    title: `${siteConfig.siteName} - ${siteConfig.siteTagline}`,
    description: siteConfig.siteDescription,
    keywords: siteConfig.seo.keywords,
    authors: [{ name: siteConfig.siteName }],
    openGraph: {
        title: `${siteConfig.siteName} - ${siteConfig.siteTagline}`,
        description: siteConfig.siteDescription,
        url: siteConfig.siteUrl,
        siteName: siteConfig.siteName,
        locale: "en_US",
        type: "website",
    },
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await auth();
    const theme = await getTheme();

    return (
        <html lang="en">
            <body>
                <NextAuthProvider>
                    <div className="flex flex-col min-h-screen">
                        <Header session={session} themeConfig={theme} />
                        <main className="flex-grow">
                            {children}
                        </main>
                        <Footer />
                    </div>
                </NextAuthProvider>
            </body>
        </html>
    );
}

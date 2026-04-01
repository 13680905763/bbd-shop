import "@/styles/globals.css";
import { NextIntlClientProvider } from "next-intl";
import { Metadata, Viewport } from "next";
import clsx from "clsx";
import Script from "next/script";
import { getLocale, getMessages } from "next-intl/server";

import { Providers } from "./providers";

import ChatBox from "@/components/common/chatbox";
import ZoomGuard from "@/components/common/zoom-guard";
import { siteConfig } from "@/config/site";
import { getUserCurrency } from "@/i18n/service";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialLocale = await getLocale();
  const initialCurrency = await getUserCurrency();
  const messages = await getMessages();

  return (
    <html suppressHydrationWarning lang={initialLocale}>
      <head>
        <Script
          src="https://accounts.google.com/gsi/client"
          strategy="beforeInteractive"
        />
      </head>
      <body
        className={clsx(
          "min-h-screen bg-background font-sans antialiased",
          // fontSans.variable,
        )}
      >
        <ZoomGuard>
          <NextIntlClientProvider messages={messages}>
            <Providers
              initialCurrency={initialCurrency}
              initialLocale={initialLocale}
              themeProps={{ attribute: "class", defaultTheme: "light" }}
            >
              {children}
              <ChatBox />
            </Providers>
          </NextIntlClientProvider>
        </ZoomGuard>
      </body>
    </html>
  );
}

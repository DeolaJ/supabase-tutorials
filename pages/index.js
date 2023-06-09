import Head from "next/head";

import ContactForm from "../src/components/ContactForm";

export default function Home() {
    return (
        <>
            <Head>
                <title>Supabase tutorials</title>
                <meta name="description" content="Website for the supabase tutorial series" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
                <ContactForm />
            </main>
        </>
    );
}

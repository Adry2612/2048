import Head from "next/head";
import { Inter } from "next/font/google";
import Board from "@/components/Board";
import styles from "@/styles/Index.module.css";
import Score from "@/components/Score";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <div className={styles.twenty48}>
      <Head>
        <title> 2048 </title>
        <meta name="description" content="2048 con Next js" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header>
        <h1> 2048 </h1>
        <Score />
      </header>
      <main>
        <Board />
      </main>
    </div>
  );
}

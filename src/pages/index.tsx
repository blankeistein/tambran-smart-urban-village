import { Container } from "@mui/material";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Index() {
  const router = useRouter();
  useEffect(() => {
    if(router) {
      router.replace("/maps");
    }
  }, [router])

  return (
    <>
      <Head>
        <title>Tambran Smart Urban Village</title>
      </Head>
      <Container>
      </Container>
    </>
  )
}
import AdminLayout from "@/components/Layout/AdminLayout";
import { generatePlace } from "@/libs/firebase/database/places";
import { addSubArea } from "@/libs/firebase/database/sub-area";
import { Button, Container, Typography } from "@mui/material";
import Head from "next/head";
import { ReactElement } from "react";

const paths = [
  { lat: -7.65439236694784, lng: 111.33249913753195 },
{ lat: -7.654335213295248, lng: 111.33251254857616 },
{ lat: -7.654041469981998, lng: 111.3323569804483 },
{ lat: -7.6540574198502975, lng: 111.33256216942453 },
{ lat: -7.653936466667469, lng: 111.33241062462508 }
]

export default function Index() {

  return (
    <>
      <Head>
        <title>Tambran Smart Urban Village</title>
      </Head>
      <Container sx={{ pt: 5 }}>
        <Typography>Dashboard Menu</Typography>
        <Button>Add Area</Button>
        <Button>Add Sub Area</Button>
        <Button>Generate Place & Family</Button>
      </Container>
    </>
  )
}

Index.getLayout = function getLayout(page: ReactElement) {
  return (
    <AdminLayout>
      {page}
    </AdminLayout>
  )
}
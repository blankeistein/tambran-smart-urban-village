import { styled, Toolbar, Stack, Typography, IconButton, Icon, Container, Avatar } from "@mui/material";
import MuiAppBar from "@mui/material/AppBar";
import { grey } from "@mui/material/colors";
import Image from "next/image";
import React, { ReactElement } from "react";

const AppBar = styled(MuiAppBar)(({ theme }) => ({
  backgroundColor: grey[50] + "E8",
  color: theme.palette.text.primary,
  backdropFilter: "blur(2px)"
}))

type Props = {
  children: ReactElement
}

export default function AdminLayout({ children }: Props) {

  return (
    <>
      <AppBar position="sticky">
        <Toolbar>
          <Stack direction="row" spacing={2} sx={{ alignItems: "center", width: "100%" }}>
            <IconButton
              size="large"
              color="inherit"
              aria-label="menu">
              <Icon className="material-symbols-rounded">menu</Icon>
            </IconButton>
            <Image src="/images/logo.png" width={36} height={40} alt="Logo Magetan" /> 
            <Stack spacing={0.2} sx={{ ml: 8 }}>
              <Typography variant="h1" sx={{ fontSize: 20, fontWeight: 700 }}>
                Tambran
              </Typography>
              <Typography variant="h5" sx={{ fontSize: 12 }}>
                Smart Urban Village
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} sx={{ flexGrow: 1, alignItems: "center", justifyContent: "end" }}>
              <IconButton color="primary">
                <Icon className="material-symbols-rounded">
                  notifications
                </Icon>
              </IconButton>
              <IconButton>
                <Avatar sx={{ width: 32, height: 32 }}/>
              </IconButton>
            </Stack>
          </Stack>
        </Toolbar>
      </AppBar>
      <main>
        { children }
      </main>
    </>
  )
}
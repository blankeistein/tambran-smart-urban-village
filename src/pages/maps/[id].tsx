import { useRouter } from "next/router";
import Maps from ".";
import React, { useEffect } from "react";
import { Avatar, Box, Divider, Icon, IconButton, List, ListItem, ListItemAvatar, ListItemButton, ListItemIcon, ListItemText, Paper, Stack, Tab, Tabs, Typography } from "@mui/material";
import { blue } from "@mui/material/colors";
import { listenByPlace } from "@/libs/firebase/database/peoples";
import { DataSnapshot } from "firebase/database";

type People = {
  name: string,
  birthDate: number,
  job: string,
  gender: string,
  familyId: string,
  place: string,
}
export default function Page() {
  const router = useRouter();

  const [tab, setTab] = React.useState("overview")
  const [peoples, setPeoples] = React.useState<People[] | null>()
  console.log(peoples)

  const handleClose = () => {
    router.replace("/maps")
  }

  function handleSuccess(snap: DataSnapshot) {
    if(snap.exists()) {
      const data = Object.values(snap.val());
      // @ts-ignore 
      setPeoples(data);
    } else {
      setPeoples(null);
    }
  }

  function handleFailure(err: Error) {
    console.error(err);
  }

  useEffect(() => {
    const id = router.query.id as string;
    if(id) {
      const unsubsribe = listenByPlace(id, handleSuccess, handleFailure)

      return () => unsubsribe()
    }
  }, [router])

  return (
    <Box component={Paper} p={1} sx={{
      display: "flex",
      flexDirection: "column",
      position: "absolute",
      zIndex: 999,
      left: 10,
      top: "50%",
      transform: "translateY(-50%)",
      height: "calc(100% - 120px)",
      width: "calc(100% - 20px)",
      maxWidth: 480
    }}>
      <Stack spacing={1} direction="row" sx={{ justifyContent: "space-between", mb: 1 }}>
        <Box display="flex" alignItems="center" gap={1}>
          <IconButton>
            <Icon className="material-symbols-rounded">home</Icon>
          </IconButton>
          <Typography variant="h5" sx={{ fontSize: 18 }}>Detail Lokasi</Typography>
        </Box>
        <IconButton sx={{ marginLeft: "auto" }} onClick={handleClose}>
          <Icon className="material-symbols-rounded">
            close
          </Icon>
        </IconButton>
      </Stack>
      <Tabs value={tab} onChange={(_, value) => setTab(value)}>
        <Tab label="Ringkasan" value="overview" />
        <Tab label="Anggota" value="members" />
      </Tabs>
      <Divider />
      {
        tab === "overview" && 
        <Box overflow="auto">
          {
            Array.isArray(peoples) &&
            <List>
              <ListItemButton>
                <ListItemIcon>
                  <Avatar>
                    <Icon color="inherit" className="material-symbols-rounded">
                      description
                    </Icon>
                  </Avatar>
                </ListItemIcon>
                <ListItemText primary="Jumlah Kartu Keluarga" />
                <Typography variant="body1">
                  1
                </Typography>
              </ListItemButton>
              <Divider component="li" />
              <ListItemButton>
                <ListItemIcon>
                  <Avatar>
                    <Icon color="inherit" className="material-symbols-rounded">
                      wc
                    </Icon>
                  </Avatar>
                </ListItemIcon>
                <ListItemText primary="Jenis Kelamin" />
              </ListItemButton>
              <List dense component="div" disablePadding>
                <ListItemButton sx={{ pl: 5 }}>
                  <ListItemIcon>
                    <Icon color="inherit" className="material-symbols-rounded">
                      man
                    </Icon>
                  </ListItemIcon>
                  <ListItemText primary="Laki Laki" />
                  <Typography variant="body1">
                    { peoples.filter((item) => item.gender === "Laki Laki").length}
                  </Typography>
                </ListItemButton>
                <ListItemButton sx={{ pl: 5 }}>
                  <ListItemIcon>
                    <Icon color="inherit" className="material-symbols-rounded">
                      woman
                    </Icon>
                  </ListItemIcon>
                  <ListItemText primary="Perempuan" />
                  <Typography variant="body1">
                    { peoples.filter((item) => item.gender === "Perempuan").length}
                  </Typography>
                </ListItemButton>
              </List>
              <Divider component="li" />
              <ListItemButton>
                <ListItemIcon>
                  <Avatar>
                    <Icon color="inherit" className="material-symbols-rounded">
                      work
                    </Icon>
                  </Avatar>
                </ListItemIcon>
                <ListItemText primary="Pekerjaan" />
              </ListItemButton>
              <List dense component="div" disablePadding>
                {
                  peoples.filter((item, pos) => peoples.indexOf(item) === pos)
                          .map((item) => (
                            <ListItemButton key={item.name} sx={{ pl: 8 }}>
                              <ListItemText primary={item.job} />
                            </ListItemButton>
                          ))
                }
              </List>
            </List>
          }
        </Box>
      }
      {
        tab === "members" &&
        <>
          {
            peoples === null &&
            <Typography variant="body1" align="center">
              Data tidak ditemukan
            </Typography>
          }
          <Box overflow="auto">
            <List>
              {
                Array.isArray(peoples) &&
                peoples.map((item) => (
                  <ListItem key={item.name} sx={{ 
                    flexWrap: "wrap", 
                    border: "2px solid " + blue[500],
                    borderRadius: 1.5,
                    mb: 1 }}>
                    <ListItemAvatar>
                      <Avatar />
                    </ListItemAvatar>
                    <ListItemText primary={item.name} />
                    <Box width="100%" mt={1}>
                      <Divider sx={{ mb: 2 }}/>
                      <Typography variant="body1">
                        Umur : {new Date().getFullYear() - new Date(item.birthDate).getFullYear()} Tahun
                      </Typography>
                      <Typography variant="body1">
                        Jenis Kelamin : {item.gender}
                      </Typography>
                      <Typography variant="body1">
                        Pekerjaan : {item.job}
                      </Typography>
                    </Box>
                  </ListItem>
                ))
              }
            </List>
          </Box>
        </>
      }

    </Box>
  )
}

Page.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <Maps>
      {page}
    </Maps>
  )
}
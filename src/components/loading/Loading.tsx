import { Box, LinearProgress, Paper, Stack, Typography } from "@mui/material";
import { blue } from "@mui/material/colors";
import Image from "next/image";


export default function Loading() {

  return (
    <Box sx={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      zIndex: 9999,
      backgroundColor: blue[500],
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}>
      <Box component={Paper} sx={{ p: 2, alignItems: "center", maxWidth: 320, width: "100%" }}>
        <Box display="flex" sx={{ justifyContent: "center", mb: 5 }}>
          <Image src="/images/logo.png" alt="Logo Magetan" width={120} height={126} />
        </Box>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h1" align="center" sx={{ fontSize: 32, fontWeight: 800 }}>Tambran</Typography>
          <Typography variant="h5" align="center" sx={{ fontSize: 18 }}>Smart Urban Village</Typography>
        </Box>
        <LinearProgress variant="indeterminate" />
      </Box>
    </Box>
  )
}
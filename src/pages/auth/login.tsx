import { Box, Paper, Typography, Stack, TextField, Button, Icon, CircularProgress } from "@mui/material";
import { grey } from "@mui/material/colors";
import Image from "next/image";
import { useState } from "react";

export default function Login() {
  const [loading, setLoading] = useState(false);

  return (
    <Box 
      sx={{
        minHeight: "100vh",
        padding: "5em 1em 0em 1em",
        backgroundColor: grey[200]
      }}>
      <Box component={Paper} width="100%" maxWidth="360px" p={2} mx="auto" mb={5}>
        <Stack spacing={2} sx={{ alignItems: "center" }}>
          <Image src="/images/logo.png" width={72} height={80} alt="Logo Magetan" />
          <Typography variant="h1" sx={{ fontSize: 24, fontWeight: 700 }}>
            Login
          </Typography>
        </Stack>
        <Stack spacing={1} mb={2}>
          <Typography component="label" htmlFor="form-email" variant="body1">Email</Typography>
          <TextField 
            id="form-email"
            type="email"
            name="email"
            label="Masukkan Email"
            defaultValue="" />

          <Typography component="label" htmlFor="form-password" variant="body1">Password</Typography>
          <TextField 
            id="form-password"
            type="password"
            name="password"
            label="Masukkan Password"
            defaultValue="" />
        </Stack>
        <Button
          variant="contained"
          fullWidth
          disabled={loading}
          startIcon={(loading) ? <CircularProgress size={16} /> : <Icon className="material-symbols-rounded">lock</Icon>}>
          Login
        </Button>
      </Box>

      <Box>
        <Typography variant="body1" align="center" sx={{ fontColor: "divider" }}>
          &#169;{new Date().getFullYear()} PT. Digvisi 
        </Typography>
      </Box>
    </Box>
  )
}
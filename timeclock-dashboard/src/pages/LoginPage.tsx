import Box from "@mui/material/Box";
import GoogleLoginButton from "../components/GoogleLoginButton";

export default function LoginPage() {
  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <GoogleLoginButton />
    </Box>
  );
}

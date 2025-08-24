// import * as React from "react";
// import Avatar from "@mui/material/Avatar";
// import Button from "@mui/material/Button";
// import CssBaseline from "@mui/material/CssBaseline";
// import TextField from "@mui/material/TextField";
// import FormControlLabel from "@mui/material/FormControlLabel";
// import Checkbox from "@mui/material/Checkbox";
// import Link from "@mui/material/Link";
// import Paper from "@mui/material/Paper";
// import Box from "@mui/material/Box";
// import Grid from "@mui/material/Grid";
// import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
// import Typography from "@mui/material/Typography";
// import { createTheme, ThemeProvider } from "@mui/material/styles";
// import { AuthContext } from "../context/authContext";
// import Snackbar from "@mui/material/Snackbar";
// import Alert from "@mui/material/Alert";

// // TODO remove, this demo shouldn't need to reset the theme.

// const defaultTheme = createTheme();

// export default function Authentication() {
//   // Initialize state with empty strings instead of undefined
//   const [username, setUsername] = React.useState("");
//   const [password, setPassword] = React.useState("");
//   const [name, setName] = React.useState("");
//   const [error, setError] = React.useState("");
//   const [message, setMessage] = React.useState("");

//   const [formState, setFormState] = React.useState(0);
//   const [open, setOpen] = React.useState(false);

//   const { handleRegister, handleLogin } = React.useContext(AuthContext);

//   const handleAuth = async () => {
//     try {
//       setError(""); // Clear previous errors
//       if (formState === 0) {
//         await handleLogin(username, password);
//         setMessage("Login successful!");
//         setOpen(true);
//       } else if (formState === 1) {
//         let result = await handleRegister(name, username, password);
//         setMessage(result);
//         setOpen(true);
//         setError("")
//         setFormState(0)
//         setPassword("")

//       }
//     } catch (err) {
//       console.log(err);
//       // Fix: Remove the return statement that was preventing error display
//       const errorMessage = err.response?.data?.message || "Something went wrong";
//       setError(errorMessage);
//     }
//   };

//   const handleCloseSnackbar = () => {
//     setOpen(false);
//   };

//   return (
//     <ThemeProvider theme={defaultTheme}>
//       <Grid container component="main" sx={{ height: "100vh" }}>
//         <CssBaseline />
// <Grid
//   size={{ xs: false, sm: 4, md: 7 }}
//   sx={{
//             backgroundImage:
//               "url(https://source.unsplash.com/random?wallpapers)",
//             backgroundRepeat: "no-repeat",
//             backgroundColor: (t) =>
//               t.palette.mode === "light"
//                 ? t.palette.grey[50]
//                 : t.palette.grey[900],
//             backgroundSize: "cover",
//             backgroundPosition: "center",
//           }}
//         />
//         <Grid size={{ xs: 12, sm: 8, md: 5 }} component={Paper} elevation={6} square>

//           <Box
//             sx={{
//               my: 8,
//               mx: 4,
//               display: "flex",
//               flexDirection: "column",
//               alignItems: "center",
//             }}
//           >
//             <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
//               <LockOutlinedIcon />
//             </Avatar>
//             <div>
//               <Button
//                 variant={formState === 0 ? "contained" : "outlined"}
//                 onClick={() => {
//                   setFormState(0);
//                   setError(""); // Clear error when switching forms
//                 }}
//                 sx={{ mr: 1 }}
//               >
//                 Sign In
//               </Button>

//               <Button
//                 variant={formState === 1 ? "contained" : "outlined"}
//                 onClick={() => {
//                   setFormState(1);
//                   setError(""); // Clear error when switching forms
//                 }}
//               >
//                 Sign Up
//               </Button>
//             </div>

//             <Typography component="h1" variant="h5">
//               {formState === 0 ? "Sign in" : "Create Account"}
//             </Typography>

//             <Box component="form" noValidate sx={{ mt: 1 }}>
//               {formState === 1 && (
//                 <TextField
//                   margin="normal"
//                   required
//                   fullWidth
//                   id="name"
//                   label="Full Name"
//                   name="name"
//                   autoComplete="name"
//                   autoFocus
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                 />
//               )}

//               <TextField
//                 margin="normal"
//                 required
//                 fullWidth
//                 id="username"
//                 label="Username"
//                 name="username"
//                 autoComplete="username"
//                 autoFocus={formState === 0}
//                 value={username}
//                 onChange={(e) => setUsername(e.target.value)}
//               />

//               <TextField
//                 margin="normal"
//                 required
//                 fullWidth
//                 name="password"
//                 label="Password"
//                 type="password"
//                 id="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//               />

//               {error && (
//                 <Alert severity="error" sx={{ mt: 2 }}>
//                   {error}
//                 </Alert>
//               )}

//               <Button
//                 type="button"
//                 fullWidth
//                 variant="contained"
//                 sx={{ mt: 3, mb: 2 }}
//                 onClick={handleAuth}
//               >
//                 {formState === 0 ? "Sign In" : "Register"}
//               </Button>
//             </Box>
//           </Box>
//         </Grid>
//       </Grid>

//       <Snackbar
//         open={open}
//         autoHideDuration={4000}
//         onClose={handleCloseSnackbar}
//         message={message}
//       />
//     </ThemeProvider>
//   );
// }

import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { AuthContext } from "../context/authContext";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Divider from "@mui/material/Divider";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#7c3aed" },
    background: { default: "#071025", paper: "#0b1220" },
    text: { primary: "#e6eef8", secondary: "#a8c0e6" },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: { styleOverrides: { root: { textTransform: "none", borderRadius: 10, fontWeight: 700 } } },
    MuiPaper: { styleOverrides: { root: { borderRadius: 14 } } },
  },
});

export default function Authentication() {
  const { handleRegister, handleLogin } = React.useContext(AuthContext);

  const [formState, setFormState] = React.useState(0); // 0 sign in, 1 sign up
  const [name, setName] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);

  const [error, setError] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [open, setOpen] = React.useState(false);

  const handleAuth = async () => {
    try {
      setError("");
      if (formState === 0) {
        await handleLogin(username.trim(), password);
        setMessage("Login successful!");
        setOpen(true);
      } else {
        const result = await handleRegister(name.trim(), username.trim(), password);
        setMessage(result || "Account created. Please sign in.");
        setFormState(0);
        setPassword("");
        setOpen(true);
      }
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "Something went wrong";
      setError(msg);
      setMessage("");
      setOpen(true);
    }
  };

  const handleCloseSnackbar = (_, reason) => {
    if (reason === "clickaway") return;
    setOpen(false);
  };

  const disableSubmit =
    formState === 0
      ? username.trim() === "" || password === ""
      : name.trim() === "" || username.trim() === "" || password === "";

  return (
    <ThemeProvider theme={darkTheme}>
      <Box
        sx={{
          minHeight: "100vh",
          width: "100%",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          // IMAGE + DARK OVERLAY (gradient above image)
          backgroundImage:
            "linear-gradient(180deg, rgba(6,10,20,0.68), rgba(6,10,20,0.68)), url('/Authentication.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <CssBaseline />

        {/* Background decorative blobs (optional depth) */}
        <Box
          aria-hidden
          sx={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            background:
              "radial-gradient(1200px 600px at 10% 20%, rgba(124,58,237,0.08), transparent 10%), radial-gradient(900px 500px at 90% 80%, rgba(3,105,161,0.06), transparent 12%)",
          }}
        />

        <Paper
          elevation={12}
          sx={{
            position: "relative",
            zIndex: 5,
            width: { xs: "92%", sm: 520 },
            borderRadius: 3,
            p: { xs: 3, sm: 5 },
            bgcolor: "rgba(6,10,20,0.64)", // dark transparent glass
            color: "text.primary",
            border: "1px solid rgba(255,255,255,0.04)",
            backdropFilter: "blur(8px)",
            boxShadow: "0 20px 60px rgba(2,6,23,0.6)",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <Avatar sx={{ bgcolor: "transparent", boxShadow: "0 6px 20px rgba(124,58,237,0.14)" }}>
              <LockOutlinedIcon sx={{ color: "#fff" }} />
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, color: "common.white" }}>
                {formState === 0 ? "Welcome back" : "Create your account"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {formState === 0 ? "Sign in to continue" : "Enter your details to register"}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
            <Button
              variant={formState === 0 ? "contained" : "outlined"}
              onClick={() => {
                setFormState(0);
                setError("");
              }}
              sx={{
                px: 3,
                borderRadius: 2,
                bgcolor: formState === 0 ? "primary.main" : "transparent",
                color: formState === 0 ? "common.white" : "text.primary",
              }}
            >
              Sign In
            </Button>

            <Button
              variant={formState === 1 ? "contained" : "outlined"}
              onClick={() => {
                setFormState(1);
                setError("");
              }}
              sx={{
                px: 3,
                borderRadius: 2,
                bgcolor: formState === 1 ? "primary.main" : "transparent",
                color: formState === 1 ? "common.white" : "text.primary",
              }}
            >
              Sign Up
            </Button>
          </Box>

          <Box component="form" noValidate sx={{ display: "grid", gap: 2 }}>
            {formState === 1 && (
              <TextField
                label="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                fullWidth
                InputLabelProps={{ sx: { color: "rgba(230,238,248,0.9)" } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon sx={{ color: "rgba(180,200,235,0.9)" }} />
                    </InputAdornment>
                  ),
                  sx: { bgcolor: "rgba(255,255,255,0.02)", borderRadius: 1.5 },
                }}
                sx={{ "& .MuiOutlinedInput-notchedOutline": { borderColor: "transparent" } }}
              />
            )}

            <TextField
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              fullWidth
              autoFocus={formState === 0}
              InputLabelProps={{ sx: { color: "rgba(230,238,248,0.9)" } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon sx={{ color: "rgba(180,200,235,0.9)" }} />
                  </InputAdornment>
                ),
                sx: { bgcolor: "rgba(255,255,255,0.02)", borderRadius: 1.5 },
              }}
              sx={{ "& .MuiOutlinedInput-notchedOutline": { borderColor: "transparent" } }}
            />

            <TextField
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPassword ? "text" : "password"}
              required
              fullWidth
              InputLabelProps={{ sx: { color: "rgba(230,238,248,0.9)" } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: "rgba(180,200,235,0.9)" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      onClick={() => setShowPassword((s) => !s)}
                      edge="end"
                      size="small"
                      sx={{ color: "rgba(200,220,255,0.85)" }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
                sx: { bgcolor: "rgba(255,255,255,0.02)", borderRadius: 1.5 },
              }}
              sx={{ "& .MuiOutlinedInput-notchedOutline": { borderColor: "transparent" } }}
            />

            {error && (
              <Alert severity="error" onClose={() => setError("")} sx={{ bgcolor: "rgba(255,20,60,0.06)", color: "common.white" }}>
                {error}
              </Alert>
            )}

            <Button
              fullWidth
              variant="contained"
              disabled={disableSubmit}
              onClick={handleAuth}
              sx={{
                py: 1.4,
                fontWeight: 700,
                borderRadius: 2,
                textTransform: "none",
                background: "linear-gradient(90deg,#7c3aed 0%, #4f46e5 100%)",
                "&:hover": { background: "linear-gradient(90deg,#6d28d9 0%, #4338ca 100%)" },
              }}
            >
              {formState === 0 ? "Sign In" : "Create Account"}
            </Button>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Divider sx={{ flex: 1, bgcolor: "rgba(255,255,255,0.06)" }} />
              <Typography variant="caption" color="text.secondary">
                or
              </Typography>
              <Divider sx={{ flex: 1, bgcolor: "rgba(255,255,255,0.06)" }} />
            </Box>

            <Typography variant="caption" color="text.secondary" sx={{ textAlign: "center" }}>
              By continuing, you agree to our Terms & Privacy.
            </Typography>
          </Box>
        </Paper>

        <Snackbar open={open} autoHideDuration={4000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
          <Alert onClose={handleCloseSnackbar} severity={error ? "error" : "success"} sx={{ width: "100%" }}>
            {error ? error : message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}

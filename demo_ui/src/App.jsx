import React, { useState } from "react";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Fade,
  Slide,
  Alert,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Send as SendIcon,
  Clear as ClearIcon,
  ContentCopy as CopyIcon,
  CheckCircle as CheckIcon,
} from "@mui/icons-material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
      light: "#42a5f5",
      dark: "#1565c0",
    },
    secondary: {
      main: "#9c27b0",
    },
    background: {
      default: "#f5f5f5",
    },
  },
  typography: {
    h4: {
      fontWeight: 600,
      background: "linear-gradient(45deg, #1976d2 30%, #9c27b0 90%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 25,
          textTransform: "none",
          padding: "10px 30px",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 15,
          },
        },
      },
    },
  },
});

function App() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError("");
    setResponse(null);

    try {
      const res = await fetch("http://localhost:8000/demo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: query.trim() }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setResponse(data);
    } catch (err) {
      console.error("Error:", err);
      setError(
        "Failed to connect to the server. Make sure the Flask app is running on port 8000."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setQuery("");
    setResponse(null);
    setError("");
  };

  const handleCopyResponse = () => {
    if (response) {
      navigator.clipboard.writeText(JSON.stringify(response, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Fade in timeout={1000}>
          <Box textAlign="center" mb={4}>
            <Typography variant="h4" component="h1" gutterBottom>
              🚀 Flask API Demo Interface
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Send queries to your Flask REST endpoint and see the responses in
              real-time
            </Typography>
          </Box>
        </Fade>

        <Slide direction="up" in timeout={800}>
          <Paper
            elevation={8}
            sx={{
              p: 4,
              borderRadius: 3,
              background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
              border: "1px solid #e3f2fd",
            }}
          >
            <form onSubmit={handleSubmit}>
              <Box display="flex" gap={2} alignItems="flex-start" mb={3}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  variant="outlined"
                  label="Enter your query"
                  placeholder="Type your message here..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  disabled={loading}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": {
                        borderColor: "primary.main",
                      },
                    },
                  }}
                />
                <Box display="flex" flexDirection="column" gap={1}>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading || !query.trim()}
                    startIcon={
                      loading ? <CircularProgress size={20} /> : <SendIcon />
                    }
                    sx={{
                      background:
                        "linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)",
                      boxShadow: "0 3px 5px 2px rgba(25, 118, 210, .3)",
                      "&:hover": {
                        background:
                          "linear-gradient(45deg, #1565c0 30%, #1976d2 90%)",
                      },
                    }}
                  >
                    {loading ? "Sending..." : "Send"}
                  </Button>
                  <Tooltip title="Clear all">
                    <IconButton
                      onClick={handleClear}
                      disabled={loading}
                      color="secondary"
                      sx={{
                        "&:hover": {
                          background: "rgba(156, 39, 176, 0.08)",
                        },
                      }}
                    >
                      <ClearIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            </form>

            {error && (
              <Fade in>
                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                  {error}
                </Alert>
              </Fade>
            )}

            {response && (
              <Fade in timeout={600}>
                <Card
                  sx={{
                    mt: 3,
                    borderRadius: 3,
                    background:
                      "linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)",
                    border: "1px solid #bbdefb",
                  }}
                >
                  <CardContent>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      mb={2}
                    >
                      <Box display="flex" alignItems="center" gap={1}>
                        <CheckIcon color="success" />
                        <Typography variant="h6" color="primary">
                          Response
                        </Typography>
                      </Box>
                      <Tooltip title={copied ? "Copied!" : "Copy response"}>
                        <IconButton
                          onClick={handleCopyResponse}
                          color={copied ? "success" : "primary"}
                          size="small"
                        >
                          <CopyIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>

                    <Box mb={2}>
                      <Chip
                        label={`Query: "${response.query}"`}
                        variant="outlined"
                        color="primary"
                        sx={{ mr: 1, mb: 1 }}
                      />
                    </Box>

                    <Paper
                      sx={{
                        p: 2,
                        bgcolor: "background.paper",
                        borderRadius: 2,
                        border: "1px solid #e0e0e0",
                      }}
                    >
                      <Typography
                        variant="body1"
                        sx={{ fontFamily: "monospace", whiteSpace: "pre-wrap" }}
                      >
                        {JSON.stringify(response, null, 2)}
                      </Typography>
                    </Paper>
                  </CardContent>
                </Card>
              </Fade>
            )}
          </Paper>
        </Slide>

        <Fade in timeout={1200}>
          <Box textAlign="center" mt={4}>
            <Typography variant="caption" color="text.secondary">
              💡 Make sure your Flask app is running on localhost:8000
            </Typography>
          </Box>
        </Fade>
      </Container>
    </ThemeProvider>
  );
}

export default App;

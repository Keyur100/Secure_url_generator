import React, { useState } from "react";
import {
  Button,
  Container,
  TextField,
  Typography,
  Alert,
  Paper,
  Link as MuiLink,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { submitSecret } from "../api";

export default function CreateSecret() {
  const [secret, setSecret] = useState("");
  const [link, setLink] = useState(""); // This will now store just the relative path (e.g., /secret/abc123)
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    setLink("");
    try {
      const res = await submitSecret(secret);
      setLink(res.link); // only relative path like /secret/abc123
      setSecret("");
    } catch (err) {
      setError("Failed to submit secret");
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={4} sx={{ padding: 4, marginTop: 10 }}>
        <Typography variant="h5" gutterBottom>
          One-Time Secret Generator
        </Typography>

        <TextField
          label="Enter your secret"
          fullWidth
          multiline
          rows={4}
          margin="normal"
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
        />

        <Button
          variant="contained"
          fullWidth
          onClick={handleSubmit}
          disabled={secret.trim() === ""}
        >
          Generate Link
        </Button>

        {link && (
          <Alert severity="success" sx={{ mt: 2 }}>
            Share this link:&nbsp;
            <MuiLink
              component={RouterLink}
              to={link}
              underline="always"
              sx={{ color: "inherit", wordBreak: "break-all" }}
            >
              {window.location.origin + link}
            </MuiLink>
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Paper>
    </Container>
  );
}

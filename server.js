// MINIMAL TEST — Does Hostinger's proxy reach this app at all?
import express from "express";
const app = express();

app.get("/", (req, res) => {
  res.send("HELLO PAWWL - Server is alive!");
});

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`MINIMAL TEST SERVER on port ${PORT}`);
});

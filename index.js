import express from "express";
import qrcode from "qrcode-terminal";
import pkg from "whatsapp-web.js";
import chromium from "chromium";
const { Client, LocalAuth } = pkg;

const app = express();
app.use(express.json());

const client = new Client({
  authStrategy: new LocalAuth({ dataPath: "./session" }),
  puppeteer: {
    executablePath: chromium.path,
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--disable-extensions",
      "--disable-infobars"
    ]
  }
});

client.on("qr", qr => {
  console.log("📌 Escanea este QR:");
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("🤖 Bot de WhatsApp LISTO!");
});

app.post("/send", async (req, res) => {
  const { groupId, message } = req.body;

  try {
    await client.sendMessage(`${groupId}@g.us`, message);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error enviando mensaje" });
  }
});

app.listen(10000, () => console.log("API activa en puerto 10000"));

client.initialize();



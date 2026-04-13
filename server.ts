import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for feedback
  app.post("/api/feedback", (req, res) => {
    const { rating, comment, name, email, client, campaign } = req.body;
    
    console.log("--- New Feedback Received ---");
    console.log(`Rating: ${rating} Stars`);
    console.log(`Comment: ${comment}`);
    console.log(`From: ${name} (${email})`);
    console.log(`Client Context: ${client}`);
    console.log(`Campaign: ${campaign}`);
    console.log("-----------------------------");

    // In a real production app, you would use a service like Resend or SendGrid here:
    /*
    await resend.emails.send({
      from: 'feedback@yourdomain.com',
      to: 'admin@yourdomain.com',
      subject: `New ${rating}-Star Feedback from ${name}`,
      text: `Rating: ${rating}\nComment: ${comment}\nUser: ${name} (${email})`
    });
    */

    res.json({ success: true, message: "Feedback received and admin notified." });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

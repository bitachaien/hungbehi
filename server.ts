import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // API routes FIRST
  app.get("/api/data", (req, res) => {
    const numbers = Array.from({ length: 100 }, (_, i) => {
      const num = i.toString().padStart(2, '0');
      const price = Math.floor(Math.random() * 100) + 700;
      const val1 = Math.floor(Math.random() * 1000);
      const val2 = Math.floor(Math.random() * 500);
      
      return {
        id: num,
        price: price,
        val1: val1,
        val2: val2,
      };
    });

    res.json({
      numbers,
      status: {
        risk: Math.floor(Math.random() * 5) + 1,
        totalAmount: Math.floor(Math.random() * 1000000),
        totalPoints: Math.floor(Math.random() * 5000),
        avgPrice: Math.floor(Math.random() * 50) + 700
      },
      dashboard: {
        todayWinLose: Math.floor(Math.random() * 200000) - 50000,
        yesterdayWinLose: Math.floor(Math.random() * 150000) - 30000,
        outstanding: Math.floor(Math.random() * 500000),
        onlineUsers: Math.floor(Math.random() * 50),
        topWinners: [
          { id: 1, name: 'user_888', amount: 45000, agency: 'AG_01' },
          { id: 2, name: 'lucky_player', amount: 32000, agency: 'AG_01' },
          { id: 3, name: 'win_big', amount: 28000, agency: 'AG_02' }
        ],
        topLosers: [
          { id: 1, name: 'player_x', amount: -15000, agency: 'AG_01' },
          { id: 2, name: 'sad_bet', amount: -12000, agency: 'AG_03' }
        ],
        accountStatus: {
          stopped: 0,
          closed: 0,
          active: 3,
          total: 3
        }
      }
    });
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

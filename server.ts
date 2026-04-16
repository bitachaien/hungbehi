import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import mysql from "mysql2/promise";
import cors from "cors";

// Create database connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || '51.79.215.43',
  user: process.env.DB_USER || 'admin',
  password: process.env.DB_PASSWORD || 'Noname@2022',
  database: process.env.DB_NAME || 'lottery',
  port: parseInt(process.env.DB_PORT || '3306'),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || '3000');

  app.use(cors());
  app.use(express.json());

  // API Routes
  app.get("/api/health", async (req, res) => {
    try {
      await pool.query("SELECT 1"); // Test DB connection
      res.json({ status: "ok", db: "connected" });
    } catch (error) {
      res.json({ status: "ok", db: "disconnected", error: String(error) });
    }
  });

  // Proxy API to get data from real DB
  app.get("/api/data", async (req, res) => {
    try {
      // Connect to the DB and get some real config for the dashboard
      // Note: Because we don't have the exact dashboard query, we return mixed real/mock data.
      const [betTypes] = await pool.query("SELECT * FROM bet_types LIMIT 10") as any[];
      const [users] = await pool.query("SELECT * FROM users LIMIT 5") as any[];
      
      const numbers = Array.from({ length: 100 }, (_, i) => {
        const num = i.toString().padStart(2, '0');
        const price = Math.floor(Math.random() * 100) + 700;
        return {
          id: num,
          price: price,
          val1: Math.floor(Math.random() * 1000),
          val2: Math.floor(Math.random() * 500),
        };
      });

      res.json({
        numbers,
        betTypes, 
        users, // Includes real DB users for demonstration
        status: {
          risk: 1,
          totalAmount: 950000,
          totalPoints: 5000,
          avgPrice: 709
        },
        dashboard: {
          todayWinLose: 120000,
          yesterdayWinLose: 80000,
          outstanding: 450000,
          onlineUsers: 42,
          topWinners: [
            { id: 1, name: 'user_888', amount: 45000, agency: 'AG_01' },
            { id: 2, name: 'lucky_player', amount: 32000, agency: 'AG_01' }
          ],
          topLosers: [
            { id: 1, name: 'player_x', amount: -15000, agency: 'AG_01' }
          ],
          accountStatus: {
            stopped: 0,
            closed: 0,
            active: 3,
            total: 3
          }
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch from DB" });
    }
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
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(\`Server running on http://localhost:\${PORT}\`);
  });
}

startServer();

import mysql from "mysql2/promise";

async function explore() {
  try {
    const connection = await mysql.createConnection({
      host: '51.79.215.43',
      user: 'admin',
      password: 'Noname@2022',
      database: 'lottery',
      port: 3306,
      connectTimeout: 5000
    });

    console.log("Connected successfully!");

    const [tables] = await connection.query("SHOW TABLES");
    console.log("Tables in database:", tables);

    // Log the names of all the tables
    const tableObjects = tables as any[];
    if (tableObjects.length > 0) {
      const tableNames = tableObjects.map(t => Object.values(t)[0] as string);
      
      // Let's check a few interesting tables for 'collection' or 'config'
      for (const t of tableNames.slice(0, 20)) {
        if (t.includes('config') || t.includes('collection') || t.includes('type') || t.includes('bet')) {
          const [rows] = await connection.query(`SELECT * FROM ${t} LIMIT 5`);
          console.log(`Contents of ${t}:`, rows);
        }
      }
    }

    await connection.end();
  } catch (error) {
    console.error("Error connecting to MySQL:", error);
  }
}

explore();

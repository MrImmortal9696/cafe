import mysql from 'mysql2/promise';
// Connection Pool
export const connect_mysql = mysql.createPool({
  host: '148.135.138.206',   // VPS IP
  user: 'omkar',             // MySQL user
  password: 'Omkar@12345',   // Password
  database: 'new_client_db', // New database
  port: 3306,                // Default MySQL port
  connectionLimit: 200,      // Connection pool size
  waitForConnections: true,  // Queue handling
  queueLimit: 0,
});

// Single Connection
export const connect_mysql_obj = async () => {
  const connection = await mysql.createConnection({
    host: '148.135.138.206',
    user: 'omkar',
    password: 'Omkar@12345',
    database: 'new_client_db',
    port: 3306,
  });
  return connection;
};




// //Hostinger Connection

// import mysql from 'mysql2/promise';

// // Connection Pool (Recommended for multiple queries)
// export const connect_mysql = mysql.createPool({
//   host: 'srv1020.hstgr.io',   // Remote MySQL host
//   user: 'u546433216_root',    // MySQL username (ensure it's correct)
//   password: 'Maria@986075',   // MySQL password (ensure it's correct)
//   database: 'u546433216_maria',  // MySQL database name
//   port: 3306,                 // MySQL port (use the correct port)
//   connectionLimit: 200,       // Connection pool size
//   waitForConnections: true,   // Wait for connections
//   queueLimit: 0,              // Queue limit
// });

// // Single Connection (For specific use cases)
// export const connect_mysql_obj = async () => {
//   const connection = await mysql.createConnection({
//     host: 'srv1020.hstgr.io',   // Remote MySQL host
//     user: 'u546433216_root',    // MySQL username (ensure it's correct)
//     password: 'Maria@986075',   // MySQL password (ensure it's correct)
//     database: 'u546433216_maria',  // MySQL database name
//     port: 3306,                 // MySQL port (use the correct port)
//   });
//   return connection;
// };




//SELECT User, Host FROM mysql.user;
//SHOW GRANTS FOR 'omkar'@'%';

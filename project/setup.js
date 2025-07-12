import mysql from 'mysql2/promise';

const createDatabase = async () => {
  try {
    // Create connection to MySQL server
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',     // Replace with your MySQL username
      password: ''      // Replace with your MySQL password
    });
    
    console.log('Connected to MySQL server');
    
    // Create the database
    await connection.query('CREATE DATABASE IF NOT EXISTS skill_matcher');
    console.log('Database "skill_matcher" created (if it didn\'t exist)');
    
    // Close the connection
    await connection.end();
    console.log('Connection closed');
    
    console.log('\nDatabase setup completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Update your MySQL credentials in server/config/database.js if needed');
    console.log('2. Start the backend server: cd server && npm run dev');
    console.log('3. Start the frontend server: cd client && npm run dev');
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  }
};

createDatabase();
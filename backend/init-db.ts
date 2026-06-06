import { db } from './database'

// Users table
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`)

// Health records table
db.exec(`
  CREATE TABLE IF NOT EXISTS health_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    date TEXT NOT NULL,
    systolic INTEGER,
    diastolic INTEGER,
    blood_sugar REAL,
    weight REAL,
    body_fat REAL,
    heart_rate INTEGER,
    cholesterol REAL,
    uric_acid REAL,
    notes TEXT,
    report_image TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )
`)

// Medications table
db.exec(`
  CREATE TABLE IF NOT EXISTS medications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    dosage TEXT,
    frequency TEXT,
    time TEXT,
    start_date TEXT,
    end_date TEXT,
    notes TEXT,
    active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )
`)

// Family members table
db.exec(`
  CREATE TABLE IF NOT EXISTS family_members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    member_id INTEGER NOT NULL,
    relation TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (member_id) REFERENCES users(id),
    UNIQUE(user_id, member_id)
  )
`)

console.log('Database initialized successfully')

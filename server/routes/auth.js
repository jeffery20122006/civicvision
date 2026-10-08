import express from 'express';
import { getDb } from '../database.js';

const router = express.Router();

// POST /api/auth/login (Citizen, Worker, Admin)
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const db = await getDb();
    let query = 'SELECT id, name, email, role, department FROM users WHERE email = ? AND password = ?';
    let params = [email, password];

    if (role) {
      query += ' AND role = ?';
      params.push(role);
    }

    const user = await db.get(query, params);

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials or role mismatch.' });
    }

    res.json({
      message: 'Login successful',
      token: `token-${user.id}-${Date.now()}`,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error during authentication.' });
  }
});

// POST /api/auth/register (Citizen & Worker account registration)
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, department } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const db = await getDb();

    const existing = await db.get('SELECT id FROM users WHERE email = ?', [email]);
    if (existing) {
      return res.status(409).json({ error: 'Account with this email already exists.' });
    }

    const result = await db.run(
      'INSERT INTO users (name, email, password, role, department) VALUES (?, ?, ?, ?, ?)',
      [name, email, password, role, department || null]
    );

    res.status(201).json({
      message: 'Account created successfully',
      user: {
        id: result.lastID,
        name,
        email,
        role,
        department: department || null
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error during registration.' });
  }
});

export default router;

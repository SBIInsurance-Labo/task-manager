const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb' }));
app.use(express.static('public'));

const db = new sqlite3.Database('./tasks.db', (err) => {
  if (err) {
    console.error('Database error:', err.message);
  } else {
    console.log('Connected to SQLite database');
    initializeDB();
  }
});

function initializeDB() {
  db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      file_link TEXT,
      assignee TEXT,
      reviewer TEXT,
      status TEXT DEFAULT 'not_started',
      priority TEXT DEFAULT 'medium',
      due_date TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (!err) {
      db.run(`INSERT OR IGNORE INTO projects (name) VALUES ('Default')`);
    }
  });

  db.run(`
    CREATE TABLE IF NOT EXISTS task_projects (
      task_id INTEGER,
      project_id INTEGER,
      PRIMARY KEY (task_id, project_id),
      FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    )
  `);
}

app.get('/api/projects', (req, res) => {
  db.all('SELECT * FROM projects ORDER BY name', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

app.post('/api/projects', (req, res) => {
  const { name } = req.body;
  if (!name || name.trim() === '') {
    return res.status(400).json({ error: 'Project name required' });
  }

  db.run(
    'INSERT INTO projects (name) VALUES (?)',
    [name],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: this.lastID, name });
    }
  );
});

app.get('/api/tasks', (req, res) => {
  const { project_id } = req.query;
  
  let query = `
    SELECT DISTINCT t.* FROM tasks t
    LEFT JOIN task_projects tp ON t.id = tp.task_id
  `;
  let params = [];

  if (project_id) {
    query += ` WHERE tp.project_id = ?`;
    params.push(project_id);
  }

  query += ` ORDER BY t.created_at DESC`;

  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

app.post('/api/tasks', (req, res) => {
  const { title, description, file_link, assignee, reviewer, priority, due_date, project_id } = req.body;

  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'Title required' });
  }

  db.run(
    'INSERT INTO tasks (title, description, file_link, assignee, reviewer, status, priority, due_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [title, description || '', file_link || '', assignee || '', reviewer || '', 'not_started', priority || 'medium', due_date || null],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      const taskId = this.lastID;
      const projId = project_id || 1;

      db.run(
        'INSERT INTO task_projects (task_id, project_id) VALUES (?, ?)',
        [taskId, projId],
        (err) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          res.json({ 
            id: taskId, 
            title, 
            description, 
            file_link,
            assignee, 
            reviewer,
            status: 'not_started', 
            priority: priority || 'medium',
            due_date: due_date || null,
            project_id: projId 
          });
        }
      );
    }
  );
});

app.patch('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, file_link, assignee, reviewer, status, priority, due_date } = req.body;

  let updates = [];
  let params = [];

  if (title !== undefined) {
    updates.push('title = ?');
    params.push(title);
  }
  if (description !== undefined) {
    updates.push('description = ?');
    params.push(description);
  }
  if (file_link !== undefined) {
    updates.push('file_link = ?');
    params.push(file_link);
  }
  if (assignee !== undefined) {
    updates.push('assignee = ?');
    params.push(assignee);
  }
  if (reviewer !== undefined) {

CREATE TABLE vault_files (
  id INTEGER PRIMARY KEY,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  revision TEXT NOT NULL,
  status TEXT NOT NULL,
  owner TEXT NOT NULL,
  last_action TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

INSERT INTO vault_files (id, file_name, file_type, revision, status, owner, last_action, updated_at) VALUES
  (1, 'Motor housing', 'sldprt', 'C', 'Approved', 'J. Lim', 'Checked in', '2024-03-18 09:42'),
  (2, 'Assembly line layout', 'sldasm', 'B', 'Needs review', 'C. Patel', 'Workflow update', '2024-03-18 10:15'),
  (3, 'Cooling manifold', 'sldprt', 'A', 'Released', 'A. Rivera', 'Released to manufacturing', '2024-03-18 12:05');

const express = require('express');

const app = express();

app.use(express.json());

const projects = [{ id: '1', title: 'teste', tasks: [] }];

app.get('/projects', (req, res) => {
  return res.json(projects);
});

app.post('/projects', (req, res) => {
  const { id, title } = req.body;

  projects.push({
    id,
    title,
  });

  return res.send('Projeto adicionado com sucesso');
});

app.put('/projects/:id', (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const selectedProject = projects.find((project) => project.id === id);
  if (selectedProject) {
    selectedProject.title = title;

    res.json(selectedProject);
  }
  res.status(500).send(`Projeto com id ${id} não encontrado`);
});

app.delete('/projects/:id', (req, res) => {
  const { id } = req.params;

  projects.splice(id, 1);

  return res.send('Projeto deletado com sucesso!');
});

app.post('/projects/:id/tasks', (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const selectedProject = projects.find((project) => project.id === id);
  if (selectedProject) {
    selectedProject.tasks.push(title);

    res.json(selectedProject);
  }
  res.status(500).send(`Projeto com id ${id} não encontrado`);
});

app.listen(3001);

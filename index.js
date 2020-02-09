const express = require('express');

const app = express();

app.use(express.json());

const projects = [{ id: '1', title: 'teste', tasks: [] }];
let requestsCount = 0;

app.use((req, res, next) => {
  requestsCount++;
  console.log('Number of requests made: ', requestsCount);
  return next();
});

function checkProjectExists(req, res, next) {
  const { id } = req.params;

  const selectedProject = projects.find((project) => project.id === id);
  if (!selectedProject) {
    return res.status(500).send(`Projeto com id ${id} não encontrado.`);
  }
  req.project = selectedProject;
  return next();
}

function canAddProject(req, res, next) {
  const { id } = req.body;

  const hasProjectWithSameId = projects.find((project) => project.id === id);
  if (hasProjectWithSameId) {
    return res.status(500).send(`Projeto com id ${id} já existe.`);
  }
  return next();
}

app.get('/projects', (req, res) => {
  return res.json(projects);
});

app.post('/projects', canAddProject, (req, res) => {
  const { id, title } = req.body;

  projects.push({
    id,
    title,
  });

  return res.send('Projeto adicionado com sucesso');
});

app.put('/projects/:id', checkProjectExists, (req, res) => {
  const { title } = req.body;
  const { project } = req;

  project.title = title;

  res.json(project);
});

app.delete('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params;

  const removeIndex = projects.map((project) => project.id).indexOf(id);
  projects.splice(removeIndex, 1);

  return res.send('Projeto deletado com sucesso!');
});

app.post('/projects/:id/tasks', checkProjectExists, (req, res) => {
  const { title } = req.body;
  const { project } = req;

  project.tasks.push(title);

  res.json(project);
});

app.listen(3001);

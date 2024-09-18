import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Container, AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import Estudiantes from './components/Estudiantes';
import Cursos from './components/Cursos';
import Inscripciones from './components/Inscripciones';
import Profesores from './components/Profesores';

function App() {
  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              Gestión Educativa
            </Link>
          </Typography>
          <Button color="inherit" component={Link} to="/estudiantes">Estudiantes</Button>
          <Button color="inherit" component={Link} to="/cursos">Cursos</Button>
          <Button color="inherit" component={Link} to="/inscripciones">Inscripciones</Button>
          <Button color="inherit" component={Link} to="/profesores">Profesores</Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4 }}>
        <Routes>
          <Route
            path="/"
            element={
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" component="h1" gutterBottom>
                  ¡Bienvenido a la Gestión Educativa!
                </Typography>
                <Typography variant="h6" component="p" gutterBottom>
                  Elige una de las secciones a continuación:
                </Typography>
                <Button variant="contained" color="primary" component={Link} to="/estudiantes" sx={{ m: 1 }}>
                  Estudiantes
                </Button>
                <Button variant="contained" color="primary" component={Link} to="/cursos" sx={{ m: 1 }}>
                  Cursos
                </Button>
                <Button variant="contained" color="primary" component={Link} to="/inscripciones" sx={{ m: 1 }}>
                  Inscripciones
                </Button>
                <Button variant="contained" color="primary" component={Link} to="/profesores" sx={{ m: 1 }}>
                  Profesores
                </Button>
              </Box>
            }
          />
          <Route path="/estudiantes" element={<Estudiantes />} />
          <Route path="/cursos" element={<Cursos />} />
          <Route path="/inscripciones" element={<Inscripciones />} />
          <Route path="/profesores" element={<Profesores />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;

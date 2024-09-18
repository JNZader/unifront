import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import {
  Container, AppBar, Toolbar, Typography, Button, Box,
  ThemeProvider, createTheme, CssBaseline, useMediaQuery,
  IconButton, Drawer, List, ListItem, ListItemText
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { styled } from '@mui/system';
import Estudiantes from './components/Estudiantes';
import Cursos from './components/Cursos';
import Inscripciones from './components/Inscripciones';
import Profesores from './components/Profesores';

// Crear un tema personalizado
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1976d2', // Ajusta el color primario
    },
    secondary: {
      main: '#4caf50', // Ajusta el color secundario
    },
    background: {
      paper: '#303030', // Fondo oscuro para componentes
      default: '#202020', // Fondo más oscuro para la aplicación
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif', // Fuente personalizada
  },
});

// Estilizar el contenedor principal
const MainContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
}));

// Estilizar los botones de navegación
const NavButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1),
  '&:hover': {
    backgroundColor: theme.palette.primary.dark, // Color de fondo en hover
  },
}));

function App() {
  const [mobileOpen, setMobileOpen] = React.useState(false); // Estado para controlar el Drawer en móviles
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Verifica si la pantalla es móvil

  /**
   * Maneja la apertura y cierre del Drawer en móviles.
   */
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  /**
   * Componente del menú del Drawer.
   */

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        Gestión Educativa
      </Typography>
      <List>
        {['Estudiantes', 'Cursos', 'Inscripciones', 'Profesores'].map((text) => (
          <ListItem key={text} component={Link} to={`/${text.toLowerCase()}`}>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      {/* CssBaseline es un componente de Material-UI que normaliza el CSS */}
      <CssBaseline />
      {/* Configura el enrutador para manejar las rutas en la aplicación */}
      <Router basename={process.env.PUBLIC_URL}>
        {/* Barra de navegación superior (AppBar) */}
        <AppBar position="static">
          <Toolbar>
            {/* Botón de menú para dispositivos móviles */}
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}
            {/* Título de la aplicación como un enlace a la página principal */}
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                Gestión Educativa
              </Link>
            </Typography>
            {/* Botones de navegación para pantallas más grandes */}
            {!isMobile && (
              <>
                <NavButton color="inherit" component={Link} to="/estudiantes">Estudiantes</NavButton>
                <NavButton color="inherit" component={Link} to="/cursos">Cursos</NavButton>
                <NavButton color="inherit" component={Link} to="/inscripciones">Inscripciones</NavButton>
                <NavButton color="inherit" component={Link} to="/profesores">Profesores</NavButton>
              </>
            )}
          </Toolbar>
        </AppBar>
        {/* Componente de navegación lateral (Drawer) */}
        <Box component="nav">
          <Drawer
            variant="temporary" // Variantes del Drawer (temporal para móviles)
            open={mobileOpen}
            onClose={handleDrawerToggle} // Maneja el cierre del Drawer
            ModalProps={{
              keepMounted: true, // Mejora el rendimiento en móviles
            }}
            sx={{
              display: { xs: 'block', sm: 'none' }, // Muestra solo en móviles
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
            }}
          >
            {drawer} {/* Contenido del Drawer */}
          </Drawer>
        </Box>
        {/* Contenedor principal donde se renderizan las rutas */}
        <MainContainer>
          <Routes>
            {/* Ruta para la página principal */}
            <Route
              path="/"
              element={
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" component="h1" gutterBottom>
                    ¡Bienvenido a Gestión Educativa!
                  </Typography>
                  <Typography variant="h6" component="p" gutterBottom>
                    Elige una de las secciones a continuación:
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {/* Botones de navegación a las secciones */}
                    <NavButton variant="contained" color="primary" component={Link} to="/estudiantes">
                      Estudiantes
                    </NavButton>
                    <NavButton variant="contained" color="primary" component={Link} to="/cursos">
                      Cursos
                    </NavButton>
                    <NavButton variant="contained" color="primary" component={Link} to="/inscripciones">
                      Inscripciones
                    </NavButton>
                    <NavButton variant="contained" color="primary" component={Link} to="/profesores">
                      Profesores
                    </NavButton>
                  </Box>
                </Box>
              }
            />
            {/* Rutas para cada una de las secciones */}
            <Route path="/estudiantes" element={<Estudiantes />} />
            <Route path="/cursos" element={<Cursos />} />
            <Route path="/inscripciones" element={<Inscripciones />} />
            <Route path="/profesores" element={<Profesores />} />
          </Routes>
        </MainContainer>
      </Router>
    </ThemeProvider>
  );
}

export default App;
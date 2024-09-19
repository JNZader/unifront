import React, { useState, useEffect } from 'react';
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
import api from './api/api';

// Crear un tema personalizado para la aplicación
const theme = createTheme({
  palette: {
    mode: 'dark', // Establecer el modo de tema a oscuro
    primary: {
      main: '#1976d2', // Color primario
    },
    secondary: {
      main: '#4caf50', // Color secundario
    },
    background: {
      paper: '#303030', // Fondo oscuro para los componentes
      default: '#202020', // Fondo más oscuro para la aplicación
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif', // Fuente personalizada
  },
});

// Estilizar el contenedor principal de la aplicación
const MainContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4), // Margen superior
  marginBottom: theme.spacing(4), // Margen inferior
}));

// Estilizar los botones de navegación
const NavButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1), // Margen alrededor del botón
  '&:hover': {
    backgroundColor: theme.palette.primary.dark, // Color de fondo en hover
  },
}));

function App() {
  // Estado para controlar el Drawer en dispositivos móviles
  const [mobileOpen, setMobileOpen] = useState(false);
  // Verifica si la pantalla es móvil
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  // Estado para la conexión con la API
  const [isApiOnline, setIsApiOnline] = useState(false);

  // Función para alternar el estado del Drawer
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Función para verificar la conexión con la API
  const checkApiConnection = async () => {
    try {
      const response = await api.get('/cursos'); // Cambia la URL a tu endpoint de prueba
      if (response) {
        setIsApiOnline(true); // API disponible
      } else {
        setIsApiOnline(false); // API no disponible
      }
    } catch (error) {
      console.error('Error al verificar la conexión:', error);
      setIsApiOnline(false); // Error en la conexión
    }
  };

  // Hook para verificar la conexión a la API periódicamente
  useEffect(() => {
    checkApiConnection(); // Verifica inicialmente

    const intervalId = setInterval(checkApiConnection, 5000); // Verifica cada 5 segundos

    // Limpieza al desmontar el componente
    return () => clearInterval(intervalId);
  }, []);

  // Contenido del Drawer para navegación
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
      <CssBaseline />
      <Router basename={process.env.PUBLIC_URL}>
        <AppBar position="static">
          <Toolbar>
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
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                Gestión Educativa
              </Link>
            </Typography>

            {/* Botones de navegación en la barra, alineados a la derecha */}
            {!isMobile && (
              <Box>
                <NavButton color="inherit" component={Link} to="/estudiantes">
                  Estudiantes
                </NavButton>
                <NavButton color="inherit" component={Link} to="/cursos">
                  Cursos
                </NavButton>
                <NavButton color="inherit" component={Link} to="/inscripciones">
                  Inscripciones
                </NavButton>
                <NavButton color="inherit" component={Link} to="/profesores">
                  Profesores
                </NavButton>
              </Box>
            )}

            {/* Indicador de estado de conexión con la API */}
            <Box
              sx={{
                width: 21,
                height: 21,
                borderRadius: '50%',
                backgroundColor: isApiOnline ? 'green' : 'red', // Verde si está en línea, rojo si no
              }}
            />
          </Toolbar>
        </AppBar>

        {/* Contenedor para el Drawer en dispositivos móviles */}
        <Box component="nav">
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Mantiene el Drawer montado para mejorar el rendimiento en dispositivos móviles
            }}
            sx={{
              display: { xs: 'block', sm: 'none' }, // Mostrar solo en dispositivos móviles
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
            }}
          >
            {drawer}
          </Drawer>
        </Box>

        <MainContainer>
          <Routes>
            {/* Ruta principal */}
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
            {/* Rutas para cada sección */}
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
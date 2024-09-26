/**
 * Componente de gestión de profesores.
 * 
 * Este componente permite a los usuarios ver, agregar, editar y eliminar profesores
 * en una tabla. Los datos de los profesores se obtienen de una API y se muestran en 
 * un componente de tabla de Material-UI.
 * 
 * Estados del Componente:
 * - profesores: Array que contiene la lista de profesores cargados desde la API.
 * - editing: ID del profesor que se está editando; si es null, se está agregando un nuevo profesor.
 * - form: Objeto que contiene los campos del formulario para el profesor (DNI, nombre, apellido, email, profesión, teléfono).
 * - error: Mensaje de error que se muestra si hay un problema al guardar los datos del profesor.
 * - open: Booleano que indica si el diálogo de confirmación para eliminar un profesor está abierto.
 * - idEliminar: ID del profesor que se está eliminando.
 * - timeoutId: ID del temporizador para ocultar mensajes de error después de un tiempo.
 * 
 * Efectos:
 * - Al cargar el componente, se ejecuta useEffect para cargar la lista de profesores.
 * 
 * Funciones:
 * - loadProfesores: Función asincrónica que obtiene la lista de profesores de la API y actualiza el estado.
 * - handleChange: Actualiza el estado del formulario basado en la entrada del usuario y valida los datos ingresados.
 * - handleSubmit: Envía el formulario para agregar o editar un profesor; maneja errores en la operación.
 * - handleEdit: Prepara el formulario para editar un profesor existente.
 * - handleDelete: Abre el diálogo de confirmación para eliminar un profesor.
 * - eliminarProfesor: Función que se llama para eliminar un profesor después de la confirmación en el diálogo.
 * 
 * Renderizado:
 * - Muestra un formulario para ingresar datos del profesor, con campos validados.
 * - Muestra un botón para guardar o actualizar un profesor.
 * - Muestra una tabla con la lista de profesores, donde cada fila tiene botones para editar y eliminar.
 * - Un diálogo de confirmación se muestra al intentar eliminar un profesor.
 */

import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button as MuiButton,
  Grid,
  Typography
} from '@mui/material';
import api from '../api/api';

function Profesores() {
  const [profesores, setProfesores] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    dni: '',
    nombre: '',
    apellido: '',
    email: '',
    profesion: '',
    telefono: ''
  });
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [idEliminar, setIdEliminar] = useState(null);
  const [timeoutId, setTimeoutId] = useState(null);

  const [search, setSearch] = useState({
    dni: '',
    nombre: '',
    apellido: '',
    email: '',
    profesion: '',
    telefono: ''
  });

  useEffect(() => {
    loadProfesores();
  }, []);

  /**
 * Carga la lista de profesores desde la API y actualiza el estado.
 * Esta función se ejecuta cuando se monta el componente y cada vez que
 * se necesita refrescar la lista de profesores.
 *
 * @async
 * @function loadProfesores
 * @returns {Promise<void>} No devuelve nada.
 * @throws {Error} Si ocurre un error al realizar la solicitud a la API.
 */
  const loadProfesores = async () => {
    try {
      const response = await api.get('/profesores');
      setProfesores(response.data);
    } catch (error) {
      console.error('Error al cargar profesores:', error);
    }
  };
  /**
   * Maneja los cambios en los campos del formulario.
   * Actualiza el estado del formulario basado en la entrada del usuario.
   * Además, valida y formatea los datos según el tipo de campo.
   *
   * @function handleChange
   * @param {React.ChangeEvent<HTMLInputElement>} e - Evento de cambio del campo del formulario.
   * @returns {void} No devuelve nada.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    switch (name) {
      case 'dni':
        newValue = value.replace(/[^0-9]/g, '');
        newValue = newValue.substring(0, 8);
        break;
      case 'nombre':
      case 'profesion':
      case 'apellido':
        newValue = value.replace(/[^a-zA-Z\s]/g, '');
        break;
      case 'email':
        newValue = value.replace(/[^a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '');
        newValue = newValue.substring(0, 100);
        break;
      case 'telefono':
        newValue = value.replace(/[^0-9]/g, '');
        newValue = newValue.substring(0, 20);
        break;
      default:
        break;
    }

    setForm({
      ...form,
      [name]: newValue
    });
  };
  /**
   * Maneja la presentación del formulario para agregar o editar un profesor.
   * Envía los datos del formulario a la API y maneja los errores que puedan ocurrir.
   *
   * @async
   * @function handleSubmit
   * @param {React.FormEvent<HTMLFormElement>} e - Evento de envío del formulario.
   * @returns {Promise<void>} No devuelve nada.
   * @throws {Error} Si ocurre un error al enviar los datos a la API.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/profesores/${editing}`, form);
      } else {
        await api.post('/profesores', form);
      }
      loadProfesores();
      setForm({ dni: '', nombre: '', apellido: '', email: '', profesion: '', telefono: '' });
      setEditing(null);
      setError(null);
    } catch (error) {
      console.error('Error al guardar profesor:', error);
      setError('Error al guardar profesor. Verifica que los datos sean correctos.');
    }
  };
  /**
   * Prepara el formulario para editar un profesor existente.
   * Carga los datos del profesor en el formulario para su modificación.
   *
   * @function handleEdit
   * @param {Object} profesor - Objeto que contiene los datos del profesor a editar.
   * @returns {void} No devuelve nada.
   */
  const handleEdit = (profesor) => {
    setEditing(profesor.id);
    setForm(profesor);
  };
  /**
   * Abre el diálogo de confirmación para eliminar un profesor.
   * Almacena el ID del profesor que se va a eliminar.
   *
   * @function handleDelete
   * @param {number} id - ID del profesor a eliminar.
   * @returns {void} No devuelve nada.
   */
  const handleDelete = async (id) => {
    setIdEliminar(id);
    setOpen(true);
  };
  /**
   * Elimina un profesor después de la confirmación en el diálogo.
   * Realiza una solicitud a la API para eliminar el profesor y
   * actualiza la lista de profesores.
   *
   * @async
   * @function eliminarProfesor
   * @returns {Promise<void>} No devuelve nada.
   * @throws {Error} Si ocurre un error al realizar la eliminación.
   */
  const eliminarProfesor = async () => {
    try {
      await api.delete(`/profesores/${idEliminar}`);
      loadProfesores();
      setOpen(false);

      // Opcional: Muestra un mensaje de éxito
      setError("Profesor eliminado con éxito");
      clearTimeout(timeoutId);
      setTimeoutId(setTimeout(() => {
        setError(null);
      }, 3000));
    } catch (error) {
      console.error('Error al eliminar profesor:', error);

      // Muestra un mensaje de error al usuario
      setError("No se pudo eliminar el profesor: " + error.response?.data || "Error desconocido");
      setOpen(false);

      // Opcional: Resetea el mensaje de error después de 3 segundos
      clearTimeout(timeoutId);
      setTimeoutId(setTimeout(() => {
        setError(null);
      }, 3000));
    }
  };

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    switch (name) {
      case 'dni':
        // Eliminar caracteres no numéricos y limitar a 8 dígitos
        newValue = value.replace(/[^0-9]/g, '');
        newValue = newValue.substring(0, 8);
        break;
      case 'nombre':
      case 'profesion':
      case 'apellido':
        // Eliminar caracteres que no sean letras o espacios
        newValue = value.replace(/[^a-zA-Z\s]/g, '');
        break;
      case 'email':
        // Eliminar caracteres que no coincidan con un patrón básico de email y limitar a 100 caracteres
        newValue = value.replace(/[^a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '');
        newValue = newValue.substring(0, 100);
        break;
      case 'telefono':
        // Eliminar caracteres no numéricos y limitar a 20 dígitos
        newValue = value.replace(/[^0-9]/g, '');
        newValue = newValue.substring(0, 20);
        break;
      default:
        break;
    }

    // Actualizar el estado de búsqueda
    setSearch(prev => ({
      ...prev,
      [name]: newValue
    }));
  };


  const filteredProfesores = profesores.filter(profesor => {
    return (
      profesor.dni.toLowerCase().includes(search.dni.toLowerCase()) &&
      profesor.nombre.toLowerCase().includes(search.nombre.toLowerCase()) &&
      profesor.apellido.toLowerCase().includes(search.apellido.toLowerCase()) &&
      profesor.email.toLowerCase().includes(search.email.toLowerCase()) &&
      profesor.profesion.toLowerCase().includes(search.profesion.toLowerCase()) &&
      profesor.telefono.toLowerCase().includes(search.telefono.toLowerCase())
    );
  });


  return (
    <div>
      <Typography variant="h4" gutterBottom>Gestión de Profesores</Typography>

      {/* Muestra un mensaje de error si hay algún problema */}
      {error && (
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Búsqueda de Profesores</Typography>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Buscar por DNI"
              name="dni"
              value={search.dni}
              onChange={handleSearchChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Buscar por Nombre"
              name="nombre"
              value={search.nombre}
              onChange={handleSearchChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Buscar por Apellido"
              name="apellido"
              value={search.apellido}
              onChange={handleSearchChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Buscar por Email"
              name="email"
              value={search.email}
              onChange={handleSearchChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Buscar por Profesión"
              name="profesion"
              value={search.profesion}
              onChange={handleSearchChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Buscar por Teléfono"
              name="telefono"
              value={search.telefono}
              onChange={handleSearchChange}
              fullWidth
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Formulario para agregar o editar un profesor */}
      <Paper elevation={0} sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          {editing ? 'Editar Profesor' : 'Agregar Nuevo Profesor'}
        </Typography>
        <form onSubmit={handleSubmit}>
          {/* Campo para DNI */}
          <TextField
            label="DNI"
            name="dni"
            value={form.dni}
            onChange={handleChange}
            required
            margin="normal"
            fullWidth
            inputProps={{
              maxLength: 8, // Limita el máximo a 8 caracteres
              pattern: "[0-9]*" // Solo permite números
            }}
          />
          {/* Campo para Nombre */}
          <TextField
            label="Nombre"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            required
            margin="normal"
            fullWidth
            inputProps={{
              maxLength: 50 // Limita el máximo a 50 caracteres
            }}
          />
          {/* Campo para Apellido */}
          <TextField
            label="Apellido"
            name="apellido"
            value={form.apellido}
            onChange={handleChange}
            required
            margin="normal"
            fullWidth
            inputProps={{
              maxLength: 50 // Limita el máximo a 50 caracteres
            }}
          />
          {/* Campo para Email */}
          <TextField
            label="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            margin="normal"
            fullWidth
            type="email" // Establece el tipo como email
            inputProps={{
              maxLength: 254 // Limita el máximo a 254 caracteres
            }}
          />
          {/* Campo para Profesión */}
          <TextField
            label="Profesión"
            name="profesion"
            value={form.profesion}
            onChange={handleChange}
            required
            margin="normal"
            fullWidth
            inputProps={{
              maxLength: 50 // Limita el máximo a 50 caracteres
            }}
          />
          {/* Campo para Teléfono */}
          <TextField
            label="Teléfono"
            name="telefono"
            value={form.telefono}
            onChange={handleChange}
            required
            margin="normal"
            fullWidth
            inputProps={{
              maxLength: 20 // Limita el máximo a 20 caracteres
            }}
          />
          {/* Botón para guardar o actualizar el profesor */}
          <Button variant="contained" color="primary" type="submit" sx={{ mt: 2 }}>
            {editing ? 'Actualizar Profesor' : 'Guardar Profesor'}
          </Button>
          {/* Botón para cancelar la edición si se está editando */}
          {editing && (
            <Button variant="outlined" color="secondary" onClick={() => setEditing(null)} sx={{ mt: 2, ml: 2 }}>
              Cancelar
            </Button>
          )}
          {/* Mensaje de error si hay un problema */}
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </form>
      </Paper>

      {/* Tabla para mostrar la lista de profesores */}
      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>DNI</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Apellido</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Profesión</TableCell>
              <TableCell>Teléfono</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Mapeo de la lista de profesores para generar filas en la tabla */}
            {filteredProfesores.map(profesor => (
              <TableRow key={profesor.id}>
                <TableCell>{profesor.dni}</TableCell>
                <TableCell>{profesor.nombre}</TableCell>
                <TableCell>{profesor.apellido}</TableCell>
                <TableCell>{profesor.email}</TableCell>
                <TableCell>{profesor.profesion}</TableCell>
                <TableCell>{profesor.telefono}</TableCell>
                <TableCell>
                  {/* Botones para editar y eliminar un profesor */}
                  <Button color="warning" onClick={() => handleEdit(profesor)}>Editar</Button>
                  <Button color="error" onClick={() => handleDelete(profesor.id)}>Eliminar</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Diálogo de confirmación para eliminar un profesor */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Eliminar Profesor"}
        </DialogTitle>
        <DialogContent>
          <p>¿Estás seguro de eliminar al profesor?</p>
        </DialogContent>
        <DialogActions>
          {/* Botón para cancelar la eliminación */}
          <MuiButton onClick={() => setOpen(false)}>Cancelar</MuiButton>
          {/* Botón para confirmar la eliminación */}
          <MuiButton onClick={eliminarProfesor} color="error">Eliminar</MuiButton>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Profesores;
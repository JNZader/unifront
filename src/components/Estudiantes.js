/**
 * Componente de gestión de estudiantes.
 * 
 * Este componente permite a los usuarios ver, agregar, editar y eliminar estudiantes
 * en una tabla. Los datos de los estudiantes se obtienen de una API y se muestran en 
 * un componente de tabla de Material-UI.
 * 
 * Estados del Componente:
 * - estudiantes: Array que contiene la lista de estudiantes cargados desde la API.
 * - editing: ID del estudiante que se está editando; si es null, se está agregando un nuevo estudiante.
 * - form: Objeto que contiene los campos del formulario para el estudiante (DNI, nombre, apellido, email).
 * - error: Mensaje de error que se muestra si hay un problema al guardar los datos del estudiante.
 * - open: Booleano que indica si el diálogo de confirmación para eliminar un estudiante está abierto.
 * - idEliminar: ID del estudiante que se está eliminando.
 * 
 * Efectos:
 * - Al cargar el componente, se ejecuta useEffect para cargar la lista de estudiantes.
 * 
 * Funciones:
 * - loadEstudiantes: Función asincrónica que obtiene la lista de estudiantes de la API y actualiza el estado.
 * - handleChange: Actualiza el estado del formulario basado en la entrada del usuario y valida los datos ingresados.
 * - handleSubmit: Envía el formulario para agregar o editar un estudiante; maneja errores en la operación.
 * - handleEdit: Prepara el formulario para editar un estudiante existente.
 * - handleDelete: Abre el diálogo de confirmación para eliminar un estudiante.
 * - eliminarEstudiante: Función que se llama para eliminar un estudiante después de la confirmación en el diálogo.
 * 
 * Renderizado:
 * - Muestra un formulario para ingresar datos del estudiante, con campos validados.
 * - Muestra un botón para guardar o actualizar un estudiante.
 * - Muestra una tabla con la lista de estudiantes, donde cada fila tiene botones para editar y eliminar.
 * - Un diálogo de confirmación se muestra al intentar eliminar un estudiante.
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
  Button as MuiButton
} from '@mui/material';
import api from '../api/api';

function Estudiantes() {
  // Estado para almacenar la lista de estudiantes
  const [estudiantes, setEstudiantes] = useState([]);
  // Estado para identificar si se está editando un estudiante
  const [editing, setEditing] = useState(null);
  // Estado para manejar el formulario de estudiante
  const [form, setForm] = useState({
    dni: '',
    nombre: '',
    apellido: '',
    email: ''
  });
  // Estado para manejar mensajes de error
  const [error, setError] = useState(null);
  // Estado para controlar la apertura del diálogo de confirmación
  const [open, setOpen] = useState(false);
  // Estado para almacenar el ID del estudiante a eliminar
  const [idEliminar, setIdEliminar] = useState(null);

  // Carga la lista de estudiantes al montar el componente
  useEffect(() => {
    loadEstudiantes();
  }, []);

  /**
   * Carga la lista de estudiantes desde la API.
   * Maneja errores y actualiza el estado de estudiantes.
   * 
   * @async
   * @function loadEstudiantes
   * @returns {Promise<void>} 
   */
  const loadEstudiantes = async () => {
    try {
      const response = await api.get('/estudiantes');
      setEstudiantes(response.data);
    } catch (error) {
      console.error('Error al cargar estudiantes:', error);
      setError('Error al cargar estudiantes. Verifica la conexión.');
      setTimeout(() => setError(null), 5000); // Borra el error después de 5 segundos
    }
  };

  /**
   * Maneja los cambios en los campos del formulario.
   * Filtra los datos según el tipo de campo (DNI, nombre, apellido, email).
   * 
   * @param {Object} e - El evento del cambio en el campo del formulario
   * @function handleChange
   * @returns {void}
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    // Filtrado de entradas
    switch (name) {
      case 'dni':
        newValue = value.replace(/[^0-9]/g, '').substring(0, 8);
        break;
      case 'nombre':
      case 'apellido':
        newValue = value.replace(/[^a-zA-Z\s]/g, '').substring(0, 50);
        break;
      case 'email':
        newValue = value.replace(/[^a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '');
        newValue = newValue.substring(0, 100);
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
   * Maneja el envío del formulario para guardar o actualizar un estudiante.
   * 
   * @param {Object} e - El evento del envío del formulario
   * @function handleSubmit
   * @returns {Promise<void>} 
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/estudiantes/${editing}`, form);
      } else {
        await api.post('/estudiantes', form);
      }
      loadEstudiantes();
      setForm({ dni: '', nombre: '', apellido: '', email: '' });
      setEditing(null);
      setError(null);
    } catch (error) {
      console.error('Error al guardar estudiante:', error);
      setError('Error al guardar estudiante. Verifica que los datos sean correctos.');
      setTimeout(() => setError(null), 5000); // Borra el error después de 5 segundos
    }
  };

  /**
   * Maneja la acción de editar un estudiante.
   * 
   * @param {Object} estudiante - El estudiante a editar
   * @function handleEdit
   * @returns {void}
   */
  const handleEdit = (estudiante) => {
    setEditing(estudiante.id);
    setForm(estudiante);
  };

  /**
   * Maneja la acción de eliminar un estudiante.
   * 
   * @param {number} id - El ID del estudiante a eliminar
   * @function handleDelete
   * @returns {void}
   */
  const handleDelete = async (id) => {
    setIdEliminar(id);
    setOpen(true);
  };

  /**
   * Elimina un estudiante después de la confirmación.
   * 
   * @async
   * @function eliminarEstudiante
   * @returns {Promise<void>}
   */
  const eliminarEstudiante = async () => {
    try {
      await api.delete(`/estudiantes/${idEliminar}`);
      loadEstudiantes();
      setOpen(false);
      setError(null);
    } catch (error) {
      console.error('Error al eliminar estudiante:', error);
      setError('Error al eliminar estudiante. Verifica que el ID sea correcto.');
      setTimeout(() => setError(null), 5000); // Borra el error después de 5 segundos
      setOpen(false);
    }
  };

  return (
    <div>
      <h2>Gestión de Estudiantes</h2>
      {/* Formulario para agregar o editar estudiantes */}
      <form onSubmit={handleSubmit}>
        <TextField
          label="DNI"
          name="dni"
          value={form.dni}
          onChange={handleChange}
          required
          margin="normal"
          fullWidth
          inputProps={{
            maxLength: 8,
            pattern: "[0-9]*" // Asegura que solo se ingresen números
          }}
        />
        <TextField
          label="Nombre"
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          required
          margin="normal"
          fullWidth
          inputProps={{
            maxLength: 50 // Limita la longitud del nombre
          }}
        />
        <TextField
          label="Apellido"
          name="apellido"
          value={form.apellido}
          onChange={handleChange}
          required
          margin="normal"
          fullWidth
          inputProps={{
            maxLength: 50 // Limita la longitud del apellido
          }}
        />
        <TextField
          label="Email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          margin="normal"
          fullWidth
          type="email" // Establece el tipo de entrada como email
          inputProps={{
            maxLength: 254 // Limita la longitud del email
          }}
        />
        {/* Botón para enviar el formulario */}
        <Button variant="contained" color="primary" type="submit" sx={{ mt: 2 }}>
          {editing ? 'Actualizar Estudiante' : 'Guardar Estudiante'}
        </Button>
        {/* Botón para cancelar la edición */}
        {editing && (
          <Button variant="outlined" color="secondary" onClick={() => setEditing(null)} sx={{ mt: 2, ml: 2 }}>
            Cancelar
          </Button>
        )}
        {/* Mensaje de error si ocurre algún problema */}
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </form>
      {/* Tabla para mostrar la lista de estudiantes */}
      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>DNI</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Apellido</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {estudiantes.map(estudiante => (
              <TableRow key={estudiante.id}>
                <TableCell>{estudiante.dni}</TableCell>
                <TableCell>{estudiante.nombre}</TableCell>
                <TableCell>{estudiante.apellido}</TableCell>
                <TableCell>{estudiante.email}</TableCell>
                <TableCell>
                  {/* Botones para editar y eliminar estudiantes */}
                  <Button color="warning" onClick={() => handleEdit(estudiante)}>Editar</Button>
                  <Button color="error" onClick={() => handleDelete(estudiante.id)}>Eliminar</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Diálogo de confirmación para eliminar estudiante */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Eliminar Estudiante"}
        </DialogTitle>
        <DialogContent>
          <p>¿Estás seguro de eliminar al estudiante?</p>
        </DialogContent>
        <DialogActions>
          <MuiButton onClick={() => setOpen(false)}>Cancelar</MuiButton>
          <MuiButton onClick={eliminarEstudiante} color="error">Eliminar</MuiButton>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Estudiantes;

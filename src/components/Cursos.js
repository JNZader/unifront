/**
 * Componente de gestión de cursos.
 * 
 * Este componente permite a los usuarios ver, agregar, editar y eliminar cursos
 * en una tabla. Los datos de los cursos se obtienen de una API y se muestran en 
 * un componente de tabla de Material-UI.
 * 
 * Estados del Componente:
 * - cursos: Array que contiene la lista de cursos cargados desde la API.
 * - profesores: Array que contiene la lista de profesores cargados desde la API.
 * - editing: ID del curso que se está editando; si es null, se está agregando un nuevo curso.
 * - form: Objeto que contiene los campos del formulario para el curso (nombre, descripción, profesorId).
 * - error: Mensaje de error que se muestra si hay un problema al guardar los datos del curso.
 * - open: Booleano que indica si el diálogo de confirmación para eliminar un curso está abierto.
 * - idEliminar: ID del curso que se está eliminando.
 * - timeoutId: ID del temporizador para ocultar mensajes de error después de un tiempo.
 * 
 * Efectos:
 * - Al cargar el componente, se ejecuta useEffect para cargar la lista de cursos y profesores.
 * 
 * Funciones:
 * - loadCursos: Función asincrónica que obtiene la lista de cursos de la API y actualiza el estado.
 * - loadProfesores: Función asincrónica que obtiene la lista de profesores de la API y actualiza el estado.
 * - handleChange: Actualiza el estado del formulario basado en la entrada del usuario y valida los datos ingresados.
 * - handleSubmit: Envía el formulario para agregar o editar un curso; maneja errores en la operación.
 * - handleEdit: Prepara el formulario para editar un curso existente.
 * - handleDelete: Abre el diálogo de confirmación para eliminar un curso.
 * - eliminarCurso: Función que se llama para eliminar un curso después de la confirmación en el diálogo.
 * 
 * Renderizado:
 * - Muestra un formulario para ingresar datos del curso, con campos validados.
 * - Muestra un botón para guardar o actualizar un curso.
 * - Muestra una tabla con la lista de cursos, donde cada fila tiene botones para editar y eliminar.
 * - Un diálogo de confirmación se muestra al intentar eliminar un curso.
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
    MenuItem,
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

function Cursos() {
    // Estado inicial para manejar los cursos, profesores, el curso que se está editando, el formulario y posibles errores.
    const [cursos, setCursos] = useState([]);
    const [profesores, setProfesores] = useState([]);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({
        nombre: '',
        descripcion: '',
        profesorId: ''
    });
    // Estado para manejar mensajes de error
    const [error, setError] = useState(null);
    // Estado para controlar la apertura del diálogo de confirmación
    const [open, setOpen] = useState(false);
    // Estado para almacenar el ID del estudiante a eliminar
    const [idEliminar, setIdEliminar] = useState(null);

    const [timeoutId, setTimeoutId] = useState(null);

    const [search, setSearch] = useState({
        nombre: '',
        descripcion: '',
        profesorId: ''
    });



    /**
     * Carga la lista de cursos y profesores al montar el componente.
     * 
     * @async
     * @function useEffect
     * @returns {void}
     */
    useEffect(() => {
        loadCursos();
        loadProfesores();
    }, []);

    /**
     * Carga la lista de cursos desde la API.
     * 
     * @async
     * @function loadCursos
     * @returns {Promise<void>}
     */
    const loadCursos = async () => {
        try {
            const response = await api.get('/cursos');
            setCursos(response.data);
        } catch (error) {
            console.error('Error al cargar cursos:', error);
            setError('Error al cargar cursos. Verifica que los datos sean correctos.');
        }
    };

    /**
     * Carga la lista de profesores desde la API.
     * 
     * @async
     * @function loadProfesores
     * @returns {Promise<void>}
     */
    const loadProfesores = async () => {
        try {
            const response = await api.get('/profesores');
            setProfesores(response.data);
        } catch (error) {
            console.error('Error al cargar profesores:', error);
            setError('Error al cargar profesores. Verifica que los datos sean correctos.');
        }
    };

    /**
     * Maneja los cambios en los campos del formulario.
     * Aplica validaciones según el campo.
     * 
     * @param {Event} e - Evento de cambio en el formulario.
     * @function handleChange
     * @returns {void}
     */
    const handleChange = (e) => {
        const { name, value } = e.target;
        let newValue = value;

        switch (name) {
            case 'nombre':
                newValue = value.replace(/[^a-zA-Z\s]/g, ''); // Solo permite letras y espacios.
                newValue = value.substring(0, 50); // Limita la longitud a 50 caracteres.
                break;
            case 'descripcion':
                newValue = value.substring(0, 200); // Limita la longitud a 200 caracteres.
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
     * Maneja el envío del formulario.
     * Si se está editando, actualiza el curso; de lo contrario, crea uno nuevo.
     * 
     * @param {Event} e - Evento de envío del formulario.
     * @function handleSubmit
     * @returns {Promise<void>}
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editing) {
                await api.put(`/cursos/${editing}`, form); // Actualiza el curso existente.
            } else {
                await api.post('/cursos', form); // Crea un nuevo curso.
            }
            loadCursos(); // Recarga los cursos.
            setForm({ nombre: '', descripcion: '', profesorId: '' });
            setEditing(null); // Reinicia el modo de edición.
            setError(null); // Limpia los errores.
        } catch (error) {
            console.error('Error al guardar curso:', error);
            setError('Error al guardar curso. Verifica que los datos sean correctos.');
        }
    };

    /**
     * Configura el formulario para editar un curso seleccionado.
     * 
     * @param {Object} curso - El curso seleccionado para editar.
     * @function handleEdit
     * @returns {void}
     */
    const handleEdit = (curso) => {
        setEditing(curso.id); // Marca el ID del curso que se está editando.
        setForm({
            nombre: curso.nombre,
            descripcion: curso.descripcion,
            profesorId: curso.profesor ? curso.profesor.id : '', // Verifica si hay profesor asignado.
        });
    };

    /**
     * Maneja la acción de mostrar el diálogo de confirmación antes de eliminar un curso.
     * 
     * @param {number} id - ID del curso a eliminar.
     * @function handleDelete
     * @returns {void}
     */
    const handleDelete = (id) => {
        setIdEliminar(id);
        setOpen(true); // Abre el diálogo de confirmación.
    };

    /**
     * Elimina un curso después de la confirmación.
     * 
     * @async
     * @function eliminarCurso
     * @returns {Promise<void>}
     */
    const eliminarCurso = async () => {
        try {
            await api.delete(`/cursos/${idEliminar}`); // Elimina el curso
            loadCursos(); // Recarga los cursos después de la eliminación.
            setOpen(false); // Cierra el diálogo.

            // Muestra un mensaje de éxito
            setError('Curso eliminado con éxito'); // Mensaje de éxito
            clearTimeout(timeoutId); // Limpia el timeout anterior
            setTimeoutId(setTimeout(() => {
                setError(''); // Limpia el mensaje de error después de 5 segundos
            }, 5000));
        } catch (error) {
            // Manejo de error
            console.error('Error al eliminar curso:', error);
            setError('No se pudo eliminar el curso: ' + (error.response?.data || error.message)); // Mensaje de error
            setOpen(false); // Cierra el diálogo en caso de error

            // Opcional: Resetea el mensaje de error después de 5 segundos
            clearTimeout(timeoutId);
            setTimeoutId(setTimeout(() => {
                setError(''); // Limpia el mensaje de error después de 5 segundos
            }, 5000));
        }
    };

    const handleSearchChange = (e) => {
        const { name, value } = e.target;
        let newValue = value;

        switch (name) {
            case 'nombre':
                newValue = value.replace(/[^a-zA-Z\s]/g, ''); // Solo permite letras y espacios.
                newValue = newValue.substring(0, 50); // Limita la longitud a 50 caracteres.
                break;
            case 'descripcion':
                newValue = value.substring(0, 200); // Limita la longitud a 200 caracteres.
                break;
            default:
                break;
        }

        setSearch(prev => ({ ...prev, [name]: newValue }));
    };


    const filteredCursos = cursos.filter(curso => {
        return (
            curso.nombre.toLowerCase().includes(search.nombre.toLowerCase()) &&
            curso.descripcion.toLowerCase().includes(search.descripcion.toLowerCase()) &&
            (search.profesorId === '' || curso.profesor?.id.toString() === search.profesorId)
        );
    });


    return (
        <div>
            <Typography variant="h4" gutterBottom>Gestión de Cursos</Typography>
            {/* Muestra un mensaje de error si hay algún problema */}
            {error && (
                <Alert severity="error" onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}

            {/* Search Section */}
            <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6" gutterBottom>Búsqueda de Cursos</Typography>
                <Grid container spacing={2}>
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
                            label="Buscar por Descripción"
                            name="descripcion"
                            value={search.descripcion}
                            onChange={handleSearchChange}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            select
                            label="Buscar por Profesor"
                            name="profesorId"
                            value={search.profesorId}
                            onChange={handleSearchChange}
                            fullWidth
                        >
                            <MenuItem value="">Todos los profesores</MenuItem>
                            {profesores.map(profesor => (
                                <MenuItem key={profesor.id} value={profesor.id.toString()}>
                                    {profesor.nombre} {profesor.apellido}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                </Grid>
            </Paper>
            {/* Formulario para crear/editar cursos */}
            <Paper elevation={0} sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                    {editing ? 'Editar Curso' : 'Agregar Nuevo Curso'}
                </Typography>
                <form onSubmit={handleSubmit}>
                    {/* Campo de texto para ingresar el nombre del curso */}
                    <TextField
                        label="Nombre del Curso"
                        name="nombre"
                        value={form.nombre}
                        onChange={handleChange}
                        required
                        fullWidth
                        margin="normal" // Añade espacio alrededor del campo
                    />

                    {/* Campo de texto para ingresar la descripción del curso */}
                    <TextField
                        label="Descripción"
                        name="descripcion"
                        value={form.descripcion}
                        onChange={handleChange}
                        required
                        fullWidth
                        margin="normal"
                    />

                    {/* Selector desplegable para asignar un profesor al curso */}
                    <TextField
                        select
                        label="Profesor"
                        name="profesorId"
                        value={form.profesorId}
                        onChange={handleChange}
                        required
                        fullWidth
                        margin="normal"
                    >
                        {/* Muestra una lista de profesores como opciones dentro del menú desplegable */}
                        {profesores.map(profesor => (
                            <MenuItem key={profesor.id} value={profesor.id}>
                                {profesor.nombre} {profesor.apellido}
                            </MenuItem>
                        ))}
                    </TextField>

                    {/* Botón para guardar o actualizar el curso */}
                    <Button variant="contained" color="primary" type="submit">
                        {editing ? 'Actualizar Curso' : 'Guardar Curso'}
                    </Button>
                </form>
            </Paper>

            {/* Tabla de cursos */}
            <TableContainer component={Paper} style={{ marginTop: '20px' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {/* Encabezados de la tabla */}
                            <TableCell>Nombre</TableCell>
                            <TableCell>Descripción</TableCell>
                            <TableCell>Profesor</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {/* Itera sobre la lista de cursos y los muestra en la tabla */}
                        {filteredCursos.map(curso => (
                            <TableRow key={curso.id}>
                                <TableCell>{curso.nombre}</TableCell>
                                <TableCell>{curso.descripcion}</TableCell>
                                <TableCell>
                                    {curso.profesor ? `${curso.profesor.nombre} ${curso.profesor.apellido}` : 'Sin profesor asignado'}
                                </TableCell>
                                <TableCell>
                                    {/* Botón para editar el curso */}
                                    <Button color="warning" onClick={() => handleEdit(curso)}>
                                        Editar
                                    </Button>
                                    {/* Botón para eliminar el curso */}
                                    <Button color="error" onClick={() => handleDelete(curso.id)}>
                                        Eliminar
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Diálogo de confirmación para eliminar un curso */}
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Eliminar Curso</DialogTitle>
                <DialogContent>
                    <p>¿Estás seguro de eliminar el curso?</p>
                </DialogContent>
                <DialogActions>
                    {/* Botón para cancelar la eliminación */}
                    <MuiButton onClick={() => setOpen(false)}>Cancelar</MuiButton>
                    {/* Botón para confirmar y proceder con la eliminación */}
                    <MuiButton onClick={eliminarCurso} color="error">Eliminar</MuiButton>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default Cursos;
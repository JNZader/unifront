/**
 * Componente de gestión de inscripciones.
 * 
 * Este componente permite a los usuarios gestionar inscripciones de estudiantes en 
 * cursos. Ofrece funcionalidades para crear, editar y eliminar inscripciones, 
 * así como visualizar una lista de inscripciones existentes. Los datos se obtienen 
 * de una API y se muestran en una tabla utilizando componentes de Material-UI.
 * 
 * Estados del Componente:
 * - inscripciones: Array que contiene la lista de inscripciones cargadas desde la API.
 * - cursos: Array que contiene la lista de cursos disponibles.
 * - estudiantes: Array que contiene la lista de estudiantes disponibles.
 * - editing: ID de la inscripción que se está editando; si es null, se está creando una nueva inscripción.
 * - form: Objeto que contiene los campos del formulario para la inscripción 
 *   (cursoId, estudianteId, nota, fecha).
 * - open: Booleano que indica si el diálogo de confirmación para eliminar una 
 *   inscripción está abierto.
 * - idEliminar: ID de la inscripción que se está eliminando.
 * - error: Mensaje de error que se muestra si hay un problema al guardar o cargar 
 *   inscripciones.
 * - timeoutId: ID del temporizador para ocultar mensajes de error después de un tiempo.
 * 
 * Efectos:
 * - Al cargar el componente, se ejecuta useEffect para cargar la lista de inscripciones, 
 *   cursos y estudiantes desde la API.
 * - Se configura un efecto adicional para borrar el mensaje de error después de 3 segundos.
 * 
 * Funciones:
 * - loadInscripciones: Función asincrónica que obtiene la lista de inscripciones 
 *   de la API y actualiza el estado.
 * - loadCursos: Función asincrónica que obtiene la lista de cursos de la API 
 *   y actualiza el estado.
 * - loadEstudiantes: Función asincrónica que obtiene la lista de estudiantes de la API 
 *   y actualiza el estado.
 * - handleChange: Actualiza el estado del formulario basado en la entrada del usuario 
 *   y valida los datos ingresados, asegurándose de que la nota esté en el rango de 0 a 10.
 * - handleSubmit: Envía el formulario para agregar o editar una inscripción; maneja 
 *   errores en la operación.
 * - handleEdit: Prepara el formulario para editar una inscripción existente 
 *   estableciendo los valores del formulario con los datos de la inscripción seleccionada.
 * - handleDelete: Abre el diálogo de confirmación para eliminar una inscripción 
 *   estableciendo el ID de la inscripción a eliminar.
 * - eliminarInscripcion: Función que se llama para eliminar una inscripción después de 
 *   la confirmación en el diálogo.
 * 
 * Renderizado:
 * - Muestra un formulario para ingresar datos de la inscripción, con campos validados.
 * - Muestra un botón para guardar o actualizar la inscripción según el estado de edición.
 * - Muestra una tabla con la lista de inscripciones, donde cada fila tiene botones para 
 *   editar y eliminar inscripciones.
 * - Un diálogo de confirmación se muestra al intentar eliminar una inscripción.
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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button as MuiButton,
    Alert,
    Grid,
    Typography
} from '@mui/material';
import api from '../api/api';

function Inscripciones() {
    // Estado para la lista de inscripciones, cursos y estudiantes
    const [inscripciones, setInscripciones] = useState([]); // Lista de inscripciones
    const [cursos, setCursos] = useState([]); // Lista de cursos
    const [estudiantes, setEstudiantes] = useState([]); // Lista de estudiantes
    const [editing, setEditing] = useState(null); // ID de inscripción en modo edición
    const [form, setForm] = useState({
        cursoId: '',      // ID del curso
        estudianteId: '', // ID del estudiante
        nota: '',         // Nota de la inscripción
        fecha: ''        // Fecha de la inscripción
    }); // Datos del formulario

    const [search, setSearch] = useState({
        curso: '',
        estudiante: '',
        nota: ''
    });

    const [open, setOpen] = useState(false); // Estado para el diálogo de eliminación
    const [idEliminar, setIdEliminar] = useState(null); // ID de inscripción a eliminar
    const [error, setError] = useState(''); // Estado para manejar el error
    const [timeoutId, setTimeoutId] = useState(null); // ID del timer para el mensaje de error

    // Carga de datos inicial: inscripciones, cursos y estudiantes
    useEffect(() => {
        loadInscripciones();
        loadCursos();
        loadEstudiantes();
    }, []);

    // Efecto para borrar el mensaje de error después de un tiempo
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                setError('');
            }, 3000); // El mensaje se borra después de 3 segundos

            return () => clearTimeout(timer); // Limpia el timer si el componente se desmonta o si el error cambia
        }
    }, [error]);

    // Función para cargar inscripciones desde la API
    const loadInscripciones = async () => {
        try {
            const response = await api.get('/cursos-estudiantes'); // Llama a la API para obtener inscripciones
            setInscripciones(response.data); // Actualiza el estado con la lista de inscripciones
        } catch (error) {
            setError('Error al cargar inscripciones: ' + error.message); // Manejo de error
            console.error('Error al cargar inscripciones:', error);
        }
    };

    // Función para cargar cursos desde la API
    const loadCursos = async () => {
        try {
            const response = await api.get('/cursos'); // Llama a la API para obtener cursos
            setCursos(response.data); // Actualiza el estado con la lista de cursos
        } catch (error) {
            setError('Error al cargar cursos: ' + error.message); // Manejo de error
            console.error('Error al cargar cursos:', error);
        }
    };

    // Función para cargar estudiantes desde la API
    const loadEstudiantes = async () => {
        try {
            const response = await api.get('/estudiantes'); // Llama a la API para obtener estudiantes
            setEstudiantes(response.data); // Actualiza el estado con la lista de estudiantes
        } catch (error) {
            setError('Error al cargar estudiantes: ' + error.message); // Manejo de error
            console.error('Error al cargar estudiantes:', error);
        }
    };

    // Manejo de cambios en el formulario
    const handleChange = (e) => {
        const { name, value } = e.target;
        let newValue = value;

        // Filtrado de entradas
        switch (name) {
            case 'nota':
                // Eliminar caracteres no numéricos
                newValue = value.replace(/[^0-9]/g, '');
                // Limitar el valor a un rango del 0 al 10
                newValue = Math.max(0, Math.min(10, parseInt(newValue))) || ''; // Si newValue es NaN, se asigna una cadena vacía
                break;
            default:
                break;
        }

        setForm({
            ...form,
            [name]: newValue
        });
    };

    // Manejo del envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Verifica si está en modo edición o creación
            if (editing) {
                await api.put(`/cursos-estudiantes/${editing}`, form); // Actualiza la inscripción existente
            } else {
                await api.post('/cursos-estudiantes', form); // Crea una nueva inscripción
            }
            loadInscripciones(); // Recarga las inscripciones
            setForm({ cursoId: '', estudianteId: '', nota: '', fecha: '' }); // Reinicia el formulario
            setEditing(null); // Limpia el modo edición
            setError(''); // Limpia el error en caso de éxito
        } catch (error) {
            setError('Error al guardar inscripción: ' + error.message); // Manejo de error
            console.error('Error al guardar inscripción:', error);
        }
    };

    // Manejo de la edición de una inscripción
    const handleEdit = (inscripcion) => {
        setEditing(inscripcion.id); // Establece el ID de la inscripción a editar
        setForm({
            cursoId: inscripcion.curso.id, // Establece el ID del curso
            estudianteId: inscripcion.estudiante.id, // Establece el ID del estudiante
            nota: inscripcion.nota, // Establece la nota
            fecha: inscripcion.fecha.split('T')[0] // Establece la fecha en formato adecuado
        });
    };

    // Manejo de la solicitud de eliminación
    const handleDelete = (id) => {
        setIdEliminar(id); // Establece el ID de la inscripción a eliminar
        setOpen(true); // Abre el diálogo de confirmación
    };

    // Función para eliminar una inscripción
    const eliminarInscripcion = async () => {
        try {
            await api.delete(`/cursos-estudiantes/${idEliminar}`); // Elimina la inscripción
            loadInscripciones(); // Recarga las inscripciones
            setOpen(false); // Cierra el diálogo

            // Muestra un mensaje de éxito
            setError('Inscripción eliminada con éxito'); // Mensaje de éxito
            clearTimeout(timeoutId); // Limpia el timeout anterior
            setTimeoutId(setTimeout(() => {
                setError(''); // Limpia el mensaje de error después de 3 segundos
            }, 3000));
        } catch (error) {
            // Manejo de error
            setError('No se pudo eliminar la inscripción: ' + (error.response?.data || error.message));
            console.error('Error al eliminar inscripción:', error);
            setOpen(false); // Cierra el diálogo en caso de error

            // Opcional: Resetea el mensaje de error después de 3 segundos
            clearTimeout(timeoutId);
            setTimeoutId(setTimeout(() => {
                setError(''); // Limpia el mensaje de error después de 3 segundos
            }, 3000));
        }
    };

    // Handle search input changes
    const handleSearchChange = (e) => {
        const { name, value } = e.target;
        let newValue = value;

        // Filtrado de entradas según el campo
        switch (name) {
            case 'nota':
                // Eliminar caracteres no numéricos
                newValue = value.replace(/[^0-9]/g, '');
                // Limitar el valor a un rango del 0 al 10
                newValue = Math.max(0, Math.min(10, parseInt(newValue))) || ''; // Si newValue es NaN, se asigna una cadena vacía
                break;
            case 'curso':
            case 'estudiante':
                // Validación para nombre de curso y estudiante
                // Limitar a 50 caracteres
                newValue = value.replace(/[^a-zA-Z\s]/g, '').substring(0, 50);
                break;
            default:
                break;
        }

        // Actualizar el estado de la búsqueda
        setSearch(prev => ({
            ...prev,
            [name]: newValue
        }));
    };

    // Filter inscripciones based on search criteria
    const filteredInscripciones = inscripciones.filter(inscripcion => {
        return (
            (search.curso === '' || inscripcion.curso.nombre.toLowerCase().includes(search.curso.toLowerCase())) &&
            (search.estudiante === '' ||
                `${inscripcion.estudiante.nombre} ${inscripcion.estudiante.apellido}`
                    .toLowerCase()
                    .includes(search.estudiante.toLowerCase())) &&
            (search.nota === '' || inscripcion.nota.toString().includes(search.nota))
        );
    });


    return (
        <div>
            <Typography variant="h4" gutterBottom>Gestión de Inscripciones</Typography>
            {/* Muestra un mensaje de error si hay algún problema */}
            {error && (
                <Alert severity="error" onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}
            {/* campos de busqueda */}
            <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6" gutterBottom>Búsqueda de Inscripciones</Typography>

                <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            label="Buscar por Curso"
                            name="curso"
                            value={search.curso}
                            onChange={handleSearchChange}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            label="Buscar por Estudiante"
                            name="estudiante"
                            value={search.estudiante}
                            onChange={handleSearchChange}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            label="Buscar por Nota"
                            name="nota"
                            value={search.nota}
                            onChange={handleSearchChange}
                            fullWidth
                            type="number"
                            step="0.01"
                            inputProps={{
                                min: 0, // Valor mínimo
                                max: 10, // Valor máximo
                            }}
                        />
                    </Grid>
                </Grid>
            </Paper>

            {/* Formulario para gestionar inscripciones */}
            <Paper elevation={0} sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                    {editing ? 'Editar Inscripcion' : 'Agregar Nueva Inscripcion'}
                </Typography>
                <form onSubmit={handleSubmit}>
                    {/* Selección de curso */}
                    <TextField
                        select
                        label="Curso"
                        name="cursoId"
                        value={form.cursoId}
                        onChange={handleChange}
                        required
                        margin="normal"
                        fullWidth
                    >
                        {/* Mapea y muestra los cursos disponibles */}
                        {cursos.map((curso) => (
                            <MenuItem key={curso.id} value={curso.id}>
                                {curso.nombre}
                            </MenuItem>
                        ))}
                    </TextField>

                    {/* Selección de estudiante */}
                    <TextField
                        select
                        label="Estudiante"
                        name="estudianteId"
                        value={form.estudianteId}
                        onChange={handleChange}
                        required
                        margin="normal"
                        fullWidth
                    >
                        {/* Mapea y muestra los estudiantes disponibles */}
                        {estudiantes.map((estudiante) => (
                            <MenuItem key={estudiante.id} value={estudiante.id}>
                                {estudiante.nombre} {estudiante.apellido}
                            </MenuItem>
                        ))}
                    </TextField>

                    {/* Campo para ingresar la nota */}
                    <TextField
                        label="Nota"
                        name="nota"
                        value={form.nota}
                        onChange={handleChange}
                        required
                        margin="normal"
                        type="number"
                        step="0.01"
                        fullWidth
                        inputProps={{
                            min: 0, // Valor mínimo
                            max: 10, // Valor máximo
                        }}
                    />

                    {/* Campo para seleccionar la fecha */}
                    <TextField
                        label="Fecha"
                        name="fecha"
                        value={form.fecha}
                        onChange={handleChange}
                        required
                        margin="normal"
                        type="date"
                        fullWidth
                        InputLabelProps={{
                            shrink: true, // Mantiene la etiqueta arriba del campo
                        }}
                        inputProps={{
                            min: '2012-01-01', // Fecha mínima
                            max: '2032-12-31', // Fecha máxima
                            style: { padding: '10px' }, // Estilo del campo
                        }}
                    />

                    {/* Botón para guardar o actualizar la inscripción */}
                    <Button variant="contained" color="primary" type="submit" sx={{ mt: 2 }}>
                        {editing ? 'Actualizar Inscripción' : 'Guardar Inscripción'}
                    </Button>

                    {/* Botón para cancelar la edición si está en modo edición */}
                    {editing && (
                        <Button variant="outlined" color="secondary" onClick={() => setEditing(null)} sx={{ mt: 2, ml: 2 }}>
                            Cancelar
                        </Button>
                    )}
                </form>
            </Paper>
            {/* Tabla para mostrar las inscripciones */}
            <TableContainer component={Paper} sx={{ mt: 4 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Curso</TableCell>
                            <TableCell>Estudiante</TableCell>
                            <TableCell>Nota</TableCell>
                            <TableCell>Fecha</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {/* Mapea y muestra las inscripciones existentes */}
                        {filteredInscripciones.map(inscripcion => (
                            <TableRow key={inscripcion.id}>
                                <TableCell>{inscripcion.curso.nombre}</TableCell>
                                <TableCell>{inscripcion.estudiante.nombre} {inscripcion.estudiante.apellido}</TableCell>
                                <TableCell>{inscripcion.nota}</TableCell>
                                <TableCell>{inscripcion.fecha}</TableCell>
                                <TableCell>
                                    {/* Botón para editar la inscripción */}
                                    <Button color="warning" onClick={() => handleEdit(inscripcion)}>Editar</Button>
                                    {/* Botón para eliminar la inscripción */}
                                    <Button color="error" onClick={() => handleDelete(inscripcion.id)}>Eliminar</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Diálogo de confirmación para eliminar inscripción */}
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Eliminar Inscripción"}
                </DialogTitle>
                <DialogContent>
                    <p>¿Estás seguro de eliminar la inscripción?</p>
                </DialogContent>
                <DialogActions>
                    {/* Botón para cancelar la eliminación */}
                    <MuiButton onClick={() => setOpen(false)}>Cancelar</MuiButton>
                    {/* Botón para confirmar la eliminación */}
                    <MuiButton onClick={eliminarInscripcion} color="error">Eliminar</MuiButton>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default Inscripciones;
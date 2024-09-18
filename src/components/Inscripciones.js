// src/components/Inscripciones.js
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, MenuItem } from '@mui/material';
import api from '../api/api';

function Inscripciones() {
    const [inscripciones, setInscripciones] = useState([]);
    const [cursos, setCursos] = useState([]);
    const [estudiantes, setEstudiantes] = useState([]);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({
        cursoId: '',
        estudianteId: '',
        nota: '',
        fecha: ''
    });

    useEffect(() => {
        loadInscripciones();
        loadCursos();
        loadEstudiantes();
    }, []);

    const loadInscripciones = async () => {
        try {
            const response = await api.get('/cursos-estudiantes');
            console.log('Inscripciones:', response.data); // Agrega este log
            setInscripciones(response.data);
        } catch (error) {
            console.error('Error al cargar inscripciones:', error);
        }
    };

    const loadCursos = async () => {
        try {
            const response = await api.get('/cursos');
            console.log('Cursos:', response.data); // Agrega este log
            setCursos(response.data);
        } catch (error) {
            console.error('Error al cargar cursos:', error);
        }
    };

    const loadEstudiantes = async () => {
        try {
            const response = await api.get('/estudiantes');
            console.log('Estudiantes:', response.data); // Agrega este log
            setEstudiantes(response.data);
        } catch (error) {
            console.error('Error al cargar estudiantes:', error);
        }
    };


    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          if (editing) {
            await api.put(`/cursos-estudiantes/${editing}`, form);
          } else {
            console.log('Enviando datos:', form); // Agrega este log para verificar los datos enviados
            await api.post('/cursos-estudiantes', form);
          }
          loadInscripciones();
          setForm({ cursoId: '', estudianteId: '', nota: '', fecha: '' });
          setEditing(null);
        } catch (error) {
          console.error('Error al guardar inscripción:', error);
        }
      };
      

      const handleEdit = async (inscripcion) => {
        setEditing(inscripcion.id);
        setForm({
            cursoId: inscripcion.curso.id, // Asegúrate de que `curso.id` es el identificador correcto
            estudianteId: inscripcion.estudiante.id, // Asegúrate de que `estudiante.id` es el identificador correcto
            nota: inscripcion.nota,
            fecha: inscripcion.fecha.split('T')[0] // Formato para el campo de fecha
        });
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/cursos-estudiantes/${id}`);
            loadInscripciones();
        } catch (error) {
            console.error('Error al eliminar inscripción:', error);
        }
    };

    return (
        <div>
            <h2>Gestión de Inscripciones</h2>
            <form onSubmit={handleSubmit}>
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
                    {cursos.map((curso) => (
                        <MenuItem key={curso.id} value={curso.id}>
                            {curso.nombre}
                        </MenuItem>
                    ))}
                </TextField>
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
                    {estudiantes.map((estudiante) => (
                        <MenuItem key={estudiante.id} value={estudiante.id}>
                            {estudiante.nombre} {estudiante.apellido}
                        </MenuItem>
                    ))}
                </TextField>
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
                />
                <TextField
                    label="Fecha"
                    name="fecha"
                    value={form.fecha}
                    onChange={handleChange}
                    required
                    margin="normal"
                    type="date"
                    fullWidth
                />
                <Button variant="contained" color="primary" type="submit" sx={{ mt: 2 }}>
                    {editing ? 'Actualizar Inscripción' : 'Guardar Inscripción'}
                </Button>
                {editing && (
                    <Button variant="outlined" color="secondary" onClick={() => setEditing(null)} sx={{ mt: 2, ml: 2 }}>
                        Cancelar
                    </Button>
                )}
            </form>
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
                        {inscripciones.map(inscripcion => (
                            <TableRow key={inscripcion.id}>
                                <TableCell>{inscripcion.curso.nombre}</TableCell>
                                <TableCell>{inscripcion.estudiante.nombre} {inscripcion.estudiante.apellido}</TableCell>
                                <TableCell>{inscripcion.nota}</TableCell>
                                <TableCell>{inscripcion.fecha}</TableCell>
                                <TableCell>
                                    <Button color="warning" onClick={() => handleEdit(inscripcion)}>Editar</Button>
                                    <Button color="error" onClick={() => handleDelete(inscripcion.id)}>Eliminar</Button>
                                </TableCell>
                            </TableRow>
                        ))}

                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}

export default Inscripciones;

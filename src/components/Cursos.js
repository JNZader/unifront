// src/components/Cursos.js
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, MenuItem } from '@mui/material';
import api from '../api/api';

function Cursos() {
    const [cursos, setCursos] = useState([]);
    const [profesores, setProfesores] = useState([]);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({
        nombre: '',
        descripcion: '',
        profesorId: ''
    });

    useEffect(() => {
        loadCursos();
        loadProfesores();
    }, []);

    const loadCursos = async () => {
        try {
            const response = await api.get('/cursos');
            setCursos(response.data);
        } catch (error) {
            console.error('Error al cargar cursos:', error);
        }
    };

    const loadProfesores = async () => {
        try {
            const response = await api.get('/profesores');
            setProfesores(response.data);
        } catch (error) {
            console.error('Error al cargar profesores:', error);
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
                await api.put(`/cursos/${editing}`, form);
            } else {
                await api.post('/cursos', form);
            }
            loadCursos();
            setForm({ nombre: '', descripcion: '', profesorId: '' });
            setEditing(null);
        } catch (error) {
            console.error('Error al guardar curso:', error);
        }
    };

    const handleEdit = (curso) => {
        setEditing(curso.id);
        setForm(curso);
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/cursos/${id}`);
            loadCursos();
        } catch (error) {
            console.error('Error al eliminar curso:', error);
        }
    };

    return (
        <div>
            <h2>Gestión de Cursos</h2>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Nombre del Curso"
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    required
                    margin="normal"
                    fullWidth
                />
                <TextField
                    label="Descripción"
                    name="descripcion"
                    value={form.descripcion}
                    onChange={handleChange}
                    required
                    margin="normal"
                    fullWidth
                />
                <TextField
                    select
                    label="Profesor"
                    name="profesorId"
                    value={form.profesorId}
                    onChange={handleChange}
                    required
                    margin="normal"
                    fullWidth
                >
                    {profesores.map((profesor) => (
                        <MenuItem key={profesor.id} value={profesor.id}>
                            {profesor.nombre} {profesor.apellido}
                        </MenuItem>
                    ))}
                </TextField>
                <Button variant="contained" color="primary" type="submit" sx={{ mt: 2 }}>
                    {editing ? 'Actualizar Curso' : 'Guardar Curso'}
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
                            <TableCell>Nombre</TableCell>
                            <TableCell>Descripción</TableCell>
                            <TableCell>Profesor</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {cursos.map(curso => (
                            <TableRow key={curso.id}>
                                <TableCell>{curso.nombre}</TableCell>
                                <TableCell>{curso.descripcion}</TableCell>
                                {/* Verificar si profesor existe antes de acceder a su propiedad nombre */}
                                <TableCell>{curso.profesor ? `${curso.profesor.nombre} ${curso.profesor.apellido}` : 'Sin profesor asignado'}
                                </TableCell>
                                <TableCell>
                                    <Button color="warning" onClick={() => handleEdit(curso)}>Editar</Button>
                                    <Button color="error" onClick={() => handleDelete(curso.id)}>Eliminar</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}

export default Cursos;

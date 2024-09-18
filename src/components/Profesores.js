// src/components/Profesores.js
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField } from '@mui/material';
import api from '../api/api';

function Profesores() {
  const [profesores, setProfesores] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    dni: '',
    nombre: '',
    apellido: '',
    email: ''
  });

  useEffect(() => {
    loadProfesores();
  }, []);

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
        await api.put(`/profesores/${editing}`, form);
      } else {
        await api.post('/profesores', form);
      }
      loadProfesores();
      setForm({ dni: '', nombre: '', apellido: '', email: '' });
      setEditing(null);
    } catch (error) {
      console.error('Error al guardar profesor:', error);
    }
  };

  const handleEdit = (profesor) => {
    setEditing(profesor.id);
    setForm(profesor);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/profesores/${id}`);
      loadProfesores();
    } catch (error) {
      console.error('Error al eliminar profesor:', error);
    }
  };

  return (
    <div>
      <h2>Gestión de Profesores</h2>
      <form onSubmit={handleSubmit}>
        <TextField
          label="DNI"
          name="dni"
          value={form.dni}
          onChange={handleChange}
          required
          margin="normal"
          fullWidth
        />
        <TextField
          label="Nombre"
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          required
          margin="normal"
          fullWidth
        />
        <TextField
          label="Apellido"
          name="apellido"
          value={form.apellido}
          onChange={handleChange}
          required
          margin="normal"
          fullWidth
        />
        <TextField
          label="Email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          margin="normal"
          fullWidth
        />
        <Button variant="contained" color="primary" type="submit" sx={{ mt: 2 }}>
          {editing ? 'Actualizar Profesor' : 'Guardar Profesor'}
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
              <TableCell>DNI</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Apellido</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {profesores.map(profesor => (
              <TableRow key={profesor.id}>
                <TableCell>{profesor.dni}</TableCell>
                <TableCell>{profesor.nombre}</TableCell>
                <TableCell>{profesor.apellido}</TableCell>
                <TableCell>{profesor.email}</TableCell>
                <TableCell>
                  <Button color="warning" onClick={() => handleEdit(profesor)}>Editar</Button>
                  <Button color="error" onClick={() => handleDelete(profesor.id)}>Eliminar</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default Profesores;

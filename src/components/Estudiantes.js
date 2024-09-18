// src/components/Estudiantes.js
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField } from '@mui/material';
import api from '../api/api';

function Estudiantes() {
  const [estudiantes, setEstudiantes] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    dni: '',
    nombre: '',
    apellido: '',
    email: ''
  });

  useEffect(() => {
    loadEstudiantes();
  }, []);

  const loadEstudiantes = async () => {
    try {
      const response = await api.get('/estudiantes');
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
        await api.put(`/estudiantes/${editing}`, form);
      } else {
        await api.post('/estudiantes', form);
      }
      loadEstudiantes();
      setForm({ dni: '', nombre: '', apellido: '', email: '' });
      setEditing(null);
    } catch (error) {
      console.error('Error al guardar estudiante:', error);
    }
  };

  const handleEdit = (estudiante) => {
    setEditing(estudiante.id);
    setForm(estudiante);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/estudiantes/${id}`);
      loadEstudiantes();
    } catch (error) {
      console.error('Error al eliminar estudiante:', error);
    }
  };

  return (
    <div>
      <h2>Gestión de Estudiantes</h2>
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
          {editing ? 'Actualizar Estudiante' : 'Guardar Estudiante'}
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
            {estudiantes.map(estudiante => (
              <TableRow key={estudiante.id}>
                <TableCell>{estudiante.dni}</TableCell>
                <TableCell>{estudiante.nombre}</TableCell>
                <TableCell>{estudiante.apellido}</TableCell>
                <TableCell>{estudiante.email}</TableCell>
                <TableCell>
                  <Button color="warning" onClick={() => handleEdit(estudiante)}>Editar</Button>
                  <Button color="error" onClick={() => handleDelete(estudiante.id)}>Eliminar</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default Estudiantes;

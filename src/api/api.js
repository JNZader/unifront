/**
 * Importa la biblioteca Axios para realizar solicitudes HTTP.
 */
import axios from 'axios';

/**
 * Crea una instancia de Axios con la configuración de base URL.
 * 
 * @param {string} baseURL - La URL base para realizar solicitudes HTTP.
 * 
 * @returns {object} La instancia de Axios configurada.
 */
const api = axios.create({
  /**
   * La URL base para realizar solicitudes HTTP.
   * 
   * @type {string}
   */
  baseURL: 'https://tpuniv.onrender.com/', 
});

/**
 * Exporta la instancia de Axios configurada.
 * 
 * @type {object}
 */
export default api;
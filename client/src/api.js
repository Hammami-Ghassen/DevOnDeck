import axios from 'axios';
// URL de base de notre API simulée
const API_URL = 'http://localhost:5000/developers';

// Récupérer tous les développeurs
export const getDevelopers = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des développeurs:', error);
    throw error;
  }
};

// Mettre à jour un développeur
export const updateDeveloper = async (id, updatedData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, updatedData);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la mise à jour:', error);
    throw error;
  }
};

// Supprimer un développeur
export const deleteDeveloper = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error('Erreur lors de la suppression:', error);
    throw error;
  }
};
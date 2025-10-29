const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
export const apiService = {
  async register(userData) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      success: true,
      token: 'simulated_jwt_token_' + Date.now(),
      user: {
        id: 'user_' + Date.now(),
        name: userData.name,
        email: userData.email,
        userType: userData.userType
      }
    };
  },

  async login(credentials) {
    await new Promise(resolve => setTimeout(resolve, 1000));
        return {
      success: true,
      token: 'simulated_jwt_token_' + Date.now(),
      user: {
        id: 'user_123',
        name: 'Utilisateur Test',
        email: credentials.email,
        userType: 'developer'
      }
    };
  },

  async updateDeveloperProfile(profileData, token) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true, message: 'Profil mis à jour avec succès' };
  },

  async createJob(jobData, token) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true, message: 'Offre créée avec succès' };
  }
};
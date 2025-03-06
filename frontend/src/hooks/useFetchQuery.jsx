/* eslint-disable react-refresh/only-export-components */
import axios from "axios";
import { useState } from 'react';

const baseUrl = "http://localhost:8000/";

const api = axios.create({
  baseURL: baseUrl,
});

const auth = axios.create({
  baseURL: baseUrl,
});

//it's work is just to set tokens in the local storage
export const setTokens = (accessToken, refreshToken) => {
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
};

//it's work is just to remove tokens from the local storage
export const removeTokens = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};

// check if the token is valid
export const checkTokenIsValid = async () => {
  if (!getAccessToken()) {
    return false;
  }
  const res = await auth.post("auth/jwt/verify/", { token: getAccessToken() });
  return res.data.code === "token_not_valid" ? false : true;
};

// intercept request and modify headers
api.interceptors.request.use(
  async (config) => {
    const accessToken = getAccessToken();
    if (!accessToken) {
      redirectToLogin();
      return;
    }
    if (accessToken) {
      config.headers["Authorization"] = "JWT " + accessToken;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// response interceptors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 401) {
      redirectToLogin();
      return;
      // handle error: inform user, go to login, etc
    } else {
      return Promise.reject(error);
    }
  }
);

//get my data incase there is a refresh
export const whoami = async () => {
  const response = await api.get("auth/users/me/");
  return response.data;
};

// user activation endpoint or activation resend endpoint
export const ActivateUser = async (c) => {
  // console.log(c);
  const res = await auth.post("auth/users/activation/", c);

  return res.data;
};

// login handler
export const GET_AUTH = async (credentials) => {
  const response = await auth.post("auth/jwt/create/", credentials);
  if (response.data) {
      localStorage.removeItem('history');
  }

  return response.data;
};

// Register handler
export const CREATE_NEW_USER = async (credentials) => {
  // Check if token needs refreshing before making the request
  const response = await auth.post("auth/users/", credentials);
  return response.data;
};
// Password reset handler
export const RESET_PASSWORD = async (data) => {
  const response = await auth.post("auth/users/reset_password_confirm/", data);
  return response.data;
};

//RESET USER PASSWORD sending only the email the rest is in the email
export const RESET_USER_PASSWORD = async (email) => {
  const response = await auth.post(`auth/users/reset_password/`, email);
  return response.data;
};
// redirect to login
export const redirectToLogin = () => {
  // Implement your logic to redirect to the login page
  window.location.href = "/";
};

// get access token
export const getAccessToken = () => {
  return localStorage.getItem("accessToken");
};

export const logout = () => {
  removeTokens();
  redirectToLogin();
};

export const UPDATE_PROFILE = async (formData) => {
  try {
    const accessToken = getAccessToken();
    if (!accessToken) {
      throw new Error("Token d'accès manquant");
    }
    const response = await api.patch(
      "app/user/update/",
      formData,
      {
        headers: {
          'Authorization': `Token ${accessToken}`,
          'Content-Type': 'multipart/form-data' 
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error);
    throw error;
  }
};

export const getCategories = async () => {
  try {
    const response = await axios.get(`${baseUrl}app/categories`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des catégories", error);
    throw error;
  }
}

export const getSousCategories = async () => {
  try {
    const response = await axios.get(`${baseUrl}app/souscategories`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des sous catégories", error);
    throw error;
  }
}

export const getDocumentsBySousCategory = async (sousCategoryId) => {
  try {
    const response = await axios.get(`${baseUrl}app/documents/sous_category/${sousCategoryId}/`);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération des documents pour la sous-catégorie ${sousCategoryId}`, error);
    throw error;
  }
};

export const getDocumentsByBranche = async (brancheId, id) => {
  try {
    const response = await axios.get(`${baseUrl}app/documents/sous_category/${id}/branche/${brancheId}/`);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération des documents par branche ${brancheId}`, error);
    throw error;
  }
};

export const getBookDetails = async (id) => {
  try {
    const response = await axios.get(`${baseUrl}app/documents/${id}/`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des détails du livre", error);
    throw error;
  }
};

export const getDocumentsByCategory = async (categoryId) => {
  try {
    const response = await axios.get(`${baseUrl}app/documents/category/${categoryId}/`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des documents par catégorie", error);
    throw error;
  }
};

export const getBranchesBySousCategory = async (id) => {
  try {
    const response = await axios.get(`${baseUrl}app/branches/souscategories/${id}/`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des branches par sous catégories", error);
    throw error;
  }
};

export const createComment = async (bookId, commentData) => {
  const accessToken = getAccessToken();

  if (!accessToken) {
    throw new Error("Token d'accès manquant");
  }

  try {
    const response = await axios.post(
      `${baseUrl}app/comment/${bookId}/`, 
      commentData, 
      {
        headers: {
          'Authorization': `JWT ${accessToken}`,
          'Content-Type': 'application/json',
        }
      }
    );

    console.log(response);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.error('Utilisateur non autorisé. Veuillez vérifier votre connexion.');
    } else if (error.response && error.response.status === 400) {
      console.error('Données invalides ou erreur serveur.');
    } else {
      console.error('Erreur lors de la création ou mise à jour du commentaire:', error);
    }
    throw error;
  }
};


export const getAllComments = async (bookId) => {
  try {
    if (!bookId) {
      throw new Error("L'ID du document est requis.");
    }

    const response = await axios.get(`${baseUrl}app/comments/${bookId}/`);
    console.log(response.data); 
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des commentaires", error);
    throw error;
  }
};

export const addToHistory = async (documentId) => {
  const isValidToken = await checkTokenIsValid();
  if (!isValidToken) {
    // Check for local storage support
    if (typeof(Storage) === "undefined") {
      throw new Error('Local storage is not supported by this browser.');
    }

    let history = JSON.parse(localStorage.getItem('history')) || [];

    if (!history.includes(documentId)) {
      history.push(documentId);
      localStorage.setItem('history', JSON.stringify(history));
    }
    return { detail: 'Document ajouté à l\'historique local.' };
  }

  try {
    const response = await api.post("app/history/", { document_id: documentId });
    return response.data; 
  } catch (error) {
    throw new Error(`Erreur lors de l'enregistrement de l'historique: ${error.response?.data?.detail || error.message}`);
  }
};

export const getHistory = async () => {
  const isValidToken = await checkTokenIsValid();
  if (!isValidToken) {
    // Check for local storage support
    if (typeof(Storage) === "undefined") {
      throw new Error('Local storage is not supported by this browser.');
    }
    return JSON.parse(localStorage.getItem('history')) || [];
  }

  try {
    const response = await api.get("app/history/");
    return response.data; 
  } catch (error) {
    throw new Error(`Erreur lors de la récupération de l'historique: ${error.response?.data?.detail || error.message}`);
  }
};

export const deleteHistory = async (historyId) => {
  const isValidToken = await checkTokenIsValid();
  
  if (!isValidToken) {
    // Suppression de l'élément de l'historique dans le local storage
    let history = JSON.parse(localStorage.getItem('history')) || [];
    history = history.filter(id => id !== historyId);
    localStorage.setItem('history', JSON.stringify(history));
    return { detail: 'Document supprimé de l\'historique local.' };
  }

  try {
    const response = await api.delete(`app/history/${historyId}/`);
    return response.data; // Renvoie les données de la réponse
  } catch (error) {
    throw new Error(`Erreur lors de la suppression de l'historique: ${error.response?.data?.detail || error.message}`);
  }
};


export const deleteAllHistory = async () => {
  const isValidToken = await checkTokenIsValid();
  
  if (!isValidToken) {
    // Suppression de tous les éléments de l'historique dans le local storage
    localStorage.removeItem('history');
    return { detail: 'Tout l\'historique local a été supprimé.' };
  }

  try {
    const response = await api.delete("app/history/delete");
    return response.data; // Renvoie les données de la réponse
  } catch (error) {
    throw new Error(`Erreur lors de la suppression de tout l'historique: ${error.response?.data?.detail || error.message}`);
  }
};


// Get all favorites
export const getFavorites = async () => {
  const accessToken = getAccessToken();
  if (!accessToken) {
    throw new Error("Token d'accès manquant");
  }

  try {
    const response = await api.get("app/favorites/", {
      headers: {
        Authorization: `Token ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data; // Ensure this returns the expected structure
  } catch (error) {
    console.error("Erreur lors de la récupération des favoris", error);
    throw error;
  }
};


// Add a favorite
export const addFavorite = async (documentId) => {
  const accessToken = getAccessToken();
  if (!accessToken) {
    throw new Error("Token d'accès manquant");
  }

  try {
    const response = await api.post("app/favorites/", { document: documentId }, {
      headers: {
        Authorization: `Token ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'ajout aux favoris", error);
    throw error;
  }
};

// Delete a favorite by ID
export const deleteFavorite = async (favoriteId) => {
  const accessToken = getAccessToken();
  if (!accessToken) {
    throw new Error("Token d'accès manquant");
  }

  try {
    await api.delete(`app/favorites/${favoriteId}/`, {
      headers: {
        Authorization: `Token ${accessToken}`,
      },
    });
  } catch (error) {
    console.error("Erreur lors de la suppression des favoris", error);
    throw error;
  }
};

// Delete a favorite by ID
export const deleteClasseurBook = async (classeurBookId) => {
  const accessToken = getAccessToken();
  if (!accessToken) {
    throw new Error("Token d'accès manquant");
  }

  try {
    await api.delete(`app/classeurbook/${classeurBookId}/`, {
      headers: {
        Authorization: `Token ${accessToken}`,
      },
    });
  } catch (error) {
    console.error("Erreur lors de la suppression du classeur", error);
    throw error;
  }
};

// Delete all favorites
export const deleteAllFavorites = async () => {
  const accessToken = getAccessToken();
  if (!accessToken) {
    throw new Error("Token d'accès manquant");
  }

  try {
    await api.delete("app/favorites/delete_all/", {
      headers: {
        Authorization: `Token ${accessToken}`,
      },
    });
  } catch (error) {
    console.error("Erreur lors de la suppression de tous les favoris", error);
    throw error;
  }
};

// Delete all favorites
export const deleteAllClasseurBook = async () => {
  const accessToken = getAccessToken();
  if (!accessToken) {
    throw new Error("Token d'accès manquant");
  }

  try {
    await api.delete("app/classeurbook/delete_all/", {
      headers: {
        Authorization: `Token ${accessToken}`,
      },
    });
  } catch (error) {
    console.error("Erreur lors de la suppression de tous les documents", error);
    throw error;
  }
};

export const addClasseur = async (classeurData) => {
  const accessToken = getAccessToken();
  if (!accessToken) {
    throw new Error("Token d'accès manquant");
  }

  try {
    const response = await api.post("app/classeur/", classeurData, {
      headers: {
        Authorization: `Token ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'ajout du classeur", error);
    throw error;
  }
};

export const getClasseur = async () => {
  const accessToken = getAccessToken();
  if (!accessToken) {
    throw new Error("Token d'accès manquant");
  }

  try {
    const response = await api.get("app/classeur/", {
      headers: {
        Authorization: `Token ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data; // Ensure this returns the expected structure
  } catch (error) {
    console.error("Erreur lors de la récupération des classeurs", error);
    throw error;
  }
}

export const deleteClasseur = async (classeurId) => {
  const accessToken = getAccessToken();
  if (!accessToken) {
    throw new Error("Token d'accès manquant");
  }

  try {
    await api.delete(`app/classeur/${classeurId}/`, {
      headers: {
        Authorization: `Token ${accessToken}`,
      },
    });
  } catch (error) {
    console.error("Erreur lors de la suppression du classeur", error);
    throw error;
  }
};

export const addDocumentToClasseur = async (classeurId, bookId) => {
  const accessToken = getAccessToken();
  if (!accessToken) {
    throw new Error("Token d'accès manquant");
  }

  try {
    const response = await api.post("app/classeurbook/", { classeur_id: classeurId, book_id: bookId }, {
      headers: {
        Authorization: `Token ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
    
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Erreur lors de l'ajout du document au classeur:", error.response.data);
      throw new Error(error.response.data.error || "Erreur lors de l'ajout du document");
    } else if (error.request) {
      console.error("Aucune réponse reçue du serveur:", error.request);
      throw new Error("Erreur de connexion au serveur");
    } else {
      console.error("Erreur dans la configuration de la requête:", error.message);
      throw new Error("Erreur inconnue lors de l'ajout du document");
    }
  }
};

export const getDocumentsByClasseurId = async (classeurId) => {
  const response = await api.get(`app/classeurbook/${classeurId}/documents`);
  return response.data;
};

export const fetchSearchResults = async (query) => {
  try {
    const response = await fetch(`${baseUrl}app/search/?search=${encodeURIComponent(query)}`);
    if (!response.ok) {
      const errorMessage = await response.text(); // Récupérez le message d'erreur
      console.error('Error response:', errorMessage);
      throw new Error('Une erreur est survenue lors de la récupération des résultats.');
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return { books: [], categories: [], sous_categories: [] }; // Retourner un objet vide en cas d'erreur
  }
};

export const subscribeToNewsletter = async (email) => {
  try {
    const response = await api.post('app/newsletter/signup/', { email }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 201) {
      return { success: true, message: 'Merci de vous etre abonné à notre newsletter.' };
    } else {
      return { success: false, message: response.data?.detail || 'Une erreur s\'est produite.' };
    }
  } catch (error) {
    return { success: false, message: error.response?.data?.detail || 'Une erreur réseau s\'est produite.' };
  }
};





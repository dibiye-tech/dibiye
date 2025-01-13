import {createContext, useState, useEffect} from "react";
import swal from 'sweetalert2';
import { useNavigate} from "react-router-dom";

var InvalidTokenError = class extends Error {
};
InvalidTokenError.prototype.name = "InvalidTokenError";
function b64DecodeUnicode(str) {
  return decodeURIComponent(atob(str).replace(/(.)/g, (m, p) => {
    let code = p.charCodeAt(0).toString(16).toUpperCase();
    if (code.length < 2) {
      code = "0" + code;
    }
    return "%" + code;
  }));
}
function base64UrlDecode(str) {
  let output = str.replace(/-/g, "+").replace(/_/g, "/");
  switch (output.length % 4) {
    case 0:
      break;
    case 2:
      output += "==";
      break;
    case 3:
      output += "=";
      break;
    default:
      throw new Error("base64 string is not of the correct length");
  }
  try {
    return b64DecodeUnicode(output);
  } catch (err) {
    return atob(output);
  }
}
function jwtDecode(token, options) {
  if (typeof token !== "string") {
    throw new InvalidTokenError("Invalid token specified: must be a string");
  }
  options || (options = {});
  const pos = options.header === true ? 0 : 1;
  const part = token.split(".")[pos];
  if (typeof part !== "string") {
    throw new InvalidTokenError(`Invalid token specified: missing part #${pos + 1}`);
  }
  let decoded;
  try {
    decoded = base64UrlDecode(part);
  } catch (e) {
    throw new InvalidTokenError(`Invalid token specified: invalid base64 for part #${pos + 1} (${e.message})`);
  }
  try {
    return JSON.parse(decoded);
  } catch (e) {
    throw new InvalidTokenError(`Invalid token specified: invalid json for part #${pos + 1} (${e.message})`);
  }
}

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
    const [authTokens, setAuthTokens] = useState(() =>
        localStorage.getItem("authTokens")
            ? JSON.parse(localStorage.getItem("authTokens"))
            : null
    );
    

    const [user, setUser] = useState(() => 
        localStorage.getItem("authTokens")
            ? jwtDecode(localStorage.getItem("authTokens"))
            : null
    );


    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const loginUser = async (email, password) => {
        const response = await fetch("http://127.0.0.1:8000/api/token/", {
            method: "POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                email, password
            })
        })
        const data = await response.json()
        console.log(data);

        if(response.status === 200){
            console.log("Connexion réussie");
            setAuthTokens(data)
            setUser(jwtDecode(data.access))
            localStorage.setItem("authTokens", JSON.stringify(data))
            navigate("/bibliotheque")
            swal.fire({
                title: "Connexion réussie",
                icon: "success",
                toast: true,
                timer: 4000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
            })

        } else {    
            console.log(response.status);
            console.log("Erreur!!!");
            swal.fire({
                title: "Email ou mot de passe incorrect",
                icon: "error",
                toast: true,
                timer: 4000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
            })
        }
    }

    const registerUser = async (username, email, password, password2) => {
        const response = await fetch("http://127.0.0.1:8000/api/register/", {
            method: "POST",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                username, email, password, password2
            })
        })
        if(response.status === 201){
            navigate("/bibliotheque")
            swal.fire({
                title: "Inscription réussie",
                icon: "success",
                toast: true,
                timer: 4000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
            })
        } else {
            console.log(response.status);
            console.log("Erreur!!!");
            swal.fire({
                title: "An Error Occured " + response.status,
                icon: "error",
                toast: true,
                timer: 4000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
            })
        }
    }

    const logoutUser = () => {
        setAuthTokens(null)
        setUser(null)
        localStorage.removeItem("authTokens")
        navigate("/bibliotheque")
        swal.fire({
            title: "Vous etes déconnecté...",
            icon: "success",
            toast: true,
            timer: 4000,
            position: 'top-right',
            timerProgressBar: true,
            showConfirmButton: false,
        })
    }

    const updateProfile = async (full_name, bio, image) => {
      // Récupérer le token d'authentification depuis le localStorage
      const authTokens = JSON.parse(localStorage.getItem("authTokens"));
      const token = authTokens ? authTokens.access : null;
  
      if (!token) {
          // Si aucun token n'est disponible, afficher un message d'erreur
          swal.fire({
              title: "Erreur d'authentification",
              text: "Vous devez être connecté pour mettre à jour votre profil.",
              icon: "error",
              toast: true,
              timer: 4000,
              position: 'top-right',
              timerProgressBar: true,
              showConfirmButton: false,
          });
          return;
      }
  
      try {
          const response = await fetch("http://127.0.0.1:8000/api/profile/", {
              method: "PATCH",
              headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${token}`, // Ajouter le token d'authentification
              },
              body: JSON.stringify({ full_name, bio, image }),
          });
  
          if (response.ok) {
              const data = await response.json();
              setUser(prevUser => ({ ...prevUser, ...data }));
              localStorage.setItem("authTokens", JSON.stringify(authTokens));
  
              swal.fire({
                  title: "Profil mis à jour",
                  icon: "success",
                  toast: true,
                  timer: 4000,
                  position: 'top-right',
                  timerProgressBar: true,
                  showConfirmButton: false,
              });
          } else {
              const errorData = await response.json(); // Récupérer les détails de l'erreur
              console.log("Erreur lors de la mise à jour du profil", errorData);
              swal.fire({
                  title: `Erreur: ${response.status}`,
                  text: errorData.detail || "Erreur lors de la mise à jour du profil",
                  icon: "error",
                  toast: true,
                  timer: 4000,
                  position: 'top-right',
                  timerProgressBar: true,
                  showConfirmButton: false,
              });
          }
      } catch (error) {
          console.error("Erreur lors de la mise à jour du profil", error);
          swal.fire({
              title: "Erreur lors de la mise à jour du profil",
              text: "Une erreur inattendue s'est produite.",
              icon: "error",
              toast: true,
              timer: 4000,
              position: 'top-right',
              timerProgressBar: true,
              showConfirmButton: false,
          });
      }
  };
  
  

    const contextData = {
        user, 
        setUser,
        authTokens,
        setAuthTokens,
        registerUser,
        loginUser,
        logoutUser,
        updateProfile
    }

    useEffect(() => {
        if (authTokens) {
            setUser(jwtDecode(authTokens.access))
        }
        setLoading(false)
    }, [authTokens, loading])

    return (
        <AuthContext.Provider value={contextData}>
            {loading ? null : children}
        </AuthContext.Provider>
    )

}
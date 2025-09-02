
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  getAuth,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  onAuthStateChanged,
  signOut,
  updateProfile,
} from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA6QHlPQFFgPiwJS38feguZ6LpZ-FeqG-U",
  authDomain: "voluntariadosas-7c156.firebaseapp.com",
  projectId: "voluntariadosas-7c156",
  storageBucket: "voluntariadosas-7c156.firebasestorage.app",
  messagingSenderId: "944806050698",
  appId: "1:944806050698:web:832efd952a654f06f4a673",
  measurementId: "G-33GS463JEV"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
const auth = getAuth(app);
export { auth };
const PROVIDER_GOOGLE = new GoogleAuthProvider();
const analytics = getAnalytics(app);

export const resetPassword = (email) => {
  return sendPasswordResetEmail(auth, email);
};

// ✅ Login con Google + guardado del rol si no existe
export function loginGoogle() {
  return signInWithPopup(auth, PROVIDER_GOOGLE)
    .then(async (result) => {
      const user = result.user;
      const userDocRef = doc(db, "usuarios", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        const esAdmin = user.email === "admin@correo.com"; // cambia este criterio si quieres
        const rol = esAdmin ? "admin" : "usuario";

        await setDoc(userDocRef, {
          uid: user.uid,
          nombre: user.displayName || "",
          correo: user.email,
          foto: user.photoURL || "",
          rol: rol,
        });
      }

      return result;
    })
    .catch((error) => {
      throw error;
    });
}

export const onChangeUser = (setUsuario) => {
  onAuthStateChanged(auth, (user) => {
    const usuario = user ? user.displayName || user.email : null;
    setUsuario(usuario);
  });
};

export const onSignOut = () => {
  return signOut(auth);
};

// ✅ Registro con Email/Password y guardado del rol
export const registroUsuario = async (formData, setFormData) => {
  if (!formData.email || !formData.password) {
    setFormData({ ...formData, error: "Por favor completa todos los campos." });
    return;
  }

  try {
    const result = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
    const user = result.user;

    await updateProfile(user, {
      displayName: formData.username,
    });

    const esAdmin = formData.email === "admin@correo.com";
    const rol = esAdmin ? "admin" : "usuario";

    await setDoc(doc(db, "usuarios", user.uid), {
      uid: user.uid,
      nombre: formData.username,
      correo: user.email,
      foto: user.photoURL || null,
      rol: rol,
    });

    return result;
  } catch (err) {
    setFormData({ ...formData, error: handleError(err.code, err.message) });
    throw err;
  }
};

export const loginUsuario = (formData, setFormData) => {
  if (!formData.email || !formData.password) {
    setFormData({ ...formData, error: "Por favor completa todos los campos." });
    return;
  }

  return signInWithEmailAndPassword(auth, formData.email, formData.password)
    .then((result) => result)
    .catch((err) => {
      setFormData({ ...formData, error: handleError(err.code, err.message) });
      throw err;
    });
};

function handleError(code, message) {
  if (!message) return 'Por favor llenar todos los campos.';
  switch (code) {
    case 'auth/wrong-password':
    case 'auth/user-not-found':
    case 'auth/invalid-credential':
      return 'Correo o contraseña incorrectos.';
    case 'auth/invalid-email':
      return 'Correo electrónico inválido.';
    case 'auth/weak-password':
      return 'La contraseña debe tener al menos 6 caracteres.';
    case 'auth/email-already-in-use':
      return 'El correo ya está en uso.';
    default:
      return message;
  }
}







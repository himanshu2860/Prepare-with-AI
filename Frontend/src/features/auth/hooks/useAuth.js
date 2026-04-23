import { useContext, useEffect } from "react";
import { AuthContext } from "../auth.context";
import { login, register, logout, getMe } from "../services/auth.api";



export const useAuth = () => {

    const context = useContext(AuthContext)
    const { user, setUser, loading, setLoading } = context


 const handleLogin = async ({ email, password }) => {
    // ❌ BLOCK EMPTY INPUT
    if (!email || !password) {
        alert("Please enter email and password");
        return;
    }

    setLoading(true);

    try {
        const data = await login({ email, password });

        localStorage.setItem("token", data.token);
        setUser(data.user);
        window.location.href = "/";

    } catch (err) {
        alert(err?.response?.data?.message || "Login failed"); // ✅ SHOW ERROR
        setUser(null); // ✅ IMPORTANT
    } finally {
        setLoading(false);
    }
};
    const handleRegister = async ({ username, email, password }) => {
       if (!username || !email || !password) {
    alert("All fields required");
    return;
}
    setLoading(true)
    try {
        const data = await register({ username, email, password })

        // ✅ SAVE TOKEN
        localStorage.setItem("token", data.token)

        // ✅ SET USER
        setUser(data.user)

        // ✅ REDIRECT
        window.location.href = "/"

    } catch (err) {
        console.error(err)
    } finally {
        setLoading(false)
    }
}

   const handleLogout = async () => {
    setLoading(true)
    try {
        await logout()

        // ✅ REMOVE TOKEN
        localStorage.removeItem("token")

        // ✅ CLEAR USER
        setUser(null)

        // ✅ REDIRECT
        window.location.href = "/login"

    } catch (err) {
        console.error(err)
    } finally {
        setLoading(false)
    }
}

  useEffect(() => {
  const getAndSetUser = async () => {
    const token = localStorage.getItem("token");

    // ✅ IMPORTANT FIX
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const data = await getMe();
      setUser(data.user);
    } catch (err) {
      setUser(null); // ✅ already added
    } finally {
      setLoading(false);
    }
  };

  getAndSetUser();
}, []);

    return { user, loading, handleRegister, handleLogin, handleLogout }
}
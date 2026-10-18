import { createContext, useState, useEffect } from 'react'
import { auth } from '../config/firebase'
import { onAuthStateChanged, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword,
    signOut
 } from 'firebase/auth'

export const AuthContext = createContext(null)

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser)
            setLoading(false)
        }, (error) => {
            setError(error)
            setLoading(false)
        })
        return () => unsubscribe()
    }, [])

    const signup = async (email, password) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password)
            setUser(userCredential.user)
        } catch (err) {
            setError(err)
            throw err
        }
    }

    const login = async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password)
            setUser(userCredential.user)
        } catch (err) {
            setError(err)
            throw err
        }
    }
    
    const logout = async () => {
        try {
            await signOut(auth)
            setUser(null)
        } catch (err) {
            setError(err)
            throw err
        }
    }

    const value = {
        signup,
        login,
        logout,
        user,
        loading,
        error
    }

    return (
        <AuthContext.Provider value={value}>
            {loading ? <div>Loading...</div> : children}
        </AuthContext.Provider>
    )
}
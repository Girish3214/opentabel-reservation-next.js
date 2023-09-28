import axios from "axios"

function useAuth() {
    const signIn = async ({ email, password }: { email: string, password: string }) => {
        try {
            const response = await axios.post("http://localhost:3000/api/auth/signin", { email, password })
            console.log({ response })
        } catch (error) {
            console.log({ error })
        }
    }
    const signUp = async () => { }

    return { signIn, signUp }
}

export default useAuth
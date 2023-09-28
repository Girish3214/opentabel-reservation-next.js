import { useGlobalContext } from "@/app/store/AuthContext";
import axios from "axios";

interface SignProps {
    email: string;
    password: string;
    closeModal: () => void;
}

interface SignUpProps {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    city: string;
    phone: string;
    closeModal: () => void;
}

function useAuth() {
    const { setAuthState } = useGlobalContext();

    const signIn = async ({ email, password, closeModal }: SignProps) => {
        setAuthState((prev) => ({ data: null, error: null, loading: true }));
        try {
            const response = await axios.post(
                "http://localhost:3000/api/auth/signin",
                { email, password },
            );
            setAuthState((prev) => ({
                error: null,
                data: response.data,
                loading: false,
            }));
            closeModal();
        } catch (error: any) {
            setAuthState((prev) => ({
                data: null,
                error: error?.response?.data?.errorMessage as string,
                loading: false,
            }));
        }
    };

    const signUp = async ({
        email,
        password,
        firstName,
        lastName,
        city,
        phone,
        closeModal,
    }: SignUpProps) => {
        setAuthState((prev) => ({ ...prev, loading: true }));
        try {
            const response = await axios.post(
                "http://localhost:3000/api/auth/signup",
                {
                    email,
                    password,
                    firstName,
                    lastName,
                    city,
                    phone,
                },
            );

            setAuthState((prev) => ({
                error: null,
                data: response.data,
                loading: false,
            }));
            closeModal();
        } catch (error: any) {
            console.log({ error });
            setAuthState((prev) => ({
                data: null,
                error: error?.response?.data?.errorMessage as string,
                loading: false,
            }));
        }
    };


    return { signIn, signUp, };
}

export default useAuth;

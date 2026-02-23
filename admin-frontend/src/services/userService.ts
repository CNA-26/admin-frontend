import axios from "axios";
import {
  getAccessToken
} from "../auth/token";

const API_URL = import.meta.env.USER_API_URL

export const getUsers = async () => {
    const token = getAccessToken();

    const response = await fetch(`${API_URL}api/auth/users`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error("Failed to fetch users")
    }
    
    return response.json();
}
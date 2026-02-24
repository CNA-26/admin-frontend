import {
  getAccessToken
} from "../auth/token";

type User = {
    id: string;
    email: string;
    name: string;
    role: string;
    address: string;
    createdAt?: string;
}

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

export const updateUserRole = async(user: User, role: string) => {
    const token = getAccessToken();

    const response = await fetch(`${API_URL}api/auth/users`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            userId: user.id,
            email: user.email,
            name: user.name,
            role: role,
            address: user.address
        })
    })
    if (!response.ok) {
        throw new Error("Failed to update user")
    }

    return response.json()
}

export const deleteUser = async (userId: string) => {
    const token = getAccessToken();

    const response = await fetch(`${API_URL}api/auth/users/${userId}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`
        }

    })
    if (!response.ok) {
        const text = await response.text();
        console.log("delete error", text)
        throw new Error(text || "Failed to delete user")
    }

    return true;
}
import { userApi } from "../api/userApi";
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
    const response = await userApi.get("/api/auth/users");
    return response.data;
}

export const updateUserRole = async(user: User, role: string) => {
    const response = await userApi.put("/api/auth/users", {
        userId: user.id,
        email: user.email,
        name: user.name,
        role: role,
        address: user.address
    });

    return response.data;
}

export const deleteUser = async (userId: string) => {
    await userApi.delete(`/api/auth/users/${userId}`);
    return true;
}
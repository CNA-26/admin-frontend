import { useEffect, useState } from "react";
import { getUsers, updateUserRole, deleteUser } from "../../services/userService";
import { userApi } from "../../api/userApi";

type User = {
    id: string;
    email: string;
    name: string;
    role: string;
    address: string;
    createdAt?: string;
}

const ShowUsers = () => {


    const [search, setSearch] = useState("");
    const [openUserId, setOpenUserId] = useState<string | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);






    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await getUsers();
                console.log("Fetched users:", data);
                setUsers(data);
            } catch (err: any) {
                setError(err.message || "Something went wrong");
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleRoleChange = async (user: User, newRole: string) => {
        try {
            const updatedUser = await updateUserRole(user, newRole);

            setUsers((prevUsers) =>
                prevUsers.map((u) =>
                    u.id === user.id ? updatedUser : u
                )
            )
        } catch (err: any) {
            setError(err.message)
        }
    }

    const handleDeleteUser = async (userId: string) => {
        if (!confirm("Are you sure you want to delete this user?")) return;

        try {
            await deleteUser(userId);

            setUsers((prevUsers) => prevUsers.filter((u) => u.id !== userId));
        } catch (err:any) {
            setError(err.message)
        }
    }

    if (loading) return <div>Loading users...</div>;
    if (error) return <div>Error: {error}</div>;



    const filteredUsers = users.filter((user) =>
        user.name?.toLowerCase().includes(search.toLowerCase()) ||
        user.email?.toLowerCase().includes(search.toLowerCase())
    )

    const toggleUser = (id: string | null) => {
        setOpenUserId(openUserId === id ? null : id)
    };

    return (
        <div className="bg-[var(--color-card)] shadow-md shadow-black/10 rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Users</h2>


            {/* Search Bar */}
            <input
                type="text"
                placeholder="Search by name or email"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-67 flex justify-start mb-4 px-3 py-2 border bg-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="grid grid-cols-[2fr_2fr_0.5fr] text-left mb-2 px-4 text-sm font-semibold text-gray-600">
                <div>Namn</div>
                <div>Email</div>
                <div>Skapad</div>
            </div>

            <div className="space-y-3">
                {filteredUsers.map((user) => {
                    
                    const info = user;

                    return (
                        <div key={user.id} >
                            <div
                                onClick={() => toggleUser(user.id)}
                                className="grid grid-cols-[2fr_2fr_0.5fr] bg-white rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition p-4 items-center cursor-pointer"
                            >


                                
                                <div className="w-40">{user.name || "-"}</div>
                                <div className="flex-1">{user.email}</div>
                                <div className="w-32 text-gray-500 text-sm">
                                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}
                                </div>
                            </div>

                            {
                                openUserId === user.id && info && (
                                    <div className="bg-gray-50 rounded-xl p-4 mt-2 shadow-inner">
                                        <div><strong>Address:</strong><pre className="whitespace-pre-wrap inline">{info.address}</pre></div>
                                        <div><strong>Role:</strong>{info.role || "-"}</div>
                                        <div><strong>Created:</strong>{info.createdAt ? new Date(info.createdAt).toLocaleDateString() : "-"}</div>
                                        <div><select 
                                            value={info.role}
                                            onChange={(e) => handleRoleChange(user, e.target.value)}
                                            className="ml-2 px-2 py-1 border rounded-xl bg-white"
                                        >
                                            <option value="USER">USER</option>
                                            <option value="ADMIN">ADMIN</option>
                                        </select></div>
                                        <div className="mt-2">
                                            <button 
                                                onClick={() => handleDeleteUser(user.id)}
                                                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                            >
                                                Delete user
                                            </button>
                                        </div>
                                    </div>
                                )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};


export default ShowUsers;
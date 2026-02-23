import { useEffect, useState } from "react";
import { getUsers } from "../../services/userService";

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



    // const users = [
    //     { id: 1, name: "Alice", email: "Alice.Schmalice@gmail.com", active: "12.01.2026" },
    //     { id: 2, name: "Bob", email: "Bob.Schmob@gmail.com", active: "12.02.2026" },
    //     { id: 3, name: "Charlie", email: "Charlie.Schmarlie@gmail.com", active: "01.01.2026" },
    // ];


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

    if (loading) return <div>Loading users...</div>;
    if (error) return <div>Error: {error}</div>;

    // const userInfo = [
    //     { id: 1, name: "Alice", email: "Alice.Schmalice@gmail.com", active: "12.01.2026", address: "Romgatan 5 \n 00560 Helsingros", telefon: "040 123 4567", role: "Admin", status: "06.02.2026... Aktiv \n 24.02.2025... Betald", created: "12.12.1902" },
    //     { id: 2, name: "Bob", email: "Bob.Schmob@gmail.com", active: "12.02.2026", address: "Romgatan 5 \n 00560 Helsingros", telefon: "040 123 4567", role: "Admin", status: "06.02.2026... Aktiv \n 24.02.2025... Betald", created: "12.12.1902" },
    //     { id: 3, name: "Charlie", email: "Charlie.Schmarlie@gmail.com", active: "01.01.2026", address: "Romgatan 5 \n 00560 Helsingros", telefon: "040 123 4567", role: "Admin", status: "06.02.2026... Aktiv \n 24.02.2025... Betald", created: "12.12.1902" },
    // ]

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

            <div className="grid grid-cols-[1.6fr_2fr_140px] text-left mb-2 px-4 text-sm font-semibold text-gray-600">
                <div>Namn</div>
                <div>Email</div>
                <div>Skapad</div>
            </div>

            <div className="space-y-3">
                {filteredUsers.map((user) => {
                    // const info = userInfo.find((u) => u.id === user.id);
                    const info = user;

                    return (
                        <div key={user.id} /*className="border-b hover:bg-gray-50" "grid grid-cols-[80px_1fr_2fr_140px] bg-white rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition p-4 items-center"*/>
                            <div
                                onClick={() => toggleUser(user.id)}
                                className="grid grid-cols-[80px_1fr_2fr_140px] bg-white rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition p-4 items-center cursor-pointer"
                            >


                                {/* <div className="w-12 font-medium">{user.id}</div> */}
                                <div className="w-40">{user.name}</div>
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
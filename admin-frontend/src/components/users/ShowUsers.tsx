import { useState } from "react";

const ShowUsers = () => {

    
        const [search, setSearch] = useState("");
    

    const users = [
        { id: 1, name: "Alice", email: "Alice.Schmalice@gmail.com", active: "12.01.2026" },
        { id: 2, name: "Bob", email: "Bob.Schmob@gmail.com", active: "12.02.2026" },
        { id: 3, name: "Charlie", email: "Charlie.Schmarlie@gmail.com", active: "01.01.2026" },
    ];

    const filteredUsers = users.filter((user) =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="bg-[var(--color-card)] shadow-md shadow-black/10 rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Users</h2>


            {/* Search Bar */}
            <input 
                type="text" 
                placeholder="Search by name or email"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full mb-4 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

            <table className="w-full text-left">
                <thead>
                    <tr className="border-b">
                        <th className="pb-2">ID</th>
                        <th>Namn</th>
                        <th>Email</th>
                        <th>Senast Aktiv</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.map((user) => (
                        <tr key={user.id} className="border-b hover:bg-gray-50">
                            <td className="py-2">{user.id}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.active}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </div >
    )


};

export default ShowUsers;
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
                className="w-67 flex justify-start mb-4 px-3 py-2 border bg-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="grid grid-cols-[140px_1.6fr_2fr_140px] text-left mb-2 px-4 text-sm font-semibold text-gray-600">
                <div className="pb-2">ID</div>
                <div>Namn</div>
                <div>Email</div>
                <div>Senast Aktiv</div>
            </div>

            <div className="space-y-3">
                {filteredUsers.map((user) => (
                    <div key={user.id} className=/*"border-b hover:bg-gray-50"*/ "grid grid-cols-[80px_1fr_2fr_140px] bg-white rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition p-4 items-center">
                        <div className="w-12 font-medium">{user.id}</div>
                        <div className="w-40">{user.name}</div>
                        <div className="flex-1">{user.email}</div>
                        <div className="w-32 text-gray-500 text-sm">{user.active}</div>
                    </div>
                ))}
            </div>
        </div >
    )


};

export default ShowUsers;
const ShowUsers = () => {
    const users = [
        { id: 1, name: "Alice", email: "Alice.Schmalice@gmail.com", active: "12.01.2026" },
        { id: 2, name: "Bob", email: "Bob.Schmob@gmail.com", active: "12.02.2026" },
        { id: 3, name: "Charlie", email: "Charlie.Schmarlie@gmail.com", active: "01.01.2026" },
    ];

    const filteredUsers = users.filter((user) =>
        user.name.toLowerCase()/*.includes(search.toLowerCase())*/ ||
        user.email.toLowerCase()/*.includes(search.toLowerCase())*/
    )

    return (
        <div className="bg-[var(--color-card)] shadow-md shadow-black/10 rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Users</h2>

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
                    {users.map((user) => (
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
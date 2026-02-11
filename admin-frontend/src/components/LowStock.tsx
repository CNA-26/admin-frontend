const LowStock = () => {
  const products = [
    { name: "Monstera", stock: 3 },
    { name: "Ficus", stock: 2 },
  ];

  return (
    <div className="bg-[var(--color-card)] shadow-md shadow-black/10 rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-4 text-red-600">
        ⚠ Low Stock Products
      </h2>

      <ul className="space-y-2">
        {products.map((p, index) => (
          <li key={index} className="flex justify-between">
            <span>{p.name}</span>
            <span className="text-red-500 font-bold">{p.stock} left</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LowStock;

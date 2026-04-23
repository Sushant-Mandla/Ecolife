import ecoProducts from "../data/ecoProducts";
import { motion } from "framer-motion";

const EcoProducts = () => {
  const handleBuy = (searchQuery) => {
    const url = `https://www.amazon.in/s?k=${encodeURIComponent(searchQuery)}`;
    window.open(url, "_blank");
  };

  const handleExploreMore = () => {
    const url =
      "https://www.amazon.in/s?k=eco+friendly+plastic+free+products+no+plastic+packaging";
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-800 to-green-600 text-white py-20 text-center">
        <h1 className="text-5xl font-bold mb-4">
          🌱 Eco-Friendly Products
        </h1>
        <p className="text-lg max-w-2xl mx-auto">
          Discover sustainable alternatives to everyday items that are better
          for you and the planet.
        </p>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid gap-10 md:grid-cols-3 lg:grid-cols-4">
        {ecoProducts.map((product) => (
          <motion.div
            key={product.id}
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-2xl shadow-md overflow-hidden transition duration-300"
          >
            <div className="h-60 overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-6 text-center">
              <h3 className="text-xl font-semibold text-green-800 mb-3">
                {product.name}
              </h3>

              <p className="text-gray-600 text-sm mb-6">
                {product.description}
              </p>

              <button
                onClick={() => handleBuy(product.search)}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full transition"
              >
                Buy Now
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="pb-16 px-6 text-center">
        <button
          onClick={handleExploreMore}
          className="bg-green-700 hover:bg-green-800 text-white font-semibold px-8 py-3 rounded-full transition"
        >
          Explore More Plastic-Free Products
        </button>
        <p className="mt-3 text-sm text-green-900/80">
          Redirects to eco-friendly products focused on no plastic and no plastic packaging.
        </p>
      </div>
    </div>
  );
};

export default EcoProducts;
// TODO: add isAuthenticated middleware
// TODO: replace sample data with actual data source

// sample data for sellers
const sellers = [
    { id: 1, name: 'Seller 1', type: 'restaurant', distance: 5, priceRange: '$$', acceptsPiCoin: true },
    { id: 2, name: 'Seller 2', type: 'clothing store', distance: 10, priceRange: '$$', acceptsPiCoin: true },
];

// endpoint for searching sellers
const search = async (req, res) => {
    try {
        // extract criteria from the request body
        const { businessType, distance, priceRange } = req.body;

        // filter sellers based on criteria (todo: replace with actual data source)
        const filteredSellers = sellers.filter(seller => {
            return (
                seller.type.toLowerCase() === businessType.toLowerCase() &&
                seller.distance <= distance &&
                seller.priceRange === priceRange &&
                seller.acceptsPiCoin
            );
        });

        if (filteredSellers.length > 0) {
            console.log("We are here 200.");
            return res.status(200).json({ sellers: filteredSellers });
        } else {
            console.log("We are here 404.");
            return res.status(404).json({ message: "No sellers found matching the criteria." });
        }
    } catch (error) {
        console.log("Internal server error while searching sellers: " + error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = { search };

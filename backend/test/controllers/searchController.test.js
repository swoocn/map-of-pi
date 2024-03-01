const { search } = require('../../src/controllers/searchController');

const Shop = require('../../src/models/shopModel');
const Product = require('../../src/models/productModel');

// Mock Shop and Product models
jest.mock('../../src/models/shopModel');
jest.mock('../../src/models/productModel');

describe('POST /search', () => {
    let req, res;

    beforeEach(() => {
        req = {
            query: {
                businessType: 'restaurant',
                priceRange: '5-10',
                shopName: 'Example Shop',
                productName: 'Example Product'
            }
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    test('It should return filtered shops based on criteria', async () => {
        // Mock the response of Shop.find() to return some sample shops
        const sampleShops = [{ name: 'Example Shop 1' }, { name: 'Example Shop 2' }];
        Shop.find.mockResolvedValue(sampleShops);

        // Mock the response of Product.find() to return some sample products
        const sampleProducts = [{ name: 'Product 1', shop: 'Example Shop 1' }, { name: 'Product 2', shop: 'Example Shop 2' }];
        Product.find.mockResolvedValue(sampleProducts);

        await search(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            shops: sampleShops // Assuming shops is an array of objects
        });
    }, 1000); // Increase timeout to 1 second for the sake of testing

    test('It should return 404 if no shops match the criteria', async () => {
        // Mock the response of Shop.find() to return an empty array
        Shop.find.mockResolvedValue([]);

        await search(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({message: 'No shops found matching the criteria.'});
    }, 1000);

    test('It should return 500 if an internal server error occurs', async () => {
        // Mock an error in Shop.find() to simulate an internal server error
        const errorMessage = 'Internal server error';
        Shop.find.mockRejectedValue(new Error(errorMessage));

        await search(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({error: 'Internal server error'});
    }, 1000);
});

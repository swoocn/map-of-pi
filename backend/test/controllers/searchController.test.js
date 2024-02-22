const { search } = require('../../src/controllers/searchController');

describe('POST /search', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {
                businessType: 'restaurant',
                distance: 5,
                priceRange: '$$'
            }
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    test('It should return filtered sellers based on criteria', async () => {
        await search(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            sellers: expect.arrayContaining([
                expect.objectContaining({
                    name: 'Seller 1',
                    type: 'restaurant'
                })
            ])
        });
    });

    test('It should return 404 if no sellers match the criteria', async () => {
        req.body.businessType = 'non-existing-type';
        await search(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            message: 'No sellers found matching the criteria.'
        });
    });

    test('It should return 500 if an internal server error occurs', async () => {
        // simulate an internal server error
        const errorMessage = 'Internal server error';
        jest.spyOn(console, 'log').mockImplementation(() => {});
        jest.spyOn(res, 'status').mockImplementation(() => res);
        jest.spyOn(res, 'json').mockImplementation(() => {});

        // mocking the req.body to throw an error
        req.body = null;

        await search(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Internal server error'
        });
    });
});

var express = require('express');
var router = express.Router();
const controller = require('../controllers/categoriesController')

router.get('/', controller.getAll)
router.get('/slug/:slug', controller.getBySlug)
router.get('/:id/products', controller.getProductsByCategory)
router.get('/:id', controller.getByID)
router.post('/', controller.create)
router.put('/:id', controller.edit)
router.delete('/:id', controller.remove)

module.exports = router;

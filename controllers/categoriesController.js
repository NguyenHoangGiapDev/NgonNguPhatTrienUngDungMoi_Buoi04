const slugify = require('slugify')
const { IncrementalId } = require('../utils/IncrementalIdHandler')
const { data: categories } = require('../utils/categories')
const { data: products } = require('../utils/data')

function getAll(req, res) {
  const nameQ = req.query.name ? req.query.name.toLowerCase() : '';
  const result = categories.filter(function (c) {
    if (c.isDeleted) return false;
    return c.name.toLowerCase().includes(nameQ);
  })
  res.status(200).send(result);
}

function getBySlug(req, res) {
  const slug = req.params.slug;
  const result = categories.find(function (c) { return (!c.isDeleted) && c.slug === slug });
  if (result) return res.status(200).send(result);
  return res.status(404).send({ message: 'SLUG NOT FOUND' });
}

function getByID(req, res) {
  const id = Number(req.params.id);
  const result = categories.find(function (c) { return (!c.isDeleted) && c.id === id });
  if (result) return res.status(200).send(result);
  return res.status(404).send({ message: 'ID NOT FOUND' });
}

function getProductsByCategory(req, res) {
  const id = Number(req.params.id);
  const cat = categories.find(function (c) { return (!c.isDeleted) && c.id === id });
  if (!cat) return res.status(404).send({ message: 'CATEGORY NOT FOUND' });
  const result = products.filter(function (p) {
    if (p.isDeleted) return false;
    if (!p.category) return false;
    // category can be an object with id, or a plain id (number/string)
    if (typeof p.category === 'object' && p.category.id !== undefined) {
      return Number(p.category.id) === id;
    }
    return Number(p.category) === id;
  });
  return res.status(200).send(result);
}

function create(req, res) {
  const body = req.body || {};
  const name = body.name || '';
  const newObj = {
    id: IncrementalId(categories),
    name: name,
    slug: slugify(name, { replacement: '-', lower: true, locale: 'vi' }),
    image: body.image || '',
    creationAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  categories.push(newObj);
  return res.status(201).send(newObj);
}

function edit(req, res) {
  const id = Number(req.params.id);
  const cat = categories.find(function (c) { return c.id === id && !c.isDeleted });
  if (!cat) return res.status(404).send({ message: 'ID NOT FOUND' });
  const body = req.body || {};
  const forbidden = ['id', 'creationAt'];
  for (const key of Object.keys(body)) {
    if (forbidden.includes(key)) continue;
    if (key === 'name') {
      cat.name = body.name;
      cat.slug = slugify(body.name, { replacement: '-', lower: true, locale: 'vi' });
      continue;
    }
    cat[key] = body[key];
  }
  cat.updatedAt = new Date().toISOString();
  return res.status(200).send(cat);
}

function remove(req, res) {
  const id = Number(req.params.id);
  const cat = categories.find(function (c) { return c.id === id });
  if (!cat) return res.status(404).send({ message: 'ID NOT FOUND' });
  cat.isDeleted = true;
  cat.updatedAt = new Date().toISOString();
  return res.status(200).send(cat);
}

module.exports = {
  getAll,
  getBySlug,
  getByID,
  getProductsByCategory,
  create,
  edit,
  remove
}

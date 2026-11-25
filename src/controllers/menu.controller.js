import * as menuService from '../services/menu.service.js';

export async function getAll(req, res, next) {
  try {
    const data = await menuService.getAll(req.query.kategori);
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
}

export async function getById(req, res, next) {
  try {
    const data = await menuService.getById(req.params.id);
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
}

export async function create(req, res, next) {
  try {
    const data = await menuService.create(req.body);
    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    const data = await menuService.update(req.params.id, req.body);
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    await menuService.remove(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

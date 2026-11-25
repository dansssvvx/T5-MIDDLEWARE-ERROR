import { AppError } from '../errors/app-error.js';
import { menuDb } from '../data/menu.data.js';

async function cekNamaUnik(nama, idDiacuhai) {
  const sama = await menuDb.findByNama(nama);
  if (sama && sama.id !== idDiacuhai) {
    throw new AppError(409, `Nama menu "${nama}" sudah digunakan`, 'NAMA_DUPLIKAT');
  }
}

export async function getAll(kategori) {
  return menuDb.findAll(kategori);
}

export async function getById(id) {
  const item = await menuDb.findById(Number(id));
  if (!item) throw new AppError(404, 'Menu tidak ditemukan', 'NOT_FOUND');
  return item;
}

export async function create(data) {
  await cekNamaUnik(data.nama);
  return menuDb.create(data);
}

export async function update(id, data) {
  const menuId = Number(id);
  const lama = await getById(menuId);
  await cekNamaUnik(data.nama, lama.id);
  return menuDb.update(menuId, data);
}

export async function remove(id) {
  const menuId = Number(id);
  const item = await getById(menuId);
  return menuDb.remove(item.id);
}

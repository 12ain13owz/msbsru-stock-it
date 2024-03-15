import { Op } from 'sequelize';
import StatusModel, { Status } from '../models/status.model';

export function findAllStatus() {
  return StatusModel.findAll({
    attributes: { exclude: ['createdAt', 'updatedAt'] },
  });
}

export function findStatusByName(name: string): Promise<Status | null> {
  return StatusModel.findOne({ where: { name: { [Op.like]: name } } });
}

export function createStatus(status: Status): Promise<Status> {
  return StatusModel.create(status.dataValues);
}

export function updateStatus(
  id: number,
  status: Partial<Status>
): Promise<[affectedCount: number]> {
  return StatusModel.update(status, { where: { id } });
}

export function deleteStatus(id: number): Promise<number> {
  return StatusModel.destroy({ where: { id } });
}
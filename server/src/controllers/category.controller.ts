import { NextFunction, Request } from 'express';
import { ExtendedResponse } from '../types/express';
import { omit } from 'lodash';
import { newError, privateFields, removeWhitespace } from '../utils/helper';
import { Category } from '../models/category.model';
import {
  CreateCategoryInput,
  DeleteCategoryInput,
  UpdateCategoryInput,
} from '../schemas/category.schema';
import {
  createCategory,
  deleteCategory,
  findAllCategory,
  findCategoryByName,
  updateCategory,
} from '../services/category.service';

export async function getAllCategoryHandler(
  req: Request,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.locals.func = 'getAllCategoryHandler';

  try {
    const payload = await findAllCategory();
    res.json(payload);
  } catch (error) {
    next(error);
  }
}

export async function createCategoryHandler(
  req: Request<{}, {}, CreateCategoryInput>,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.locals.func = 'createCategoryHandler';

  try {
    const name = removeWhitespace(req.body.name);
    const category = await findCategoryByName(name);
    if (category) throw newError(400, 'ชื่อประเภทอุปกรณ์ซ้ำ');

    const payload = new Category({
      name: name,
      active: req.body.active,
      remark: req.body.remark || '',
    });
    const result = await createCategory(payload);
    const newCagegory = omit(result.dataValues, privateFields);

    res.json({
      message: 'เพิ่มประเภทอุปกรณ์สำเร็จ',
      category: newCagegory,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateCategoryHandler(
  req: Request<UpdateCategoryInput['params'], {}, UpdateCategoryInput['body']>,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.locals.func = 'updateCategoryHandler';

  try {
    const id = +req.params.id;
    const name = removeWhitespace(req.body.name);
    const existingCategory = await findCategoryByName(name);

    if (existingCategory && existingCategory.id !== id)
      throw newError(400, 'ชื่อประเภทอุปกรณ์ซ้ำ');

    const payload: Partial<Category> = {
      name: name,
      active: req.body.active,
      remark: req.body.remark || '',
    };
    const result = await updateCategory(id, payload);
    if (!result[0]) throw newError(400, 'อัพเดทประเภทอุปกรณ์ไม่สำเร็จ');

    res.json({
      message: 'อัพเดทประเภทอุปกรณ์สำเร็จ',
      category: payload,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteCategoryHandler(
  req: Request<DeleteCategoryInput>,
  res: ExtendedResponse,
  next: NextFunction
) {
  res.locals.func = 'deleteCategoryHandler';

  try {
    const result = await deleteCategory(+req.params.id);
    if (!result) throw newError(400, 'ลบประเภทอุปกรณ์ไม่สำเร็จ');

    res.json({ message: 'ลบประเภทอุปกรณ์สำเร็จ' });
  } catch (error) {
    next(error);
  }
}

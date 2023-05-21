
import { Request, Response } from "express";
// import { IProduct, IProductResponse } from "../interfaces/product";
// import { IUser } from "../interfaces/user";
import Category from '../models/category';
import Product from "../models/product";
import { productSchema } from "../schemas/product";


export const getAll = async (req : Request, res : Response) => {
  try {
    const products = await Product.find().populate("categoryId");
    if (products.length === 0) {
      return res.json({
        message: "Không có sản phẩm nào",
      });
    }
    return res.status(200).json({
      message: "Lay danh sach san pham thanh cong!",
      datas: [...products],
    });
  } catch (error) {
    return res.status(400).json({
      message: error,
    });
  }
};
export const get = async function (req : Request, res : Response) {
  try {
    const product = await Product.findById(req.params.id).populate(
      "categoryId"
    );

    if (!product) {
      return res.json({
        message: "Không có sản phẩm nào",
        datas: [],
      });
    }
    return res.status(200).json({
      message: "Lay san pham thanh cong!",
      datas: [product],
    });
  } catch (error) {
    return res.status(400).json({
      message: error,
      datas: [],
    });
  }
};
export const create = async function (req : Request, res : Response) {
  try {
    const { error } = productSchema.validate(req.body, { abortEarly: false });
    if (error) {
        const errors = error.details.map((message) => ({ message }));
        return res.status(400).json({ errors });
    }
    // Thêm sản phẩm vào database
    const product = await Product.create(req.body);

    await Category.findOneAndUpdate(product.categoryId, {
        $addToSet: {
            products: product._id
        }
    })
    return res.status(200).json({
        product,
    });
} catch (error) {
    return res.status(400).json({
        message: "Thêm sản phẩm không thành công",
        error: error.message
    });
}
};
export const updatePatch = async function (req : Request, res : Response) {
  try {
    const { error } = productSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
        datas: [],
      });
    }
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!product) {
      return res.status(400).json({
        message: "Cập nhật sản phẩm không thành công",
        datas: [],
      });
    }
    return res.status(200).json({
      message: "Cập nhật sản phẩm thành công",
      datas: [product],
    });
  } catch (error) {
    return res.status(400).json({
      message: error,
      datas: [],
    });
  }
};
export const remove = async function (req : Request, res : Response) {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    return res.json({
      message: "Xóa sản phẩm thành công",
      datas: [product],
    });
  } catch (error) {
    return res.status(400).json({
      message: error,
      datas: [],
    });
  }
};

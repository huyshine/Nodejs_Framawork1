import { NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { IUser } from "../interfaces/user";
import User from '../models/user';

export const authenticate = async (req, res, next: NextFunction) => {
    try {
        // kiểm tra xem user có đăng nhập không
        if (!req.headers.authorization) {
            throw new Error("Bạn phải đăng nhập để thực hiện hành động này");
        }

        // lấy jwt token từ header
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, "123456", async (err, payload) => {
            if (err) {
                if (err.name === "JsonWebTokenError") {
                    return res.json({
                        message: "Token không hợp lệ",
                    });
                }
                if (err.name === "TokenExpiredError") {
                    return res.json({
                        message: "Token hết hạn",
                    });
                }
            }
            // lấy thông tin user từ database
            const user : any = await User.findById(payload._id);
            // kiểm tra xem user có đủ quyền để thực hiện hành động đó không
            if (user.role != "admin") {
                return res.json({
                    message: "Bạn không có quyền để thực hiện hành động này",
                });
            }
            // lưu thông tin user vào request để sử dụng trong các middleware khác
            req.user = user;

            next();
        });
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
};
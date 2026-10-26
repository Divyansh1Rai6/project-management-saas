import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";

export const getCurrentUser = async (userId: string) => {
    const user = await User.findById(userId).select(
        "name email createdAt updatedAt"
    );

    if (!user) {
        throw new ApiError(404, "User not found");
    }
    return user;
};

export const updateCurrentUser = async (
    userId: string,
    data: { name: string }) => {
    const user = await User.findByIdAndUpdate(
        userId,
        {
            $set: {
                name: data.name,
            },
        },
        {
            new: true,
            runvalidators: true,
        }
    ).select("name email createdAt updatedAt");

    if (!user) {
        throw new ApiError(404, "User not found");
    }
    return user;
}

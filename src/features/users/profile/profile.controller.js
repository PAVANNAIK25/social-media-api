import ApiResponse from "../../../utils/apiResponse.js";
import { getLocalePath, getStaticUrl } from "../../../utils/helpers.js";
import ProfileRepository from "./profile.repository.js";

export default class ProfileController {

    constructor() {
        //instance of profile repository
        this.profileRepository = new ProfileRepository();
    }

    // gets user Profile
    async getUserProfile(req, res, next) {
        const userId = req.params.userId || req.userId;
        try {
            const user = await this.profileRepository.getUserProfile(userId);
            res.status(200).send(new ApiResponse(200, user, "Profile retrived successfully!"));
        } catch (err) {
            next(err);
        }

    }

    async updateCoverImage(req, res, next) {
        const userId = req.userId;
        try {
            if (!req.file?.filename) {
                throw new ApiError(400, "Cover image is required");
            }
            const fileLocalPath = getLocalePath(req.file?.filename);
            const fileStaticUrl = getStaticUrl(req, req.file?.filename);
            const user = await this.profileRepository.updateCoverImageRepo(userId, fileLocalPath, fileStaticUrl);
            res.status(200).send(new ApiResponse(200, user, "Profile retrived successfully!"));
        } catch (err) {
            console.log(err);
            next(err);
        }
    }


    async updateOrCreateProfile(req, res, next) {
        const userId = req.userId;
        try {
            const user = await this.profileRepository.updateOrCreateProfileRepo(userId, req.body);
            res.status(200).send(new ApiResponse(200, user, "Profile retrived successfully!"));
        } catch (err) {
            console.log(err);
            next(err);
        }

    }


}


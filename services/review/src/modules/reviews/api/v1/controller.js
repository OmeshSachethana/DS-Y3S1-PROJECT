import express from "express";
import mongoose from "mongoose";
// import { Joi } from "celebrate";
import { celebrate, Segments } from "celebrate";
import { default as filterQuery } from "@sliit-foss/mongoose-filter-query";
import { asyncHandler } from "@sliit-foss/functions";
import { objectIdSchema } from "@app/constants";
import { toSuccess } from "@app/middleware";
import {
  serviceCreateReview,
  serviceGetReviews,
  serviceGetReviewById,
  serviceUpdateReviewById,
  serviceDeleteReviewById,
} from "./service";

import { createReviewSchema, updateReviewSchema } from "./schema";

const review = express.Router();

// review.post(
//   "/",
//   celebrate({
//     [Segments.BODY]: {
//       user_id: Joi.string().required(),
//       user_name: Joi.string().required(),
//       product_id: objectIdSchema(), // validate product_id as ObjectId
//       title: Joi.string().required(),
//       description: Joi.string().required(),
//       rating: Joi.number().required(),
//     },
//   }),
//   asyncHandler(async function controllerCreateReview(req, res) {
//     const data = await serviceCreateReview({
//       ...req.body,
//       product_id: mongoose.Types.ObjectId(req.body.product_id), // convert product_id to ObjectId
//     });
//     return toSuccess({ res, data, message: "Review created successfully!" });
//   })
// );

review.post(
  "/",
  celebrate({ [Segments.BODY]: createReviewSchema }),
  asyncHandler(async function controllerCreateReview(req, res) {
    const data = await serviceCreateReview({
      ...req.body,
      product_id: mongoose.Types.ObjectId(req.body.product_id), // convert product_id to ObjectId
    });
    return toSuccess({ res, data, message: "Review created successfully!" });
  })
);

// review.get(
//   "/",
//   filterQuery,
//   asyncHandler(async function controllerGetReviews(req, res) {
//     const data = await serviceGetReviews(
//       req.query.filter,
//       req.query.sort,
//       req.query.page,
//       req.query.limit
//     );
//     return toSuccess({ res, data, message: "Reviews fetched successfully!" });
//   })
// );

review.get(
  "/",
  filterQuery,
  asyncHandler(async function controllerGetReviews(req, res) {
    const { filter, sort, page, limit } = req.query;
    const reviews = await serviceGetReviews(filter, sort, page, limit);
    const ratings = reviews.map((review) => review.rating);
    const avgRating =
      ratings.reduce((acc, val) => acc + val, 0) / ratings.length;
    const data = { reviews, avgRating };
    return toSuccess({ res, data, message: "Reviews fetched successfully!" });
  })
);

review.get(
  "/:id",
  celebrate({ [Segments.PARAMS]: objectIdSchema() }),
  asyncHandler(async function controllerGetReviewById(req, res) {
    const data = await serviceGetReviewById(req.params.id);
    return toSuccess({ res, data, message: "Review fetched successfully!" });
  })
);

review.patch(
  "/:id",
  celebrate({
    [Segments.PARAMS]: objectIdSchema(),
    [Segments.BODY]: updateReviewSchema,
  }),
  asyncHandler(async function controllerUpdateReviewById(req, res) {
    const data = await serviceUpdateReviewById(req.params.id, req.body);
    return toSuccess({ res, data, message: "Review updated successfully!" });
  })
);

review.delete(
  "/:id",
  celebrate({ [Segments.PARAMS]: objectIdSchema() }),
  asyncHandler(async function controllerDeleteReviewById(req, res) {
    const data = await serviceDeleteReviewById(req.params.id);
    return toSuccess({ res, data, message: "Review deleted successfully!" });
  })
);

export default review;

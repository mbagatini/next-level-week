import express from "express";
import multer from "multer";

import multerConfig from './config/multer';

// index: listagem
// show: obter um registro
// create, update, delete
const routes = express.Router();
const upload = multer(multerConfig);

import PointsController from "./controllers/PointsController";
const pointsController = new PointsController();

import ItemsController from "./controllers/ItemsController";
const itemsController = new ItemsController();

routes.get("/items", itemsController.index);

routes.get("/points", pointsController.index);
routes.get("/points/:id", pointsController.show);

routes.post("/points", upload.single('image'), pointsController.create);

export default routes;

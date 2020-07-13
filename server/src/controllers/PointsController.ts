import { Request, Response } from "express";
import knex from "../database/connection";

class PointsController {
  async index(req: Request, res: Response) {
    return res.json(await knex("points").select("*"));
  }

  async show(req: Request, res: Response) {
    const { id } = req.params;
    const point = await knex("points").where("id", id).first();

    if (!point) {
      return res.status(400).json({ message: "Point not found" });
    }

    return res.json(point);
  }

  async create(req: Request, res: Response) {
    const {
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
      items,
    } = req.body;

    const point = {
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
      image: "image-fake",
    };

    const trx = await knex.transaction();

    const ininsertedIds = await trx("points").insert(point);

    const point_id = ininsertedIds[0];
    const pointItems = items.map((item_id: number) => {
      return {
        item: item_id,
        point: point_id,
      };
    });

    await trx("point_items").insert(pointItems);

    return res.json({ id: point_id, ...pointItems });
  }
}

export default PointsController;

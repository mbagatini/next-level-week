import { Request, Response } from "express";
import knex from "../database/connection";

class PointsController {
  async index(req: Request, res: Response) {
    const { city, uf, items } = req.query;

    const parsedItems = String(items)
      .split(",")
      .map((item) => Number(item.trim()));

    const points = await knex("points")
      .join("point_items", "points.id", "=", "point_items.point")
      .whereIn("point_items.item", parsedItems)
      .where("city", String(city))
      .where("uf", String(uf))
      .select("points.*");

    return res.json(points);
  }

  async show(req: Request, res: Response) {
    const { id } = req.params;
    const point = await knex("points").where("id", id).first();

    if (!point) {
      return res.status(400).json({ message: "Point not found" });
    }

    const items = await knex("items")
      .join("point_items", "items.id", "=", "point_items.item")
      .where("point_items.point", id)
      .select("items.title");

    return res.json({ point, items });
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
      image: req.file.filename,
    };

    const trx = await knex.transaction();

    const ininsertedIds = await trx("points").insert(point);

    const point_id = ininsertedIds[0];
    const pointItems = items
      .split(',')
      .map((item: string) => Number(item.trim()))
      .map((item_id: number) => {
        return {
          item: item_id,
          point: point_id,
        };
      });

    await trx("point_items").insert(pointItems);

    await trx.commit();

    return res.json({ id: point_id, ...pointItems });
  }
}

export default PointsController;

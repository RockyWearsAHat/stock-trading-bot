import { Router, Request, Response } from "express";
import { getHistoricalData, getStockPrice } from "../api/getStockPrice";
export const APIRouter = Router();

APIRouter.get("/currentPrice", async (req: Request, res: Response) => {
  const { stock } = req.body;

  if (!stock) {
    return res.status(400).send("Please provide a stock ticker");
  }

  try {
    const priceOfStock = await getStockPrice(stock);
    res.json({ dataFor: `${stock}`, stockData: { price: priceOfStock } });
  } catch (error) {
    res.status(500).send("An error occurred while fetching the stock price");
  }
});

APIRouter.get("/historicalData", async (req: Request, res: Response) => {
  let { day, dayRange, stock } = req.body;

  let currentDate: string;
  if (!day || !dayRange) {
    currentDate = new Date(Date.now()).toLocaleString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }

  console.log(day);

  const historicalData = await getHistoricalData(stock, day);

  return res.json({ historicalData });
});

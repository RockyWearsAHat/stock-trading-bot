import { Router, Request, Response } from "express";
import { getHistoricalData, getStockPrice } from "../api/getStockPrice";
import { getDates } from "../helpers/getDates";
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
  let { day = "", stock } = req.body;

  if (!stock) {
    return res.json("Please provide a stock ticker");
  }

  const stockPrice = await getStockPrice(stock);
  if (stockPrice == "-") {
    return res.json("Invalid stock ticker");
  }

  if (day.indexOf("-") != -1 || day.indexOf("to") != -1) {
    console.log("date range");
    let dateRange =
      day.indexOf("-") != -1
        ? day.split("-").map((d: string) => d.trim())
        : day.split("to").map((d: string) => d.trim());

    dateRange = dateRange.map((d: string) => {
      if (d.toLocaleLowerCase().indexOf("today") != -1) {
        return Date.now();
      } else {
        return d;
      }
    });

    const firstDate = new Date(dateRange[0]);
    const secondDate = new Date(dateRange[1]);

    console.log(firstDate, secondDate);

    if (firstDate < secondDate) {
      day = getDates(firstDate, secondDate) as Date[];
    } else {
      day = getDates(secondDate, firstDate) as Date[];
    }
  }

  if (
    !day ||
    day == "" ||
    (day instanceof String && day.toLocaleLowerCase() == "today")
  ) {
    //If no day, get today and format
    day = new Date(Date.now()).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }) as string;
  } else if (typeof day == "string") {
    //If single day, format
    day = new Date(day).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }) as string;
  } else {
    //If multiple days
    day = day.map((d: Date) => {
      console.log(d);
      return new Date(d).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    });
  }

  const historicalData = await getHistoricalData(stock, day);

  return res.json({ historicalData });
});

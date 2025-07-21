//
const letterMapForTime = ["Z", "B", "K", "X", "O", "R", "C", "Q", "M", "J"];
const letterMapForRandom = ["D", "L", "P", "G", "F", "H", "N", "I", "A", "E"];

export const generateTrxID = (): string => {
  const timestampDigits = Date.now().toString().split("").map(Number);
  const randomDigitsA = Math.floor(Math.random() * 9000 + 1000)
    .toString()
    .split("")
    .map(Number);
  const randomDigitsB = Math.floor(Math.random() * 8000 + 1000)
    .toString()
    .split("")
    .map(Number);

  const timePart = timestampDigits.map((d) => letterMapForTime[d]);
  const randomPart = randomDigitsA
    .map((d, i) => `${letterMapForRandom[d]}${randomDigitsB[i] ?? 0}`)
    .join("");

  return `TRX-${timePart.slice(0, 5).join("")}-${timePart
    .slice(5)
    .join("")}-${randomPart}`;
};

/*
import crypto from "crypto";
crypto.randomUUID()
crypto.randomBytes(8).toString("hex")
*/

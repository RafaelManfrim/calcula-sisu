import axios from "axios"

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

export const sisuApi = axios.create({
  baseURL: "https://sisusimulator.com.br/api/",
  headers: {
    "Content-Type": "application/json",
  },
})
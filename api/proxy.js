// api/proxy.js
const fetch = require("node-fetch");

module.exports = async (req, res) => {
  // 1) 设置 CORS 头，允许自定义头部
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  // 这里多加了 read-token, Referer, User-Agent
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, read-token, Referer, User-Agent");

  // 2) 如果是预检请求(OPTIONS)，直接返回
  if (req.method === "OPTIONS") {
    return res.status(200).send("OK");
  }

  // 3) 获取查询参数
  const { walletAddress } = req.query;
  if (!walletAddress) {
    return res.status(400).json({ error: "walletAddress is required" });
  }

  // 4) 构造目标 API URL
  const apiUrl = `https://api.definitive.fi/v1/public/airdrop/eligibility?walletAddress=${walletAddress}`;

  try {
    // 5) 从请求头里读取
    //    如果你想固定使用某个 token, 可以直接写死
    const readToken = req.headers["read-token"] || "c8725aac-6f23-4454-9367-78358a4055f1";
    const referer = req.headers["referer"] || "https://app.definitive.fi/";
    const userAgent = req.headers["user-agent"] || "Mozilla/5.0 (Windows NT 10.0; Win64; x64)";

    // 6) 发起请求到目标服务器
    const response = await fetch(apiUrl, {
      headers: {
        "read-token": readToken,
        "Referer": referer,
        "User-Agent": userAgent
      }
    });

    // 7) 解析响应
    const data = await response.json();

    // 8) 返回给前端
    return res.status(200).json(data);

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

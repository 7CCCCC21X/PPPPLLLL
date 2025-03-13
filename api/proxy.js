// api/proxy.js
const fetch = require("node-fetch");

module.exports = async (req, res) => {
  // 设置 CORS 头，允许任何来源访问
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // 如果是预检请求(OPTIONS)，直接返回
  if (req.method === "OPTIONS") {
    return res.status(200).send("OK");
  }

  // 从查询参数获取 walletAddress
  const { walletAddress } = req.query;
  if (!walletAddress) {
    return res.status(400).json({ error: "walletAddress is required" });
  }

  // 目标 API URL
  const apiUrl = `https://api.definitive.fi/v1/public/airdrop/eligibility?walletAddress=${walletAddress}`;

  try {
    // 发起请求到目标服务器
    const response = await fetch(apiUrl, {
      headers: {
        "read-token": "c8725aac-6f23-4454-9367-78358a4055f1",
        "Referer": "https://app.definitive.fi/",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
      }
    });

    // 解析响应
    const data = await response.json();

    // 返回给前端
    return res.status(200).json(data);

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

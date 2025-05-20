// 必须放最顶上，启用 global-agent 代理支持
require("global-agent/bootstrap");

const https = require("https");

https
    .get(
        "https://accounts.google.com/.well-known/openid-configuration",
        (res) => {
            let data = "";

            res.on("data", (chunk) => (data += chunk));
            res.on("end", () => {
                console.log("✅ 成功连接 Google，返回内容前100字符:");
                console.log(data.slice(0, 100));
            });
        },
    )
    .on("error", (err) => {
        console.error("❌ Node.js 无法访问 Google:", err.message);
    });

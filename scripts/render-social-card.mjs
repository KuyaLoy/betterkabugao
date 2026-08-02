import sharp from "sharp";

const logo = await sharp("public/brand/betterkabugao-logo.svg")
  .resize({ width: 900 })
  .png()
  .toBuffer();

const label = Buffer.from(`
  <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
    <text x="600" y="530" text-anchor="middle"
      font-family="Arial, sans-serif" font-size="34" font-weight="700"
      letter-spacing="5" fill="#0032A0">COMING SOON · BETTERKABUGAO.ORG</text>
  </svg>
`);

await sharp({
  create: {
    width: 1200,
    height: 630,
    channels: 4,
    background: "#F4F7FB",
  },
})
  .composite([
    { input: logo, gravity: "center" },
    { input: label, left: 0, top: 0 },
  ])
  .png()
  .toFile("public/brand/betterkabugao-social.png");

console.log("SOCIAL_CARD_OK 1200x630");

const fs = require("fs");
const { createCanvas, loadImage } = require("canvas");
const images = fs.readdirSync(`./images/`).filter(file => file.endsWith('.png'));
run();

async function run() {
    const image2 = await loadImage("./cover.png");

    for (const image of images) {
        const image1 = await loadImage(`./images/${image}`);

        const canvas = createCanvas(image1.width, image1.height);
        const ctx = canvas.getContext('2d');

        ctx.drawImage(image1, 0, 0, image1.width, image1.height);

        ctx.globalCompositeOperation = "source-atop";

        ctx.drawImage(image2, 0, 0, image1.width, image1.height);

        fs.writeFileSync(`./replaced/${image}`, canvas.toBuffer());

    }
}
const fs = require("fs");
const { createCanvas, loadImage } = require("canvas");
main();
async function main() {
    const bases = fs.readdirSync("./base/").filter(file => file.endsWith(".png"));
    if (!bases[0]) return console.log("base Image not found");

    const protection1 = await loadImage("./ench/protection1.png");
    const protection2 = await loadImage("./ench/protection2.png");
    const protection3 = await loadImage("./ench/protection3.png");
    const protection4 = await loadImage("./ench/protection4.png");
    const protection5 = await loadImage("./ench/protection5.png");
    const protection = [protection1, protection2, protection3, protection4, protection5];
    const thorns = await loadImage("./ench/thorns.png");

    for (const base of bases) {
        const baseImage = await loadImage(`./base/${base}`);
        run(base, baseImage);
    }


    async function run(base, baseImage) {


        const enchants = [1, 5]; //Thorns, Protection

        loop([], 0, enchants, base, baseImage);

    }


    function loop(data, count, array, base, baseImage) {
        if (count === array.length) {
            generateImage(data, base, baseImage);
            return;
        }
        for (var i = 0; i < array[count] + 1; i++) {
            loop([...data, i], count + 1, array, base, baseImage);
        }
    }

    function generateImage(data, base, baseImage) {
        if (data.every(n => n === 0)) return;
        const hardData = data.map(n => 9 - n);

        const canvas = createCanvas(baseImage.width, baseImage.height);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(baseImage, 0, 0, baseImage.width, baseImage.height);

        if (data[1] !== 0) ctx.drawImage(protection[data[1] - 1], 0, 0, baseImage.width, baseImage.height);
        if (data[0] === 1) ctx.drawImage(thorns, 0, 0, baseImage.width, baseImage.height);

        fs.writeFileSync(`./replaced/${base.replace(/\.png$/, "") + "-" + hardData.join("-")}.png`, canvas.toBuffer());


        const slot = [4, 4];

        loopProperties([], 0, slot, data, base, baseImage);


        // if (data[1] !== 0) {
        //     for (var i = 0; i < protection.length; i++) {
        //         fs.writeFileSync(`./replaced/${base.replace(/.png$/, "") + "-" + hardData.join("-")}-sh${i}.properties`, [...text, `nbt.ench.${i}.id=16`, `nbt.ench.${i}.lvl=${data[1]}`].join("\n"));
        //     }
        // } else {
        //     fs.writeFileSync(`./replaced/${base.replace(/.png$/, "") + "-" + hardData.join("-")}.properties`, text.join("\n"));
        // }

    }

    function loopProperties(data, count, array, ench, base, baseImage) {
        if (count === array.length) {
            generateProperties(data, ench, base, baseImage);
            return;
        }
        for (var i = 0; i < array[count] + 1; i++) {
            loopProperties([...data, i], count + 1, array, ench, base, baseImage);
        }
    }

    function generateProperties(data, ench, base, baseImage) {
        if (data[0] === data[1]) return;
        const hardData = ench.map(n => 9 - n);
        const text = ["type=item",];
        if (base.match(/.*overlay.*/)) text.push(`items=minecraft:${base.replace(/\_overlay\.png$/, "")}`, `texture.${base.replace(/\.png$/, "")}=${base.replace(/\.png$/, "") + "-" + hardData.join("-")}`);
        else text.push(`items=minecraft:${base.replace(/\.png$/, "")}`, `texture=${base.replace(/\.png$/, "") + "-" + hardData.join("-")}`);
        text.push(`weight=${ench.reduce((a, b) => (a >= 1 ? 1 : 0) + (b >= 1 ? 1 : 0))}`);
        if (ench[0] !== 0) text.push(`nbt.ench.${data[0]}.id=7`);
        if (ench[1] !== 0) text.push(`nbt.ench.${data[1]}.id=0`, `nbt.ench.${data[1]}.lvl=${ench[1]}`);
        text.push("", "// Asterium by yuko1101, sapporo1101");
        fs.writeFileSync(`./replaced/${base.replace(/\.png$/, "")}-${hardData.join("-")}-${data.join("-")}.properties`, text.join("\n"));
    }
}
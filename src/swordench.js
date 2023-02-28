const fs = require("fs");
const { createCanvas, loadImage } = require("canvas");
main();
async function main() {
    const bases = fs.readdirSync("./base/").filter(file => file.endsWith(".png"));
    if (!bases[0]) return console.log("base Image not found");

    const fire_aspect = await loadImage("./ench/fire_aspect.png");
    const sharpness1 = await loadImage("./ench/sharpness1.png");
    const sharpness2 = await loadImage("./ench/sharpness2.png");
    const sharpness3 = await loadImage("./ench/sharpness3.png");
    const sharpness4 = await loadImage("./ench/sharpness4.png");
    const sharpness5 = await loadImage("./ench/sharpness5.png");
    const sharpness = [sharpness1, sharpness2, sharpness3, sharpness4, sharpness5];
    const knockback = await loadImage("./ench/knockback.png");

    for (const base of bases) {
        const baseImage = await loadImage(`./base/${base}`);
        run(base, baseImage);
    }


    async function run(base, baseImage) {


        const enchants = [1, 5, 1]; //Fire, Sharp, Knock

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

        if (data[2] === 1) ctx.drawImage(knockback, 0, 0, baseImage.width, baseImage.height);
        if (data[0] === 1) ctx.drawImage(fire_aspect, 0, 0, baseImage.width, baseImage.height);
        if (data[1] !== 0) ctx.drawImage(sharpness[data[1] - 1], 0, 0, baseImage.width, baseImage.height);

        fs.writeFileSync(`./replaced/${base.replace(/.png$/, "") + "-" + hardData.join("-")}.png`, canvas.toBuffer());


        const slot = [4, 4, 4];

        loopProperties([], 0, slot, data, base, baseImage);


        // if (data[1] !== 0) {
        //     for (var i = 0; i < sharpness.length; i++) {
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
        if (data[0] === data[1] || data[1] === data[2] || data[2] === data[0]) return;
        const hardData = ench.map(n => 9 - n);
        const text = ["type=item", `items=minecraft:${base.replace(/.png$/, "")}`, `texture=${base.replace(/.png$/, "") + "-" + hardData.join("-")}`];
        text.push(`weight=${ench.reduce((a, b) => (a >= 1 ? 1 : 0) + (b >= 1 ? 1 : 0))}`);
        if (ench[0] !== 0) text.push(`nbt.ench.${data[0]}.id=20`);
        if (ench[2] !== 0) text.push(`nbt.ench.${data[2]}.id=19`);
        if (ench[1] !== 0) text.push(`nbt.ench.${data[1]}.id=16`, `nbt.ench.${data[1]}.lvl=${ench[1]}`);
        text.push("", "// Asterium by yuko1101, sapporo1101");
        fs.writeFileSync(`./replaced/${base.replace(/.png$/, "")}-${hardData.join("-")}-${data.join("-")}.properties`, text.join("\n"));
    }
}
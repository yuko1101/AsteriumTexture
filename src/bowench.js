const fs = require("fs");
const { createCanvas, loadImage } = require("canvas");
main();
async function main() {
    const bases = fs.readdirSync("./base/").filter(file => file.endsWith(".png"));
    if (!bases[0]) return console.log("base Image not found");

    const flame1 = await loadImage("./ench/flame_standby.png");
    const flame2 = await loadImage("./ench/flame_pulling_0.png");
    const flame3 = await loadImage("./ench/flame_pulling_1.png");
    const flame4 = await loadImage("./ench/flame_pulling_2.png");
    const flame = [flame1, flame2, flame3, flame4];
    const string1 = await loadImage("./ench/string_standby.png");
    const string2 = await loadImage("./ench/string_pulling_0.png");
    const string3 = await loadImage("./ench/string_pulling_1.png");
    const string4 = await loadImage("./ench/string_pulling_2.png");
    const stringImage = [string1, string2, string3, string4];
    const power1 = await loadImage("./ench/power1.png");
    const power2 = await loadImage("./ench/power2.png");
    const power3 = await loadImage("./ench/power3.png");
    const power4 = await loadImage("./ench/power4.png");
    const power5 = await loadImage("./ench/power5.png");
    const power = [power1, power2, power3, power4, power5];
    const punch = await loadImage("./ench/punch.png");
    const infinity = await loadImage("./ench/infinity.png");
    const flamedInfinity = await loadImage("./ench/flamedInfinity.png");
    const infinity1 = await loadImage("./ench/infinity_pulling_0.png");
    const infinity2 = await loadImage("./ench/infinity_pulling_1.png");
    const infinity3 = await loadImage("./ench/infinity_pulling_2.png");
    const infinities = [infinity1, infinity2, infinity3];

    for (const base of bases) {
        const baseImage = await loadImage(`./base/${base}`);
        run(base, baseImage);
    }


    async function run(base, baseImage) {


        const enchants = [1, 5, 1, 1]; //Flame, Power, Punch, Infinity

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

        if (data[3] !== 0 && base === "bow_standby.png") {
            generateInfinity(data, base, baseImage);
            return;
        }

        const hardData = data.map(n => 9 - n);

        const canvas = createCanvas(baseImage.width, baseImage.height);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(baseImage, 0, 0, baseImage.width, baseImage.height);
        if (data[0] === 1) {

            const flameEnch = base === "bow_standby.png" ? 0 :
                base === "bow_pulling_0.png" ? 1 :
                    base === "bow_pulling_1.png" ? 2 :
                        base === "bow_pulling_2.png" ? 3 : 0;
            ctx.globalCompositeOperation = "xor";
            ctx.drawImage(stringImage[flameEnch], 0, 0, baseImage.width, baseImage.height);
            ctx.globalCompositeOperation = "source-over";
            ctx.drawImage(flame[flameEnch], 0, 0, baseImage.width, baseImage.height);
        } else if (data[3] !== 0) {
            const infinityEnch =
                base === "bow_pulling_0.png" ? 0 :
                    base === "bow_pulling_1.png" ? 1 :
                        base === "bow_pulling_2.png" ? 2 : 0;
            ctx.globalCompositeOperation = "xor";
            ctx.drawImage(stringImage[infinityEnch + 1], 0, 0, baseImage.width, baseImage.height);
            ctx.globalCompositeOperation = "source-over";
            ctx.drawImage(infinities[infinityEnch], 0, 0, baseImage.width, baseImage.height);
        }
        if (data[2] === 1 && base === "bow_standby.png") ctx.drawImage(punch, 0, 0, baseImage.width, baseImage.height);
        if (data[1] !== 0) ctx.drawImage(power[data[1] - 1], 0, 0, baseImage.width, baseImage.height);

        fs.writeFileSync(`./replaced/${base.replace(/\.png$/, "") + "-" + hardData.join("-")}.png`, canvas.toBuffer());


        const slot = [4, 4, 4, 4];


        if (base === "bow_standby.png") loopProperties([], 0, slot, data, base, baseImage);


        // if (data[1] !== 0) {
        //     for (var i = 0; i < power.length; i++) {
        //         fs.writeFileSync(`./replaced/${base.replace(/.png$/, "") + "-" + hardData.join("-")}-sh${i}.properties`, [...text, `nbt.ench.${i}.id=16`, `nbt.ench.${i}.lvl=${data[1]}`].join("\n"));
        //     }
        // } else {
        //     fs.writeFileSync(`./replaced/${base.replace(/.png$/, "") + "-" + hardData.join("-")}.properties`, text.join("\n"));
        // }

    }

    function generateInfinity(data, base, baseImage) {
        const canvas = createCanvas(infinity.width, infinity.height);
        const hardData = data.map(n => 9 - n);

        const ctx = canvas.getContext('2d');

        const amount = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];

        for (const i of amount) {
            ctx.globalCompositeOperation = "source-over";
            ctx.drawImage(baseImage, 0, i * 16, baseImage.width, baseImage.height);
            ctx.globalCompositeOperation = "xor";
            ctx.drawImage(string1, 0, i * 16, baseImage.width, baseImage.height);
            ctx.globalCompositeOperation = "source-over";
            if (data[2] === 1) ctx.drawImage(punch, 0, i * 16, baseImage.width, baseImage.height);
            if (data[1] !== 0) ctx.drawImage(power[data[1] - 1], 0, i * 16, baseImage.width, baseImage.height);
        }

        if (data[0] === 0) {
            ctx.drawImage(infinity, 0, 0, infinity.width, infinity.height);
        } else {
            ctx.drawImage(flamedInfinity, 0, 0, infinity.width, infinity.height);
        }

        fs.writeFileSync(`./replaced/${base.replace(/\.png$/, "") + "-" + hardData.join("-")}.png`, canvas.toBuffer());

        const slot = [4, 4, 4, 4];


        loopProperties([], 0, slot, data, base, baseImage);
        createMcmeta(`${base.replace(/\.png$/, "") + "-" + hardData.join("-")}.png`);
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
        if (!isUniq(data)) return;
        const hardData = ench.map(n => 9 - n);
        const text = ["type=item", `items=minecraft:bow`, `texture.bow_standby=${base.replace(/\.png$/, "") + "-" + hardData.join("-")}`, `texture.bow_pulling_0=${base.replace(/\_standby\.png$/, "") + "_pulling_0" + "-" + hardData.join("-")}`, `texture.bow_pulling_1=${base.replace(/\_standby\.png$/, "") + "_pulling_1" + "-" + hardData.join("-")}`, `texture.bow_pulling_2=${base.replace(/\_standby\.png$/, "") + "_pulling_2" + "-" + hardData.join("-")}`];
        text.push(`weight=${ench.reduce((a, b) => (a >= 1 ? 1 : 0) + (b >= 1 ? 1 : 0))}`);
        if (ench[0] !== 0) text.push(`nbt.ench.${data[0]}.id=50`);
        if (ench[2] !== 0) text.push(`nbt.ench.${data[2]}.id=49`);
        if (ench[3] !== 0) text.push(`nbt.ench.${data[3]}.id=51`);
        if (ench[1] !== 0) text.push(`nbt.ench.${data[1]}.id=48`, `nbt.ench.${data[1]}.lvl=${ench[1]}`);
        text.push("", "// Asterium by yuko1101, sapporo1101");
        fs.writeFileSync(`./replaced/${base.replace(/\_standby\.png$/, "")}-${hardData.join("-")}-${data.join("-")}.properties`, text.join("\n"));
    }

    function isUniq(array) {
        return array.every((value, index, self) => self.indexOf(value) === index);
    }

    function createMcmeta(name) {
        fs.writeFileSync(`./replaced/${name}.mcmeta`, `{"animation": {"frametime": 1}}`);
    }
}
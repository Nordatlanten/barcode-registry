//please seed
import fs from "fs";
import { execSync } from 'node:child_process';
import * as readline from 'node:readline/promises';
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient();
const inputReader = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

async function inputPrompt(prompt: string, yesFunction: Function, noFunction: Function) {
    do {
        const answer = await inputReader.question(prompt);
        console.log("???", answer);
        console.log(answer.localeCompare("y", undefined, { sensitivity: 'base' }))
        if (!answer.localeCompare("y", undefined, { sensitivity: 'base' }) || !answer.localeCompare("yes", undefined, { sensitivity: 'base' })) { //localecompare returns 0 when equals, so need to use a !
            await yesFunction();
            break;
        }
        if (!answer.localeCompare("n", undefined, { sensitivity: 'base' }) || !answer.localeCompare("no", undefined, { sensitivity: 'base' })) { //localecompare returns 0 when equals, so need to use a !
            await noFunction();
            break;
        }
        else {
            console.log("oh okay");
        }

    } while (true)
}

async function resetDatabase() {
    try {
        console.log("Resetting database.");
        const execResult = execSync("npx prisma db push --force-reset", { stdio: 'inherit' });
        console.log(execResult);
    } catch (error) {
        console.log("Error while resetting database: " + (error as Error).toString());
    }
    try {
        console.log("Generating client data.");
        const execResult = execSync("npx prisma generate", { stdio: 'inherit' });
        console.log(execResult);
    } catch (error) {
        console.log("Error while creating client data: " + (error as Error).toString());
    }
}

async function seedDatabase() {
    try {
        const data = fs.readFileSync("prisma/seeding-data.json", "utf8");
        const seedingData = JSON.parse(data);
        // console.log(seedingData);
        if (!!seedingData["categories"]) {
            for (let cat in seedingData["categories"]) {
                let catData = seedingData["categories"][cat];
                await prisma.category.create({
                    data: {
                        title: catData["title"],
                    },
                })
            }
            if (!!seedingData["subcategories"]) {
                for (let subcat in seedingData["subcategories"]) {
                    let subCatData = seedingData["subcategories"][subcat];
                    console.log(subCatData);
                    await prisma.subcategory.create({
                        data: {
                            title: subCatData["title"],
                            category: {
                                connect: { title: subCatData["category"] }
                            }
                        },
                    })
                }
            }
        }

        if (!!seedingData["products"]) {
            for (let prod in seedingData["products"]) {
                let prodData = seedingData["products"][prod];
                await prisma.product.create({
                    data: {
                        name: prodData.name,
                        barcode: prodData.barcode,
                        price: prodData.price,
                        category: {
                            connect: { title: prodData.category }
                        },
                        subcategory: {
                            connect: { title: prodData.subcategory }
                        }
                    },
                })
            }
        }
    }
    catch (error) {
        console.log("Unable to parse seeding data:", error);
        return false;
    }
}


inputPrompt("Reset database before reseeding?", resetDatabase, () => { }).then(returned => {
    console.log("??");
    inputPrompt("Seed database?", seedDatabase, () => { }).then(returned => {
        process.exit();
    })
});


// seedDatabase().then(returned => {
//     console.log("Done seeding!");
// }).catch(error => {
//     console.log("Seeding failed!");
// })
window.FreshDrinkCatalog = Object.freeze({
    storageKey: "fresh-drink-products",
    imageMigrationKey: "fresh-drink-thai-tea-image-v1",
    matchaImageMigrationKey: "fresh-drink-matcha-image-v1",
    pinkMilkImageMigrationKey: "fresh-drink-pink-milk-image-v1",
    icedCoffeeImageMigrationKey: "fresh-drink-iced-coffee-image-v1",
    orangeJuiceImageMigrationKey: "fresh-drink-orange-juice-image-v1",
    strawberrySodaImageMigrationKey: "fresh-drink-strawberry-soda-image-v1",
    limeSodaImageMigrationKey: "fresh-drink-lime-soda-image-v1",
    newDrinksMigrationKey: "fresh-drink-additional-menus-v1",
    cocoaMintImageMigrationKey: "fresh-drink-cocoa-mint-image-v1",
    blueHawaiiImageMigrationKey: "fresh-drink-blue-hawaii-image-v1",
    lemonTeaImageMigrationKey: "fresh-drink-lemon-tea-image-v1",
    defaults: [
        {
            id: 1,
            name: "ชาไทย",
            price: 35,
            image: "images/thai-tea.png"
        },
        {
            id: 2,
            name: "ชาเขียวมัทฉะ",
            price: 45,
            image: "images/green-matcha.png"
        },
        {
            id: 3,
            name: "นมชมพู",
            price: 35,
            image: "images/pink-milk.png"
        },
        {
            id: 4,
            name: "กาแฟเย็น",
            price: 40,
            image: "images/iced-coffee.png"
        },
        {
            id: 5,
            name: "โกโก้เย็น",
            price: 40,
            image: "https://images.unsplash.com/photo-1542990253-0b8be4f5f9a2?auto=format&fit=crop&w=600&q=80"
        },
        {
            id: 6,
            name: "น้ำส้ม",
            price: 35,
            image: "images/orange-juice.png"
        },
        {
            id: 7,
            name: "สตรอว์เบอร์รีโซดา",
            price: 40,
            image: "images/strawberry-soda.png"
        },
        {
            id: 8,
            name: "มะนาวโซดา",
            price: 35,
            image: "images/lime-soda.png"
        },
        {
            id: 9,
            name: "ชานมไต้หวันไข่มุก",
            price: 45,
            image: "images/thai-tea.png"
        },
        {
            id: 10,
            name: "ชามะนาว",
            price: 35,
            image: "images/lemon-tea.png"
        },
        {
            id: 11,
            name: "ชาพีช",
            price: 40,
            image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=600&q=80"
        },
        {
            id: 12,
            name: "นมสดคาราเมล",
            price: 45,
            image: "images/iced-coffee.png"
        },
        {
            id: 13,
            name: "มอคค่าเย็น",
            price: 45,
            image: "images/iced-coffee.png"
        },
        {
            id: 14,
            name: "โกโก้มิ้นต์",
            price: 45,
            image: "images/cocoa-mint.png"
        },
        {
            id: 15,
            name: "น้ำแตงโมปั่น",
            price: 45,
            image: "images/strawberry-soda.png"
        },
        {
            id: 16,
            name: "น้ำสับปะรด",
            price: 40,
            image: "images/orange-juice.png"
        },
        {
            id: 17,
            name: "น้ำองุ่นโซดา",
            price: 40,
            image: "images/strawberry-soda.png"
        },
        {
            id: 18,
            name: "บลูฮาวายโซดา",
            price: 40,
            image: "images/blue-hawaii.png"
        }
    ],
    read: function () {
        const saved = localStorage.getItem(this.storageKey);

        if (saved === null) {
            return this.defaults.map(product => ({ ...product }));
        }

        let products = JSON.parse(saved);
        const valid = Array.isArray(products) && products.every(product =>
            product &&
            Number.isInteger(product.id) &&
            typeof product.name === "string" &&
            Number.isFinite(product.price) &&
            typeof product.image === "string"
        );

        if (!valid) {
            throw new Error("ข้อมูลเมนูที่บันทึกไว้ไม่ถูกต้อง");
        }

        if (localStorage.getItem(this.imageMigrationKey) !== "done") {
            const thaiTeaImage = this.defaults.find(product => product.id === 1).image;
            const updatedProducts = products.map(product =>
                product.id === 1 ? { ...product, image: thaiTeaImage } : product
            );
            this.write(updatedProducts);
            localStorage.setItem(this.imageMigrationKey, "done");
            products = updatedProducts;
        }

        if (localStorage.getItem(this.matchaImageMigrationKey) !== "done") {
            const matchaImage = this.defaults.find(product => product.id === 2).image;
            const updatedProducts = products.map(product =>
                product.id === 2 ? { ...product, image: matchaImage } : product
            );
            this.write(updatedProducts);
            localStorage.setItem(this.matchaImageMigrationKey, "done");
            products = updatedProducts;
        }

        if (localStorage.getItem(this.pinkMilkImageMigrationKey) !== "done") {
            const pinkMilkImage = this.defaults.find(product => product.id === 3).image;
            const updatedProducts = products.map(product =>
                product.id === 3 ? { ...product, image: pinkMilkImage } : product
            );
            this.write(updatedProducts);
            localStorage.setItem(this.pinkMilkImageMigrationKey, "done");
            products = updatedProducts;
        }

        if (localStorage.getItem(this.icedCoffeeImageMigrationKey) !== "done") {
            const icedCoffeeImage = this.defaults.find(product => product.id === 4).image;
            const updatedProducts = products.map(product =>
                product.id === 4 ? { ...product, image: icedCoffeeImage } : product
            );
            this.write(updatedProducts);
            localStorage.setItem(this.icedCoffeeImageMigrationKey, "done");
            products = updatedProducts;
        }

        if (localStorage.getItem(this.orangeJuiceImageMigrationKey) !== "done") {
            const orangeJuiceImage = this.defaults.find(product => product.id === 6).image;
            const updatedProducts = products.map(product =>
                product.id === 6 ? { ...product, image: orangeJuiceImage } : product
            );
            this.write(updatedProducts);
            localStorage.setItem(this.orangeJuiceImageMigrationKey, "done");
            products = updatedProducts;
        }

        if (localStorage.getItem(this.strawberrySodaImageMigrationKey) !== "done") {
            const strawberrySodaImage = this.defaults.find(product => product.id === 7).image;
            const updatedProducts = products.map(product =>
                product.id === 7 ? { ...product, image: strawberrySodaImage } : product
            );
            this.write(updatedProducts);
            localStorage.setItem(this.strawberrySodaImageMigrationKey, "done");
            products = updatedProducts;
        }

        if (localStorage.getItem(this.limeSodaImageMigrationKey) !== "done") {
            const limeSodaImage = this.defaults.find(product => product.id === 8).image;
            const updatedProducts = products.map(product =>
                product.id === 8 ? { ...product, image: limeSodaImage } : product
            );
            this.write(updatedProducts);
            localStorage.setItem(this.limeSodaImageMigrationKey, "done");
            products = updatedProducts;
        }

        if (localStorage.getItem(this.newDrinksMigrationKey) !== "done") {
            const existingNames = new Set(products.map(product =>
                product.name.trim().toLocaleLowerCase("th-TH")
            ));
            let nextId = products.reduce((largestId, product) =>
                Math.max(largestId, product.id), 0
            );
            const additions = this.defaults
                .filter(product => product.id >= 9)
                .filter(product => !existingNames.has(product.name.trim().toLocaleLowerCase("th-TH")))
                .map(product => ({ ...product, id: ++nextId }));

            if (additions.length > 0) {
                products = [...products, ...additions];
                this.write(products);
            }
            localStorage.setItem(this.newDrinksMigrationKey, "done");
        }

        if (localStorage.getItem(this.cocoaMintImageMigrationKey) !== "done") {
            const cocoaMintImage = this.defaults.find(product => product.name === "โกโก้มิ้นต์").image;
            const updatedProducts = products.map(product =>
                product.name === "โกโก้มิ้นต์" ? { ...product, image: cocoaMintImage } : product
            );
            this.write(updatedProducts);
            localStorage.setItem(this.cocoaMintImageMigrationKey, "done");
            products = updatedProducts;
        }

        if (localStorage.getItem(this.blueHawaiiImageMigrationKey) !== "done") {
            const blueHawaiiImage = this.defaults.find(product => product.name === "บลูฮาวายโซดา").image;
            const updatedProducts = products.map(product =>
                product.name === "บลูฮาวายโซดา" ? { ...product, image: blueHawaiiImage } : product
            );
            this.write(updatedProducts);
            localStorage.setItem(this.blueHawaiiImageMigrationKey, "done");
            products = updatedProducts;
        }

        if (localStorage.getItem(this.lemonTeaImageMigrationKey) !== "done") {
            const lemonTeaImage = this.defaults.find(product => product.name === "ชามะนาว").image;
            const updatedProducts = products.map(product =>
                product.name === "ชามะนาว" ? { ...product, image: lemonTeaImage } : product
            );
            this.write(updatedProducts);
            localStorage.setItem(this.lemonTeaImageMigrationKey, "done");
            products = updatedProducts;
        }

        return products;
    },
    write: function (products) {
        localStorage.setItem(this.storageKey, JSON.stringify(products));
    },
    escapeHtml: function (value) {
        return String(value).replace(/[&<>"']/g, character => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        })[character]);
    }
});

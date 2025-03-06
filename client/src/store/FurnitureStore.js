import { makeAutoObservable } from "mobx";
import img1 from "../assets/images/products/bedroom/грация.jpg";
import img2 from "../assets/images/products/kitchen/кухня.jpg";
import img3 from "../assets/images/products/bedroom/кровать.jpg";
import img4 from "../assets/images/products/tables−and−chairs/стол.jpg";
import img5 from "../assets/images/products/upholstered−furniture/диван.jpg";

export default class FurnitureStore {
    constructor() {
        this._types = [
            { id: 1, name: "Спальни" },
            { id: 2, name: "Кухни" }
        ];
        this._manufacturers = [
            { id: 1, name: "Арида" },
            { id: 2, name: "Milana group" },
        ];
        this._furnitures = [
            {
                id: 1,
                name: "Спальня виктория",
                price: 130000,
                rating: 1,
                reviewsCount: 12,
                new: true,
                img: img1,
                category: "bedroom",
                manufacturer: "арида",
            },
            {
                id: 2,
                name: "Кухня Джоконда",
                price: 120000,
                rating: 4,
                reviewsCount: 12,
                new: true,
                img: img2,
                category: "kitchen",
                manufacturer: "Арида",
            },
            {
                id: 3,
                name: "Кровать Версаль",
                price: 10000,
                rating: 3.5,
                reviewsCount: 12,
                new: true,
                img: img3,
                categories: ["bedroom", "bed"],
                manufacturer: "Milana group",
            },
            {
                id: 4,
                name: "Стол стулович",
                price: 30000,
                rating: 3,
                reviewsCount: 12,
                new: false,
                img: img4,
                category: "tables",
                manufacturer: "Арида",
            },
            {
                id: 5,
                name: "Диван креслович",
                price: 100000,
                rating: 5,
                reviewsCount: 12,
                new: true,
                img: img5,
                category: "sofas",
                manufacturer: "Арида",
            },
            {
                id: 6,
                name: "Кровать Версаль",
                price: 10000,
                rating: 3.5,
                reviewsCount: 12,
                new: true,
                img: img3,
                categories: ["bedroom", "bed"],
                manufacturer: "скфм"
            },
            {
                id: 7,
                name: "Кровать Версаль",
                price: 10000,
                rating: 3.5,
                reviewsCount: 14,
                new: true,
                img: img3,
                categories: ["bedroom", "bed"],
                manufacturer: "фортуна"
            },
            {
                id: 8,
                name: "Кровать Версаль",
                price: 15000,
                rating: 3.5,
                reviewsCount: 19,
                new: true,
                img: img3,
                categories: ["bedroom", "bed"],
                manufacturer: "милана"
            },
            {
                id: 9,
                name: "Кровать Версаль",
                price: 80000,
                rating: 3.5,
                reviewsCount: 12,
                new: true,
                img: img3,
                categories: ["bedroom", "bed"],
                manufacturer: "эра"
            },
        ];
        makeAutoObservable(this);
    }

    setTypes(types) {
        this._types = types;
    }

    setManufacturers(manufacturers) {
        this._manufacturers = manufacturers;
    }

    setFurnitures(furnitures) {
        this._furnitures = furnitures;
    }

    get Types() {
        return this._types;
    }

    get Manufacturers() {
        return this._manufacturers;
    }

    get Furnitures() {
        return this._furnitures;
    }
}

const sequelize = require("../db");
const { DataTypes } = require("sequelize");

const User = sequelize.define("user", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING, unique: true },
    password: { type: DataTypes.STRING, unique: true },
    role: { type: DataTypes.STRING, defaultValue: "USER" },
});

const Basket = sequelize.define("basket", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

const BasketFurniture = sequelize.define("basket_furniture", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

const Favorites = sequelize.define("favorites", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

const FavoritesFurniture = sequelize.define("favorites_furniture", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

const Furniture = sequelize.define("furniture", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.INTEGER, allowNull: false },
    rating: { type: DataTypes.INTEGER, defaultValue: 0 },
    reviewsCount: { type: DataTypes.INTEGER, defaultValue: 0 },
    new: { type: DataTypes.BOOLEAN, allowNull: true },
    img: { type: DataTypes.STRING, allowNull: false },
});

const Type = sequelize.define("type", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
});

const Manufacturer = sequelize.define("manufacturer", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
});

const FurnitureInfo = sequelize.define("furniture_info", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: false },
});

const Rating = sequelize.define("rating", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    rate: { type: DataTypes.INTEGER, allowNull: false },
    review: { type: DataTypes.TEXT, allowNull: true },
    name: { type: DataTypes.STRING, allowNull: false },
});

const FurnitureType = sequelize.define("furniture_type", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

const TypeManufacturer = sequelize.define("type_manufacturer", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

User.hasOne(Basket);
Basket.belongsTo(User);

User.hasOne(Favorites);
Favorites.belongsTo(User);

User.hasMany(Rating);
Rating.belongsTo(User);

Basket.hasMany(BasketFurniture);
BasketFurniture.belongsTo(Basket);

Favorites.hasMany(FavoritesFurniture);
FavoritesFurniture.belongsTo(Favorites);

BasketFurniture.hasOne(Furniture);
Furniture.belongsTo(BasketFurniture);

FavoritesFurniture.hasMany(Furniture);
Furniture.belongsTo(FavoritesFurniture);

Furniture.hasMany(FurnitureInfo, { as: "info" });
FurnitureInfo.belongsTo(Furniture);

Furniture.belongsToMany(Type, { through: FurnitureType });
Type.belongsToMany(Furniture, { through: FurnitureType });

Type.belongsToMany(Manufacturer, { through: TypeManufacturer });
Manufacturer.belongsToMany(Type, { through: TypeManufacturer });

Manufacturer.hasMany(Furniture);
Furniture.belongsTo(Manufacturer);

Furniture.hasMany(Rating);
Rating.belongsTo(Furniture);

module.exports = {
    User,
    Basket,
    BasketFurniture,
    Favorites,
    FavoritesFurniture,
    Furniture,
    Type,
    Manufacturer,
    FurnitureInfo,
    TypeManufacturer,
    FurnitureType,
    Rating,
};
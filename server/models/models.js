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
    quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 }
});

const Favorites = sequelize.define("favorites", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

const FavoritesFurniture = sequelize.define("favorites_furniture", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    furnitureId: { type: DataTypes.INTEGER, allowNull: false },
    favoritesId: { type: DataTypes.INTEGER, allowNull: false }
});

const Furniture = sequelize.define("furniture", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.INTEGER, allowNull: false },
    rating: { type: DataTypes.FLOAT, defaultValue: 0 },
    reviewsCount: { type: DataTypes.INTEGER, defaultValue: 0 },
    new: { type: DataTypes.BOOLEAN, allowNull: true },
    img: { type: DataTypes.STRING, allowNull: true },
    subTypeId: { type: DataTypes.INTEGER, allowNull: true },
    hidden: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
});

const Type = sequelize.define("type", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    icon: { type: DataTypes.STRING, allowNull: true },
});

const SubType = sequelize.define('subtype', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false }
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
    furnitureId: {type: DataTypes.INTEGER, allowNull: false},
});

const FurnitureType = sequelize.define("furniture_type", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

const TypeManufacturer = sequelize.define("type_manufacturer", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

const Question = sequelize.define("question", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    question: { type: DataTypes.TEXT, allowNull: false },
});

const MeasurerRequest = sequelize.define("measurer_request", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    contact: { type: DataTypes.STRING, allowNull: false },
    message: { type: DataTypes.TEXT, allowNull: false },
}, {
    tableName: 'measurer_requests'
});

const Order = sequelize.define("order", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    fullName: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    contactPhone: { type: DataTypes.STRING, allowNull: false },
    additionalInfo: { type: DataTypes.TEXT, allowNull: true },
    deliveryMethod: { type: DataTypes.STRING, allowNull: false },
    deliveryPhone: { type: DataTypes.STRING, allowNull: true },
    deliveryPostalCode: { type: DataTypes.STRING, allowNull: true },
    deliveryAddress: { type: DataTypes.TEXT, allowNull: true },
    totalPrice: { type: DataTypes.INTEGER, allowNull: false },
    status: { type: DataTypes.STRING, defaultValue: "Новый" },
    orderDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    userId: { type: DataTypes.INTEGER, allowNull: true },
});

const OrderItem = sequelize.define("order_item", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    price: { type: DataTypes.INTEGER, allowNull: false },
    orderId: { type: DataTypes.INTEGER, allowNull: false },
    furnitureId: { type: DataTypes.INTEGER, allowNull: false }
});

const FurnitureImg = sequelize.define('furniture_img', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    img: { type: DataTypes.STRING, allowNull: false },
    order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 }
});

Furniture.hasMany(FurnitureImg, { as: 'images' });
FurnitureImg.belongsTo(Furniture);

User.hasOne(Basket);
Basket.belongsTo(User);

User.hasOne(Favorites);
Favorites.belongsTo(User);

User.hasMany(Rating);
Rating.belongsTo(User);

Basket.hasMany(BasketFurniture);
BasketFurniture.belongsTo(Basket);

Favorites.hasMany(FavoritesFurniture, { foreignKey: 'favoritesId' });
FavoritesFurniture.belongsTo(Favorites, { foreignKey: 'favoritesId' });
FavoritesFurniture.belongsTo(Furniture, { foreignKey: 'furnitureId' });

BasketFurniture.hasOne(Furniture);
Furniture.belongsTo(BasketFurniture);

Furniture.hasMany(FurnitureInfo, { as: "info" });
FurnitureInfo.belongsTo(Furniture);

Furniture.belongsToMany(Type, { through: FurnitureType });
Type.belongsToMany(Furniture, { through: FurnitureType });

Type.belongsToMany(Manufacturer, { through: TypeManufacturer });
Manufacturer.belongsToMany(Type, { through: TypeManufacturer });

Type.hasMany(SubType, { as: 'subtypes' });
SubType.belongsTo(Type);

Furniture.belongsTo(SubType, { as: 'subtype', foreignKey: 'subTypeId' });
SubType.hasMany(Furniture, { foreignKey: 'subTypeId' });

Manufacturer.hasMany(Furniture);
Furniture.belongsTo(Manufacturer);

Furniture.hasMany(Rating, { as: 'reviews', foreignKey: 'furnitureId' });
Rating.belongsTo(Furniture, { as: 'furniture', foreignKey: 'furnitureId' });

Order.hasMany(OrderItem);
OrderItem.belongsTo(Order);

Furniture.hasMany(OrderItem);
OrderItem.belongsTo(Furniture);

User.hasMany(Order);
Order.belongsTo(User);

module.exports = {
    User,
    Basket,
    BasketFurniture,
    Favorites,
    FavoritesFurniture,
    Furniture,
    Type,
    SubType,
    Manufacturer,
    FurnitureInfo,
    TypeManufacturer,
    FurnitureType,
    Rating,
    Question,
    MeasurerRequest,
    Order,
    OrderItem,
    FurnitureImg
};


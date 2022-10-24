"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const ConfigTypes_1 = require("C:/snapshot/project/obj/models/enums/ConfigTypes");
// The new trader config
const baseJson = __importStar(require("../db/base.json"));
class SampleTrader {
    constructor() {
        this.mod = "13AddTrader";
    }
    preAkiLoad(container) {
        this.logger = container.resolve("WinstonLogger");
        this.logger.debug(`[${this.mod}] Loading... `);
        this.registerProfileImage(container);
        this.setupTraderUpdateTime(container);
        this.logger.debug(`[${this.mod}] Loaded`);
    }
    postDBLoad(container) {
        this.logger.debug(`[${this.mod}] Delayed Loading... `);
        const databaseServer = container.resolve("DatabaseServer");
        const jsonUtil = container.resolve("JsonUtil");
        // Keep a reference to the tables
        const tables = databaseServer.getTables();
        // Add the new trader to the trader lists in DatabaseServer
        tables.traders[baseJson._id] = {
            assort: this.createAssortTable(),
            base: jsonUtil.deserialize(jsonUtil.serialize(baseJson)),
            questassort: undefined
        };
        // For each language, add locale for the new trader
        const locales = Object.values(tables.locales.global);
        for (const locale of locales) {
            locale.trading[baseJson._id] = {
                FullName: baseJson.name,
                FirstName: "K-9",
                Nickname: baseJson.nickname,
                Location: baseJson.location,
                Description: "He sells cases, only it"
            };
        }
        this.logger.debug(`[${this.mod}] Delayed Loaded`);
    }
    registerProfileImage(container) {
        // Reference the mod "res" folder
        const preAkiModLoader = container.resolve("PreAkiModLoader");
        const imageFilepath = `./${preAkiModLoader.getModPath(this.mod)}res`;
        // Register route pointing to the profile picture
        const imageRouter = container.resolve("ImageRouter");
        imageRouter.addRoute(baseJson.avatar.replace(".jpg", ""), `${imageFilepath}/cat.jpg`);
    }
    setupTraderUpdateTime(container) {
        // Add refresh time in seconds when Config server allows to set configs
        const configServer = container.resolve("ConfigServer");
        const traderConfig = configServer.getConfig(ConfigTypes_1.ConfigTypes.TRADER);
        const traderRefreshConfig = { traderId: baseJson._id, seconds: 3600 };
        traderConfig.updateTime.push(traderRefreshConfig);
    }
    createAssortTable() {
        // Assort table
        const assortTable = {
            nextResupply: 86400,
            items: [],
            barter_scheme: {},
            loyal_level_items: {}
        };
        // Keep reference of a few IDs
        const MILK_ID = "575146b724597720a27126d5";
        const ALPHA_ID = "544a11ac4bdc2d470e8b456a";
        const BETA_ID = "5857a8b324597729ab0a0e7d";
        const EPSILON_ID = "59db794186f77448bc595262";
        const GAMMA_ID = "5857a8bc2459772bad15db29";
        const KAPPA_ID = "5c093ca986f7740a1867ab12";
        const ROUBLE_ID = "5449016a4bdc2d6f028b456f";
        // Define item in the table
        const newMilkItem = {
            _id: MILK_ID,
            _tpl: MILK_ID,
            parentId: "hideout",
            slotId: "hideout",
            upd: {
                UnlimitedCount: true,
                StackObjectsCount: 999999999
            }
        };
        assortTable.items.push(newMilkItem);
        // Define the item price to be 1 RUB
        assortTable.barter_scheme[MILK_ID] = [
            [
                {
                    count: 1,
                    _tpl: ROUBLE_ID
                }
            ]
        ];
        // Unlockable at level 1 (from the start)
        assortTable.loyal_level_items[MILK_ID] = 1;
        return assortTable;
        const AlphaContainer = {
            _id: ALPHA_ID,
            _tpl: ALPHA_ID,
            parentId: "hideout",
            slotId: "hideout",
            upd: {
                UnlimitedCount: false,
                StackObjectsCount: 1
            }
        };
        assortTable.items.push(AlphaContainer);
        assortTable.barter_scheme[ALPHA_ID] = [
            [
                {
                    count: 500000,
                    _tpl: ROUBLE_ID
                }
            ]
        ];
        assortTable.loyal_level_items[ALPHA_ID] = 1;
        return assortTable;
    }
}
module.exports = { mod: new SampleTrader() };

const { DataSource } = require("typeorm");
const UserSchema = require("../models/user.entity");
const TicketSchema = require("../models/ticket.entity");
const TagSchema = require("../models/tag.entity");

// Configuration centralisée
const AppDataSource = new DataSource({
  type: "sqlite",                 // Type de base
  database: "database.sqlite",    // Fichier SQLite créé automatiquement
  synchronize: true,              // Crée les tables automatiquement (à éviter en prod)
  logging: true,                  // Affiche les requêtes SQL
  entities: [UserSchema, TicketSchema, TagSchema], // Chemin vers tes entités
});

module.exports = AppDataSource;

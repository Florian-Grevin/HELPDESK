const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
    name: "Ticket",
    tableName: "ticket",
    columns: {
    id: {
        primary: true,
        type: "int",
        generated: true,
    },
    title: {
        type: "varchar",
    },
    description: {
        type: "varchar",
    },
    status: {
        type: "varchar",
        default: "OPEN"
    },
    priority: {
        type: "varchar",
        default: "LOW"
    }
    },
    relations: {
        user: {
            type: "many-to-one",
            target: "User",
            joinColumn: true,
            inverseSide: "ticket"
        },
        tags: {
            type: "many-to-many",
            target: "Tag",
            inverseSide: "tickets"
        }
    }
});
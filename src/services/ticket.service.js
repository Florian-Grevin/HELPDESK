const TicketModel = require('../models/ticket.entity');
const { ValidationError, NotFoundError } = require('../errors/ApiError');
const AppDataSource = require('../config/data-source');
const UserService = require('./user.service');
const TagService = require('./tag.service');
const {In} = require('typeorm');


class TicketService {
    constructor() { 
        this.ticketRepository = AppDataSource.getRepository("Ticket");
        this.tagRepository = AppDataSource.getRepository("Tag");
    }

    //Bonus QueryBuilder : Ajoutez un filtre ?status=OPEN dans l'URL 
    // pour filtrer les résultats.
    async findAll(user) {
        console.log(user)
        if (user.role == "CLIENT") {
            return await this.ticketRepository.find({
            where: { user: { id: user.id } },
            relations: { tags: true, user: true }
            });
        } else {
            return await this.ticketRepository.find({
            relations: { tags: true, user: true  }
            });
        }
    }

    async findAllTicketWithoutTags() {
        return await this.ticketRepository
        .createQueryBuilder("ticket")
        .leftJoinAndSelect("ticket.tags", "tag")
        .leftJoinAndSelect("ticket.user", "user")
        .where("tag.id IS NULL")
        .getMany();
    }

    async create(data, userId) {
        if (!data.title || data.title.trim() === "") {
            throw new ValidationError("Le titre est obligatoire");
        }

        const user = await UserService.findById(userId);
        if (!user) {
            throw new NotFoundError("L'utilisateur n'existe pas");
        }

        let tagEntities = [];
        if (Array.isArray(data.tags) && data.tags.length > 0) {
            // Extraire uniquement les labels
            const labels = data.tags.map(t => t.label);

            const existingTags = await this.tagRepository.findBy({ label: In(labels) });
            const existingLabels = existingTags.map(t => t.label);

            const newLabels = labels.filter(label => !existingLabels.includes(label));
            const newTags = newLabels.map(label => this.tagRepository.create({ label }));
            await this.tagRepository.save(newTags);

            tagEntities = [...existingTags, ...newTags];
        }

        const ticket = this.ticketRepository.create({
            title: data.title,
            description: data.description || "", // éviter NOT NULL
            priority: data.priority || "LOW",
            user: { id: userId },
            tags: tagEntities,
            status: "OPEN",
        });

        await this.ticketRepository.save(ticket);
        return ticket;
    }

    async updateStatus(id, status) {
        const ticket = await this.ticketRepository.findOneBy({ id });
        if (!ticket) {
            throw new NotFoundError("Ticket not found");
        }

        ticket.status = status;
        await this.ticketRepository.save(ticket);
        return ticket;
    }

}

const ticketService = new TicketService();
module.exports = ticketService;

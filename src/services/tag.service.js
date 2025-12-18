const { NotFoundError } = require('../errors/ApiError');
const { In } = require("typeorm");
const AppDataSource = require('../config/data-source');
const UserService = require('./user.service')

class TagService {
    constructor() { 
        this.tagRepository = AppDataSource.getRepository("Tag");
    }

    async findAll() {
        return await this.tagRepository.find();
    }

    async findByIds(ids) {
        if (!ids || !Array.isArray(ids)) {
            return [];
        }
        return await tagRepository.find({
            where: { id: In(ids) }
        });
    }

    async create(data) {
        console.log(data)
        if (!data.label || data.label.trim() === "") {
            throw new ValidationError("Le label est obligatoire");
        }

        const newTag = this.tagRepository.create(data);
        return await this.tagRepository.save(newTag);
    }
}

const tagService = new TagService();
module.exports = tagService;

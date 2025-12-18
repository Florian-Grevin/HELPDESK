const UserModel = require('../models/user.entity');
const { ValidationError, NotFoundError } = require('../errors/ApiError');
const AppDataSource = require('../config/data-source');

class UserService {
    constructor() { 
        this.userRepository = AppDataSource.getRepository("User");
    }

    async findAll() {
        return await this.userRepository.find({
            relations: {
                tickets: true
            }
        });
    }

    async findById(userId) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new NotFoundError(`L'utilisateur avec l'id ${userId} n'existe pas`);
        }
        return user;
    }

    async create(data) {
        if (!data.email || data.email.trim() === "") {
            throw new ValidationError("Le mail est obligatoire");
        }

        const newUser = this.userRepository.create(data);
        return await this.userRepository.save(newUser);
    }
}

const userService = new UserService();
module.exports = userService;

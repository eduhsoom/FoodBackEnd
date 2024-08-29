const knex = require("../database/knex");
const AppError = require("../utils/AppError");
const DiskStorage = require("../providers/DiskStorage")

class FoodAvatarController{
    async update(request, response){
        const { id } = request.params;
        const AvatarFilename = request.file.filename;

        const diskStorage = new DiskStorage();

        const food = await knex("foods").where({id}).first();

        if(!food){
            throw new AppError("Esta comida não existe!", 401);
        }

        const filename = await diskStorage.saveFile(AvatarFilename);

        food.avatarFood = filename

        await knex("foods").update(food).where({id});

        return response.json(food)


    }
}

module.exports = FoodAvatarController;
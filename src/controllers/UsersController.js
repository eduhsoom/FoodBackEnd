const {hash, compare} = require("bcryptjs")
const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class UsersController {
 async create(request, response){
    const {name, email, password} = request.body

    const checkUserExists = await knex("users").where({email}).first();
    
    if(checkUserExists){
      throw new AppError("O e-mail já está em uso!", 401);
    }

    const hashedPassword = await hash(password, 8);

    await knex("users").insert({
      name,
      email,
      password: hashedPassword,
    })
    
    response.json();
 }

 async update(request, response){
   const {name, email, password, old_password} = request.body;
   const {id} = request.params;

   const user = await knex("users").where({ id }).first();

   if(!user){
    throw new AppError("Usuário não encontrado", 401);
   }

   const checkEmailExists = await knex("users").where({email}).first();

   if(checkEmailExists && checkEmailExists.id !== user.id){
    throw new AppError("Este e-mail já está em uso!")
   }

   user.name = name ?? user.name;
   user.email = email ?? user.email;
   if(password && old_password){
   const checkPassword = await compare(old_password, user.password);

   if(!checkPassword){
    throw new AppError("A senha antiga inválida.")
   }
  
   
   user.password = await hash(password, 8);
  }

  await knex("users").where({id}).update({
    name: user.name,
    email: user.email,
    password: user.password,
  })

  return response.json("Usuário atualizado!")
 }
}

module.exports = UsersController;
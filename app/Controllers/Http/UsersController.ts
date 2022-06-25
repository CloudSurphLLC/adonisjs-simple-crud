import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import RegisterUserValidator from "App/Validators/RegisterUserValidator";

export default class UsersController {
  public async register({ request, response }: HttpContextContract) {
    // Payload returns the validated data
    const payload = await request.validate(RegisterUserValidator);

    const user = await User.create(payload);

    return response.json(user);
  }
}

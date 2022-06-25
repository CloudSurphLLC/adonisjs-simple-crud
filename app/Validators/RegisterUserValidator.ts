import { schema, CustomMessages } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class RegisterUserValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({});

  public messages: CustomMessages = {};
}

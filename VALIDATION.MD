# The proper way to handle Request Validation

AdonisJS provides few different approaches to validate your request form data. We will use the Validation continually, we can either use inside the controller’s method or create a Validator class class to validate the incoming requests. In this article, we will provide how to use the validations properly.

**Note:** At this tutorial we will create an API for user registration form.

## Installation

Create new AdonisJS project using npm package manager

```shell
npm init adonis-ts-app@latest hello-world
```
> Read our previous article [How to set up CRUD in AdonisJS](https://www.cloudsurph.com/adonisjs-how-to-run-a-simple-crud-operation/). [Rony plz extend this message and tell that we already have an article that cover the basics]

## Controller

Create a controller and add register method

```shell
node ace make:controller User
```

The controller will be created at `app/Controllers/Http/UsersController.ts`

Add the register method inside controller

```typescript
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UsersController {

    /**
     * 
     * Other methods ...
     * 
     **/

    public async register({ request }: HttpContextContract) {

    }
}

```

## Validator

Create a validator class and and define it's parameters

```shell
node ace make:validator RegisterUser
```

The validator class will be created at `app/Validators/RegisterUserValidator.ts` and it will look as below:

```typescript
import { schema, CustomMessages, rules } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class RegisterUserValidator {
    constructor(protected ctx: HttpContextContract) {}

    public schema = schema.create({});

    public messages: CustomMessages = {};
}
```

> **constructor:** method accept http context variable

> **scheme** used to define parameter rules

> **messages:** used to define our custom messages

Now let's add the rules:

```typescript
public schema = schema.create({
    name: schema.string({ trim: true }),
    email: schema.string([
        rules.email(),
        rules.unique({ table: "users", column: "email" }),
    ]),
    password: schema.string([rules.minLength(6)]),
});
```

To access full list of rules go to official AdonisJS [documentation](https://docs.adonisjs.com/reference/validator/schema/string)

Next we add our custom messages to the defined rules you can leave empty as well and AdonisJS will print default messages [Rony plz correct here]

```typescript
public messages = {
    "name.required": "Name is required",
    "email.required": "Email is required",
    "email.email": "Email is invalid",
    "email.unique": "Email already exists",
    "password.required": "Password is required",
    "password.minLength": "Password must be at least 6 characters",
};
```

Finally our validator class will look like this:

```typescript
import { schema, CustomMessages, rules } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class RegisterUserValidator {
    constructor(protected ctx: HttpContextContract) {}

    public schema = schema.create({
        name: schema.string({ trim: true }),
        email: schema.string([
            rules.email(),
            rules.unique({ table: "users", column: "email" }),
        ]),
        password: schema.string([rules.minLength(6)]),
    });

    public messages = {
        "name.required": "Name is required",
        "email.required": "Email is required",
        "email.email": "Email is invalid",
        "email.unique": "Email already exists",
        "password.required": "Password is required",
        "password.minLength": "Password must be at least 6 characters",
    };
}
```

## Back to Controller

Now we will use the defined validator class inside our controller

```typescript
public async register({ request, response }: HttpContextContract) {
    
    // Payload returns the validated data
    const payload = await request.validate(RegisterUserValidator);

    const user = await User.create(payload);

    return response.json(user);
}
```

And at the end we will define the routes for register

```typescript
Route.post("/register", "UsersController.register");
```

That's it.
# AdonisJS Simple CRUD

## Installation

### Step 1

```shell
npm init adonis-ts-app@latest simple-crud
```

### Step 2
Select the project structure
```shell
❯ api   (Tailored for creating a REST API server)
  web   (Traditional web application with server rendered templates)
  slim  (A smallest possible AdonisJS application)
```

### Step 3
Go to created project directory
```shell
cd simple-crud
```

## Database configuration

### Step 1
Install lucid additional package for working with database in AdonisJS
```shell
npm i @adonisjs/lucid
```

### Step 2
Create necessary configuration files (No need to do extra things only run the below command)

```shell
node ace configure @adonisjs/lucid
```

### Step 3
Select the database provider you want to use, we use MYSQL in here

```shell
◯ SQLite
◉ MySQL / MariaDB
◯ PostgreSQL
◯ OracleDB
◯ Microsoft SQL Server
```

### Step 4
Provide your MYSQL database information at `.env` file as below

```env
DB_CONNECTION=mysql

MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=simple_crud
MYSQL_PASSWORD=demo
MYSQL_DB_NAME=demo
```

## Migration

### Step 1
Create a migration file and provide table name with columns you prepared.

```shell
node ace make:migration posts
```

Now navigate to your `database > migration` directory you will find a file create with the name of `posts`.

### Step 2
Provide the columns you want to add in posts table.

```typescript
  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id");

      table.string("title").notNullable();
      table.text("content").notNullable();

      //   Other columns ...

      table.timestamp("created_at", { useTz: true });
      table.timestamp("updated_at", { useTz: true });
    });
  }
```

### Step 3
Run migration command to create create tables in your database

```shell
node ace migration:run
```

After successful migration you will get the following message

```shell
[ info ]  Upgrading migrations version from "1" to "2"
❯ migrated database/migrations/1655556358714_posts

Migrated in 235 ms
```

## Model

### Step 1
Create a model for you database table

```shell
node ace make:model Post
```
The model will be created at `app/Models/User.ts`

### Step 2
Open model file and add necessary columns at you model

```typescript
export default class Post extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public title: string;

  @column()
  public content: string;

  // Other columns ...

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;
}

```

## Controller

### Step 1
Create the post controller using the below command

```shell
node ace make:controller Post
```

### Step 2
Open created controller and define the methods there

#### Show all posts

```typescript
public async showAll({ response }: HttpContextContract) {
    const posts = Post.all();
    
    return response.json(posts);
}
```

### Show single post

```typescript
public async show({ response, params }: HttpContextContract) {
    const post = await Post.find(params.id);
    response.abortIf(!post, "Post not found", 404);
    return response.json(post);
}
```

### Create post

```typescript
public async create({ request, response }: HttpContextContract) {
    const payload = await request.validate({
        schema: schema.create({
        title: schema.string(),
        content: schema.string(),
        }),
    });

    const post = await Post.create(payload);

    return response.json(post);
}
```

### Update post

```typescript
public async update({ request, response, params }: HttpContextContract) {
    const post = await Post.find(params.id);

    response.abortIf(!post, "Post not found", 404);

    const payload = await request.validate({
        schema: schema.create({
        title: schema.string(),
        content: schema.string(),
        }),
    });

    const updatedPost = await Post.updateOrCreate({ id: params.id }, payload);

    return response.json(updatedPost);
}
```

### Delete post

```typescript
public async delete({ request, response, params }: HttpContextContract) {
    const post = await Post.find(params.id);

    response.abortIf(!post, "Post not found", 404);

    post?.delete();

    return response.json({});
}
```

Finally out controller file must look like this

```typescript
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { schema } from "@ioc:Adonis/Core/Validator";
import Post from "App/Models/Post";

export default class PostsController {
  // GET /post/:id
  public async show({ response, params }: HttpContextContract) {
    const post = await Post.find(params.id);
    response.abortIf(!post, "Post not found", 404);
    return response.json(post);
  }

  // GET /post
  public async showAll({ response }: HttpContextContract) {
    const posts = Post.all();
    return response.json(posts);
  }

  // POST /post
  public async create({ request, response }: HttpContextContract) {
    const payload = await request.validate({
      schema: schema.create({
        title: schema.string(),
        content: schema.string(),
      }),
    });

    const post = await Post.create(payload);
    return response.json(post);
  }

  // PUT /post/:id
  public async update({ request, response, params }: HttpContextContract) {
    const post = await Post.find(params.id);
    response.abortIf(!post, "Post not found", 404);

    const payload = await request.validate({
      schema: schema.create({
        title: schema.string(),
        content: schema.string(),
      }),
    });

    const updatedPost = await Post.updateOrCreate({ id: params.id }, payload);
    return response.json(updatedPost);
  }

  // DELETE /post/:id
  public async delete({ request, response, params }: HttpContextContract) {
    const post = await Post.find(params.id);
    response.abortIf(!post, "Post not found", 404);
    post?.delete();
    return response.json({});
  }
}

```

# Routing

Add routes to the `start > routes.ts` file

```typescript
Route.get("/post", "PostsController.showAll");
Route.get("/post/:id", "PostsController.show");
Route.post("/post", "PostsController.create");
Route.put("/post/:id", "PostsController.update");
Route.delete("/post/:id", "PostsController.delete");
```

And that's it 💪🏻.

Now run the adonis js application with below simple command

```shell
node ace serve --watch
```

Your app will simple available at `http://127.0.0.1:3333`

Open `PostMan` or similar software and access the routes.
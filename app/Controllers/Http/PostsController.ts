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
    return posts;
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

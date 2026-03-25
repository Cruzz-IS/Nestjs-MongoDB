import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { IPost } from './interfaces/post.interface';
import { Model } from 'mongoose';
import { UpdatePostDto } from './dto/update-post.dto';
// import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @Inject('POST_MODEL') private postModel: Model<IPost>,
  ) {}

  async createPost(createPostDto: CreatePostDto): Promise<IPost> {
    const newPost = new this.postModel(createPostDto);
    return await newPost.save();
  }

  // Ejemplo de Populate: Trae el post y los datos del autor (excepto la password)
  async getAllPosts(): Promise<IPost[]> {
    return this.postModel
      .find()
      .populate('author', 'name email') // para realizar una relacion con el modelo de usuarios y obetener el nombre y email.
      .lean()
      .exec();
  }

  async getPost(id: string): Promise<IPost> {
    const post = await this.postModel
      .findById(id)
      .populate('author', 'name email')
      .exec();
    if (!post) throw new NotFoundException('Post no encontrado');
    return post;
  }

  async getPostsByUser(userId: string): Promise<IPost[]> {
    return this.postModel.find({ author: userId }).exec();
  }


  async updatePost(id: string, updatePostDto: UpdatePostDto): Promise<IPost> {
    const post = await this.postModel
      .findByIdAndUpdate(id, updatePostDto, { new: true })
      .exec();
    if (!post) throw new NotFoundException('Post no encontrado');
    return post;
  }

  async removePost(id: string) {
    const result = await this.postModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Post no encontrado');
    return { deleted: true };
  } 
}


  // create(createPostDto: CreatePostDto) {
  //   return 'This action adds a new post';
  // }

  // findAll() {
  //   return `This action returns all posts`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} post`;
  // }

  // update(id: number, updatePostDto: UpdatePostDto) {
  //   return `This action updates a #${id} post`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} post`;
  // } 
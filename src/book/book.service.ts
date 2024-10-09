import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Book } from './schemas/book.schema';
import * as mongoose from 'mongoose';
import { UpdateBookDto } from './dto/update-book.dto';
import { CreateBookDto } from './dto/create-book.dto';
import { Query } from 'express-serve-static-core';
import { User } from '../auth/schemas/user.schema';



@Injectable()
export class BookService {
    constructor(
        @InjectModel(Book.name)
        private bookModel: mongoose.Model<Book>
    ){
    }

    async findAll(query: Query): Promise<Book[]> {

        const resPerPage = 2
        const currentPage = Number(query.page) || 1
        const skip = resPerPage * (currentPage - 1)

        const keyword = query.keyword ? {
            title: {
                $regex: query.keyword,
                $options: 'i'
            }
        } : {}

        const books = await this.bookModel.find({ ...keyword }).limit(resPerPage).skip(skip)

        return books
    }

    async findOne(id: string): Promise<Book> {
        if (!mongoose.isValidObjectId(id)) {
            throw new BadRequestException('Invalid ID format');
        }

        const book = await this.bookModel.findById(id);

        if (!book) {
            console.warn('Book with ID ${id} not found');
            throw new NotFoundException('Book not found');
        }

        return book;
    }

    async create(book: CreateBookDto, user: User): Promise<Book> {
        const data = Object.assign(book, { user: user._id })

        const newBook = await this.bookModel.create(data)

        return newBook
    }

    async update(id: string, book: UpdateBookDto, user: User): Promise<Book> {
        if (!mongoose.isValidObjectId(id)) {
            throw new BadRequestException('Invalid ID format');
        }

        const data = Object.assign(book, { lastUpdatedBy: user._id })

        const updatedBook = await this.bookModel.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        })

        if (!updatedBook) {
            console.warn('Book with ID ${id} not found');
            throw new NotFoundException('Book not found');
        }

        return updatedBook
    }

    async delete(id): Promise<Book> {
        if (!mongoose.isValidObjectId(id)) {
            throw new BadRequestException('Invalid ID format');
        }

        const deletedBook = await this.bookModel.findByIdAndDelete(id)

        if (!deletedBook) {
            console.warn('Book with ID ${id} not found');
            throw new NotFoundException('Book not found');
        }

        return deletedBook
    }

}

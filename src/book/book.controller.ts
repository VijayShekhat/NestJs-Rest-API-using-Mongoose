import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { BookService } from './book.service';
import { Book } from './schemas/book.schema';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('books')
@UseGuards(AuthGuard(), RolesGuard)
export class BookController {
    constructor(private bookService: BookService){}

    @Get()
    @Roles(Role.Admin, Role.Moderator, Role.User)
    async getAllBooks(@Query() query: ExpressQuery): Promise<Book[]>{
        return this.bookService.findAll(query)
    }

    @Get(':id')
    @Roles(Role.Admin, Role.Moderator, Role.User)
    async getOneBook(@Param('id') id: string): Promise<Book> {
        return this.bookService.findOne(id)
    }

    @Post()
    @Roles(Role.Admin, Role.Moderator)
    async insertBook(@Body() book: CreateBookDto, @Req() req): Promise<Book> {
        return this.bookService.create(book, req.user)
    }

    @Put(':id')
    @Roles(Role.Admin, Role.Moderator)
    async updateBook(@Param('id') id: string, @Body() book: UpdateBookDto, @Req() req): Promise<Book> {
        return this.bookService.update(id, book, req.user)
    }

    @Delete(':id')
    @Roles(Role.Admin)
    async deleteBook(@Param('id') id: string): Promise<Book> {
        return this.bookService.delete(id)
    }

}

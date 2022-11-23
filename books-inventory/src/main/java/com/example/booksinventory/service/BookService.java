package com.example.booksinventory.service;

import com.example.booksinventory.model.BookDTO;
import java.util.List;

public interface BookService {
    BookDTO saveBook(BookDTO book);
    List<BookDTO> getBooks(Integer page, Integer size, String sort, boolean asc);
    List<BookDTO> getBooksByEmail(Integer page, Integer size, String sort, boolean asc, String email);
    BookDTO getBooksByIdentifier(String identifier, String email, String identifierType);
    BookDTO getBookById(String id, String email);
    BookDTO updateBookById(String id, BookDTO book);
    void deleteBook(String id, String email);
}

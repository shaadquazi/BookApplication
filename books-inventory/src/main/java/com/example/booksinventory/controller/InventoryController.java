package com.example.booksinventory.controller;

import com.example.booksinventory.model.BookDTO;
import com.example.booksinventory.service.BookServiceImplementation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;

@Controller
public class InventoryController {

    @Autowired
    private BookServiceImplementation bookService;

    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping(path = "/book-shelf")
    public @ResponseBody ResponseEntity<BookDTO> addBook(@RequestBody BookDTO bookDTO) throws URISyntaxException {
        // Check if request param is valid

        // Log this // TODO

        // Save book to DB
        BookDTO savedBook = bookService.saveBook(bookDTO);

        // Return saved entity, location and status code 201 to client
        URI location = new URI(String.format("/book-shelf/%s", savedBook.getId()));
        return ResponseEntity.created(location).body(savedBook);
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping(path = "/book-shelf")
    public @ResponseBody ResponseEntity<List<BookDTO>> getBooks(@RequestParam(required = false, defaultValue = "0") Integer page, @RequestParam(required = false, defaultValue = "10") Integer size, @RequestParam(required = false, defaultValue = "title") String sort, @RequestParam(required = false, defaultValue = "true") boolean asc, @RequestParam(required = true) String email) {
        // Log this // TODO

        // Get list of books
        List<BookDTO> bookDTOList = bookService.getBooksByEmail(page, size, sort, asc, email);

        return ResponseEntity.ok().body(bookDTOList);
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping(path = "/book-shelf/{id}")
    public @ResponseBody ResponseEntity<BookDTO> getBookById(@PathVariable String id, @RequestParam(required = true) String email, @RequestParam(required = false) String identifierType) {
        // Check if request param is valid

        // Log this // TODO

        // Get Book
        BookDTO bookDTO;
        if(identifierType != null && !identifierType.isBlank()) {
            bookDTO = bookService.getBooksByIdentifier(id, email, identifierType);
        } else {
            bookDTO = bookService.getBookById(id, email);
        }

        return ResponseEntity.ok().body(bookDTO);
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @PutMapping(path = "/book-shelf/{id}")
    public @ResponseBody ResponseEntity<BookDTO> updateBook(@PathVariable String id, @RequestBody BookDTO bookDTO) {
        // Check if request param is valid

        // Log this // TODO

        BookDTO updatedBookDTO = bookService.updateBookById(id, bookDTO);

        // We will update an existing book or create if id is not present
        return ResponseEntity.ok().body(updatedBookDTO);
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @DeleteMapping(path = "/book-shelf/{id}")
    public ResponseEntity<Void> deleteBook(@PathVariable String id, @RequestParam(required = true) String email) {
        // Check if request param is valid

        // Log this // TODO

        // Find the item and then delete it
        bookService.deleteBook(id, email);

        return new ResponseEntity<>(HttpStatus.ACCEPTED);
    }
}

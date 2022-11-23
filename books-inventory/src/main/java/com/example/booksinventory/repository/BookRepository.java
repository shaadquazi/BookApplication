package com.example.booksinventory.repository;
import com.example.booksinventory.model.Book;
import com.example.booksinventory.model.BookId;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.Optional;

// This will be AUTO IMPLEMENTED by Spring into a Bean called userRepository
// CRUD refers Create, Read, Update, Delete

// Repository fragment to provide methods to retrieve entities using the pagination and sorting abstraction.

public interface BookRepository extends CrudRepository<Book, BookId>, PagingAndSortingRepository<Book, BookId> {

    @Query(value = "SELECT * FROM BOOK WHERE industry_identifier_type = ?1 AND industry_identifier = ?2 AND email = ?3", nativeQuery = true)
    Optional<Book> findByIndustryIdentifier(String identifierType, String identifier, String email);
}

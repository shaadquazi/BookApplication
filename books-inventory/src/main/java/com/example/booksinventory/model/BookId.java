package com.example.booksinventory.model;

import java.io.Serializable;
import java.util.Objects;

public class BookId implements Serializable {
    private String id;
    private String email;

    public BookId() {
    }

    public BookId(String id, String email) {
        this.id = id;
        this.email = email;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        BookId bookId = (BookId) o;
        return Objects.equals(id, bookId.id) && Objects.equals(email, bookId.email);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, email);
    }
}

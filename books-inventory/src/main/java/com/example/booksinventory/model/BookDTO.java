package com.example.booksinventory.model;


public class BookDTO {
    private String id;
    private String title;
    private Integer pageCount;
    private String authors;
    private String thumbnail;
    private String printType;
    private String publishDate;
    private String publisher;
    private String language;
    private String industryIdentifier;
    private String industryIdentifierType;
    private boolean readFlag;
    private String note;
    private String description;

    private String email;

    public BookDTO() {
    }

    public static boolean isValid(BookDTO bookDTO) {
        if (bookDTO.getId() == null || bookDTO.getId().isBlank() || bookDTO.getTitle() == null || bookDTO.getTitle().isBlank() || bookDTO.getPageCount() == null || bookDTO.getPageCount() < 1) {
            return false;
        }
        return true;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Integer getPageCount() {
        return pageCount;
    }

    public void setPageCount(Integer pageCount) {
        this.pageCount = pageCount;
    }

    public String getAuthors() {
        return authors;
    }

    public void setAuthors(String authors) {
        this.authors = authors;
    }

    public String getThumbnail() {
        return thumbnail;
    }

    public void setThumbnail(String thumbnail) {
        this.thumbnail = thumbnail;
    }

    public String getPrintType() {
        return printType;
    }

    public void setPrintType(String printType) {
        this.printType = printType;
    }

    public String getPublishDate() {
        return publishDate;
    }

    public void setPublishDate(String publishDate) {
        this.publishDate = publishDate;
    }

    public String getPublisher() {
        return publisher;
    }

    public void setPublisher(String publisher) {
        this.publisher = publisher;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public String getIndustryIdentifier() {
        return industryIdentifier;
    }

    public void setIndustryIdentifier(String industryIdentifier) {
        this.industryIdentifier = industryIdentifier;
    }

    public String getIndustryIdentifierType() {
        return industryIdentifierType;
    }

    public void setIndustryIdentifierType(String industryIdentifierType) {
        this.industryIdentifierType = industryIdentifierType;
    }

    public boolean isReadFlag() {
        return readFlag;
    }

    public void setReadFlag(boolean readFlag) {
        this.readFlag = readFlag;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}

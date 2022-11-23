# Bookmark Web Application

A web application to Search, browse, and Save book information.

## Features

- Login using Google One Tap
- Search and browse using the Google Books API
- Save book information and notes

## Tech

This application uses some open source projects to work correctly:

- [React](https://github.com/facebook/react) - React is a JavaScript library for building user interfaces.
- [MUI](https://github.com/mui/material-ui) - MUI Core contains foundational React UI component libraries for shipping new features faster.
- [Axios](https://github.com/axios/axios) - Promise-based HTTP client for the browser and node.js
- [Spring Framework](https://github.com/spring-projects/spring-framework) - Spring Framework
- [MySQL](https://github.com/mysql/mysql-server) - MySQL Server, the world's most popular open-source database

## How to Run

Clone the repository

```sh
git clone https://github.com/shaadquazi/BookApplication.git
```

Add MySQL connection to BookApplication/books-inventory/src/main/resources/application.properties

```sh
spring.datasource.url=PROTOCOL//[HOST URL][/DATABASE NAME]
spring.datasource.username=USERNAME
spring.datasource.password=PASSWORD
```

Add your Google Project client_id and Google Books API key to BookApplication/books-inventory-client/.env

```sh
REACT_APP_CLIENT_ID = "CLIENT_ID"
REACT_APP_API_KEY = "API_KEY"
```

Install the dependencies and start the books-inventory-client.

```sh
cd BookApplication/books-inventory-client
npm install
npm start
```

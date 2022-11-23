import axios from "axios";

const createRequestBody = (book, email) => {
  const bookInfo = book.volumeInfo;
  const industryIdentifier = book.volumeInfo.industryIdentifiers?.find(
    (x) => x.type === "ISBN_13" || x.type === "OTHER"
  );
  const requestBody = {
    id: book.id,
    title: bookInfo.title,
    pageCount: bookInfo.pageCount,
    authors: bookInfo.authors?.join(", "), // List from Google API / saving it as string in DB
    thumbnail: bookInfo.imageLinks?.thumbnail,
    printType: bookInfo.printType,
    publishDate: bookInfo.publishedDate,
    publisher: bookInfo.publisher,
    language: bookInfo.language,
    industryIdentifier:
      industryIdentifier !== undefined && industryIdentifier.identifier,
    industryIdentifierType:
      industryIdentifier !== undefined && industryIdentifier.type,
    readFlag: book.read,
    note: book.notes,
    description: bookInfo.description,
    email: email,
  };
  return requestBody;
};

export const saveBook = async (book, userInfo, callback) => {
  const url = "http://localhost:8080/book-shelf";
  const requestBody = createRequestBody(book, userInfo.email);
  axios
    .post(url, requestBody)
    .then((response) => {
      callback(response);
    })
    .catch((error) => {
      callback(error);
    });
};

export const deleteBook = async (book, userInfo, callback) => {
  const url = `http://localhost:8080/book-shelf/${book.id}?email=${userInfo.email}`;

  axios
    .delete(url)
    .then((response) => {
      callback(response);
    })
    .catch((error) => {
      callback(error);
    });
};

export const updateBook = async (book, userInfo, callback) => {
  const url = `http://localhost:8080/book-shelf/${book.id}`;
  const requestBody = createRequestBody(book, userInfo.email);
  axios
    .put(url, requestBody)
    .then((response) => {
      callback(response);
    })
    .catch((error) => {
      callback(error);
    });
};

export const getUserBooks = async (userInfo, callback) => {
  const url = `http://localhost:8080/book-shelf?email=${userInfo.email}`;
  axios
    .get(url)
    .then((response) => {
      callback(response);
    })
    .catch((error) => {
      callback(error);
    });
};

export const getUserBookByIdentifier = async (
  identifier,
  identifierType,
  userInfo,
  callback
) => {
  const url = `http://localhost:8080/book-shelf/${identifier}?email=${userInfo.email}&identifierType=${identifierType}`;
  axios
    .get(url)
    .then((response) => {
      callback(response);
    })
    .catch((error) => {
      callback(error);
    });
};

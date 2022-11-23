import axios from "axios";

export const getGoogleBooksByQuery = async (searchQury, pageInfo, callback) => {
  const url = `https://www.googleapis.com/books/v1/volumes?q=${searchQury}&startIndex=${pageInfo.index}&maxResults=${pageInfo.size}&key=${process.env.REACT_APP_API_KEY}`;
  axios
    .get(url)
    .then((response) => {
      callback(response);
    })
    .catch((error) => {
      callback(error);
    });
};

export const getGoogleBookByISBN = async (identifier, callback) => {
  const url = `https://www.googleapis.com/books/v1/volumes?q=isbn:${identifier}`;

  axios
    .get(url)
    .then((response) => {
      callback(response);
    })
    .catch((error) => {
      callback(error);
    });
};

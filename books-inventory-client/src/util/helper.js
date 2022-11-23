export const isValidISBN = (isbn) => {
  /* The ISBN-13 check digit, which is the last digit of the ISBN, must range from 0 to 9 and must 
    be such that the sum of all the thirteen digits, each multiplied by its (integer) weight, 
    alternating between 1 and 3, is a multiple of 10.*/
  const intISBN = parseInt(isbn);
  if (isbn.length !== 13 || isbn[0] !== "9" || Number.isNaN(intISBN)) {
    return false;
  }

  let sum = 0;
  for (let i = 0; i < isbn.length - 1; i++) {
    const element = isbn[i] - "0";
    sum += i % 2 !== 0 ? element * 3 : element;
  }
  let lastDigit = 10 - (sum % 10);

  return (
    (lastDigit < 10 && isbn[12] - "0" === lastDigit) ||
    (lastDigit === 10 && isbn[12] - "0" === 0)
  );
};

export const mapDBToGoogleDTO = (book) => {
  return {
    id: book.id,
    saved: true,
    read: book.readFlag,
    notes: book.note,
    volumeInfo: {
      title: book.title,
      authors: [book.authors],
      publisher: book.publisher,
      pageCount: book.pageCount,
      printType: book.printType,
      language: book.language,
      publishedDate: book.publishDate,
      description: book.description,
      imageLinks: {
        thumbnail: book.thumbnail,
      },
      industryIdentifiers: [
        {
          type: book.industryIdentifierType,
          identifier: book.industryIdentifier,
        },
      ],
    },
  };
};

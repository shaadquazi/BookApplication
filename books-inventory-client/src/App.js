/* global google */
import { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Menu,
  CircularProgress,
  MenuItem,
  TextField,
  FormControlLabel,
  FormGroup,
  AppBar,
  Tooltip,
  Toolbar,
  Typography,
  Avatar,
  Stack,
  Checkbox,
  Snackbar,
  Button,
  IconButton,
} from "@mui/material";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import InfoIcon from "@mui/icons-material/Info";

import jwt_decode from "jwt-decode";

import "./App.css";
import { SearchResult } from "./SearchResult";

import { isValidISBN, mapDBToGoogleDTO } from "./util/helper";
import {
  saveBook,
  deleteBook,
  updateBook,
  getUserBooks,
  getUserBookByIdentifier,
} from "./util/javaClient";

import {
  getGoogleBookByISBN,
  getGoogleBooksByQuery,
} from "./util/googleBooksClient";

function App() {
  const [loginStatus, setLoginStatus] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [searchQury, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleAPIResult, setGoogleAPIResult] = useState([]);
  const [pageInfo, setPageInfo] = useState({ index: 0, size: 12, page: 1 });
  const [searchByISBN, setSearchByISBN] = useState(false);
  const [inputError, setInputError] = useState({ status: false, message: "" });
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [adminView, setAdminView] = useState(false);
  const [snackbar, setSnackbar] = useState({
    status: false,
    message: "",
    duration: 1500,
  });
  const showMenu = Boolean(menuAnchor);
  const searchInfoText =
    "You can search by Any Query / Title / Author. To search a book with ISBN, please select enter a valid ISBN-13 and select the checkbok.";
  const showNetworkError = (message) => {
    showSnackbar(
      `There has been an error. Please try again later. <${message}>`
    );
  };

  useEffect(() => {
    // google variable may not be present and case a bug (console error). We can just refresh.
    google.accounts.id.initialize({
      client_id: process.env.REACT_APP_CLIENT_ID, // Do not store secret, environment variables are embedded into the build.
      callback: handleCredentialResponse,
    });
  }, []);

  useEffect(() => {
    if (adminView && googleAPIResult?.items?.length === 0) {
      setAdminView(false);
    }
  }, [adminView, googleAPIResult]);

  useEffect(() => {
    if (loading && adminView) {
      getUserBooks(userInfo, (response) => {
        if (response.status) {
          if (response.data.length < 1) {
            showSnackbar("No saved books to show");
            setAdminView(false);
          }
          const booksDTO = response.data.map(mapDBToGoogleDTO);
          setGoogleAPIResult({
            items: booksDTO,
            totalItems: booksDTO.length,
          });
          setPageInfo((oldInfo) => ({
            ...oldInfo,
            totalItems: response.data.length,
          }));
        } else {
          showNetworkError(response.message);
          handleClearResult();
        }
        setLoading(false);
        setPageInfo((oldInfo) => ({ ...oldInfo, lastQuery: searchQury }));
        setSearchQuery("");
      });
    }
  }, [loading, searchQury, pageInfo, googleAPIResult, userInfo, adminView]);

  useEffect(() => {
    if (loading && searchQury && searchByISBN) {
      getUserBookByIdentifier(searchQury, "ISBN_13", userInfo, (response) => {
        if (response.status) {
          const bookDTO = [response.data].map(mapDBToGoogleDTO);
          setGoogleAPIResult({
            items: bookDTO,
            totalItems: 1,
          });
          setPageInfo((oldInfo) => ({
            ...oldInfo,
            totalItems: 1,
          }));
        } else {
          getGoogleBookByISBN(searchQury, (response) => {
            if (response.status) {
              if (response.data.totalItems === 0) {
                showSnackbar("No results where found");
              } else {
                setGoogleAPIResult(response.data);
                setPageInfo((oldInfo) => ({
                  ...oldInfo,
                  totalItems: response.data.totalItems,
                }));
              }
            } else {
              console.log("Google Error");
            }
          });
        }
      });
      setLoading(false);
      setPageInfo((oldInfo) => ({ ...oldInfo, lastQuery: searchQury }));
      setSearchQuery("");
    }
  }, [loading, searchByISBN, searchQury, userInfo]);

  useEffect(() => {
    if (loading && searchQury && !searchByISBN) {
      getGoogleBooksByQuery(searchQury, pageInfo, (response) => {
        if (response.status) {
          if (response.data.totalItems === 0 || !response.data.items) {
            showSnackbar("No results where found");
            handleClearResult();
          } else {
            updateGoogleResultWithDB(response.data);
            setGoogleAPIResult(response.data);
            setPageInfo((oldInfo) => ({
              ...oldInfo,
              totalItems: response.data.totalItems,
            }));
          }
        } else {
          setGoogleAPIResult([]);
          setPageInfo((oldInfo) => ({
            ...oldInfo,
            page: 1,
            index: 0,
          }));
        }
        setLoading(false);
        setPageInfo((oldInfo) => ({ ...oldInfo, lastQuery: searchQury }));
        setSearchQuery("");
      });
    }
  }, [loading, searchByISBN, searchQury, pageInfo]);

  const updateGoogleResultWithDB = (googleResult) => {
    getUserBooks(userInfo, (response) => {
      if (response.status) {
        // console.log("herere");
        const booksDTO = response.data.map(mapDBToGoogleDTO);
        const idsInDB = booksDTO.map((item) => item.id);
        const convertedData = {
          items: booksDTO,
          totalItems: booksDTO.length,
        };

        const mergeGoogleResult = googleResult.items.map((item) => {
          if (idsInDB.includes(item.id)) {
            return convertedData.items.find((cd) => cd.id === item.id);
          }
          return item;
        });
        setGoogleAPIResult((apiResult) => ({
          ...apiResult,
          items: mergeGoogleResult,
          totalItems: googleResult.totalItems,
        }));
      } else {
        // console.log("Error");
      }
    });
  };

  const handleLoginClick = (event) => {
    google.accounts.id.prompt();
  };

  const handleLogoutClick = (event) => {
    setLoginStatus(false);
    setUserInfo({});

    setSearchQuery("");
    setLoading(false);
    setGoogleAPIResult([]);
    setPageInfo({ index: 0, size: 12, page: 1 });
    setSearchByISBN(false);
    setInputError({ status: false, message: "" });
    setMenuAnchor(null);
    setAdminView(false);
  };

  const handlePagination = (e, value) => {
    setPageInfo((oldInfo) => ({
      ...oldInfo,
      page: value,
      index: (value - 1) * pageInfo.size,
    }));
    setSearchQuery(pageInfo.lastQuery);
    setLoading(true);
  };

  const handleCredentialResponse = (response) => {
    if (response.credential) {
      setLoginStatus(true);
      var decoded = jwt_decode(response.credential);
      setUserInfo((user) => ({
        ...user,
        givenName: decoded.given_name,
        familyName: decoded.family_name,
        email: decoded.email,
        picture: decoded.picture,
      }));
      showSnackbar(`Welcome, ${decoded.given_name}!`);
    }
  };

  const handleCardClick = (bookId) => {
    setGoogleAPIResult((apiResult) => ({
      ...apiResult,
      items: apiResult.items.map((item) =>
        item.id === bookId ? { ...item, showBookDialog: true } : item
      ),
    }));
  };

  const handleSearchToggle = (e, value) => {
    setSearchByISBN(value);
  };

  const handleReadClick = (bookId) => {
    const book = googleAPIResult.items.find((item) => item.id === bookId);
    // console.log("inside Read click");
    // console.log(book.read);
    // console.log(book.notes);
    if (book.read) {
      setGoogleAPIResult((apiResult) => ({
        ...apiResult,
        items: apiResult.items.map((item) =>
          item.id === bookId ? { ...item, read: false } : item
        ),
      }));
      book.read = false;
      showSnackbar("Marked as Unread");
    } else {
      setGoogleAPIResult((apiResult) => ({
        ...apiResult,
        items: apiResult.items.map((item) =>
          item.id === bookId ? { ...item, saved: true, read: true } : item
        ),
      }));
      book.read = true;
      showSnackbar("Mared as Read");
    }

    updateBook(book, userInfo, (response) => {
      if (response.status) {
        // console.log("Book Updated");
      } else {
        // console.log("Error");
        showNetworkError(response.message);
      }
    });
  };

  const handleBookDialogSave = (bookId, notes) => {
    const book = googleAPIResult.items.find((item) => item.id === bookId);
    if (book.saved) {
      setGoogleAPIResult((apiResult) => ({
        ...apiResult,
        items: apiResult.items.map((item) =>
          item.id === bookId ? { ...item, notes: notes } : item
        ),
      }));
      if (notes || notes === "") {
        book.notes = notes;
      }
      updateBook(book, userInfo, (response) => {
        if (response.status) {
          // console.log("Book Updated");
          showSnackbar("Book Updated");
        } else {
          showNetworkError(response.message);
        }
      });
    } else if (notes.length > 0) {
      setGoogleAPIResult((apiResult) => ({
        ...apiResult,
        items: apiResult.items.map((item) =>
          item.id === bookId ? { ...item, saved: true, notes: notes } : item
        ),
      }));
      if (notes || notes === "") {
        book.notes = notes;
      }
      saveBook(book, userInfo, (response) => {
        if (response.status) {
          // console.log("Book Saved");
          showSnackbar("Book Saved");
        } else {
          showNetworkError(response.message);
        }
      });
    }
    handleBookDialogClose(bookId);
  };

  const handleBookDialogClose = (bookId) => {
    setGoogleAPIResult((apiResult) => ({
      ...apiResult,
      items: apiResult.items.map((item) =>
        item.id === bookId ? { ...item, showBookDialog: false } : item
      ),
    }));
  };

  const handleBookmarkClick = (bookId) => {
    const book = googleAPIResult.items.find((item) => item.id === bookId);
    if (book.saved) {
      setGoogleAPIResult((apiResult) => ({
        ...apiResult,
        items: apiResult.items.map((item) =>
          item.id === bookId ? { ...item, saved: false, read: false } : item
        ),
      }));
      if (adminView) {
        setGoogleAPIResult((apiResult) => ({
          ...apiResult,
          items: apiResult.items.filter((item) => item.id !== bookId),
        }));
      }
      deleteBook(book, userInfo, (response) => {
        if (response.status) {
          // console.log("Book Deleted");
          showSnackbar("Book removed from bookmarks");
        } else {
          showNetworkError(response.message);
        }
      });
    } else {
      setGoogleAPIResult((apiResult) => ({
        ...apiResult,
        items: apiResult.items.map((item) =>
          item.id === bookId ? { ...item, saved: true } : item
        ),
      }));
      saveBook(book, userInfo, (response) => {
        if (response.status) {
          // console.log("Book Saved");
          showSnackbar("Book Saved");
        } else {
          showNetworkError(response.message);
        }
      });
    }
  };

  const handleMenuClick = (e) => {
    setMenuAnchor(e.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleAdminViewClick = () => {
    setMenuAnchor(null);
    setLoading(true);
    setAdminView(true);
    setGoogleAPIResult([]);
  };

  const handleSnackBarClose = () => {
    setSnackbar((old) => ({ ...old, status: false, message: "" }));
  };

  const showSnackbar = (message) => {
    setSnackbar((old) => ({ ...old, status: true, message }));
  };

  const handleClearResult = () => {
    setSearchQuery("");
    setLoading(false);
    setGoogleAPIResult([]);
    setPageInfo({ index: 0, size: 12, page: 1 });
    setInputError({ status: false, message: "" });
    setSearchByISBN(false);
    if (adminView) {
      setAdminView(false);
    }
  };

  const handleSearchClick = () => {
    if (!searchQury.length) {
      setInputError({ status: true, message: "Search Query cannot be 0" });
      return;
    }
    if (searchQury.length && searchByISBN && !isValidISBN(searchQury)) {
      setInputError({ status: true, message: "Invalid ISBN" });
      return;
    }
    setInputError({ status: false, message: "" });
    setLoading(true);
  };

  return (
    <div className="App">
      <header className="App-header">
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                SCANBOOK WEB PROJECT
              </Typography>
              {loginStatus ? (
                <Stack direction="row" spacing={3}>
                  <Avatar
                    alt={userInfo.givenName + userInfo.familyName}
                    src={userInfo.picture}
                  />
                  <IconButton onClick={handleMenuClick}>
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    anchorEl={menuAnchor}
                    open={showMenu}
                    onClose={handleMenuClose}
                  >
                    <MenuItem selected={true} onClick={handleAdminViewClick}>
                      Saved List View
                    </MenuItem>
                    <MenuItem onClick={handleLogoutClick}>Logout</MenuItem>
                  </Menu>
                </Stack>
              ) : (
                <Button color="inherit" onClick={handleLoginClick}>
                  Login
                </Button>
              )}
            </Toolbar>
          </AppBar>
        </Box>
      </header>
      <Box sx={{ flexGrow: 1, marginBottom: "250px" }}>
        <Stack spacing={2} alignItems="center">
          {loginStatus ? (
            <>
              {!adminView && (
                <Stack sx={{ padding: "24px" }}>
                  <Grid
                    container
                    spacing={4}
                    sx={{ justifyContent: "center" }}
                    alignItems="center"
                  >
                    <Grid item>
                      <TextField
                        error={inputError.status}
                        label="Search"
                        variant="outlined"
                        sx={{ width: "400px" }}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        value={searchQury}
                        helperText={inputError.message}
                      />
                    </Grid>
                    <Grid item>
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={searchByISBN}
                              onChange={handleSearchToggle}
                            />
                          }
                          label="Seach By ISBN"
                        />
                      </FormGroup>
                    </Grid>
                    <Grid item>
                      <Button
                        variant="contained"
                        sx={{ height: "100%" }}
                        onClick={handleSearchClick}
                      >
                        Search
                      </Button>
                    </Grid>
                    <Grid item>
                      <Tooltip title={searchInfoText}>
                        <InfoIcon
                          sx={{ width: "20px", height: "20px", opacity: "0.5" }}
                        />
                      </Tooltip>
                    </Grid>
                  </Grid>
                </Stack>
              )}
              {!loading ? (
                <SearchResult
                  googleAPIResult={googleAPIResult}
                  pageInfo={pageInfo}
                  adminView={adminView}
                  handlePagination={handlePagination}
                  handleReadClick={handleReadClick}
                  handleBookmarkClick={handleBookmarkClick}
                  handleCardClick={handleCardClick}
                  handleBookDialogClose={handleBookDialogClose}
                  handleBookDialogSave={handleBookDialogSave}
                  handleClearResult={handleClearResult}
                />
              ) : (
                <CircularProgress />
              )}
              <Snackbar
                open={snackbar.status}
                autoHideDuration={snackbar.duration}
                onClose={handleSnackBarClose}
                message={snackbar.message}
              />
            </>
          ) : (
            <Typography variant="h6" sx={{ flexGrow: 1, marginTop: "96px" }}>
              Welcome! <br />
              Search, browse and Save books.
              <br />
              <br />
              <br />
              Login to get started!
            </Typography>
          )}
        </Stack>
      </Box>
    </div>
  );
}

export default App;

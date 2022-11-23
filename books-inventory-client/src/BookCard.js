import {
  Typography,
  Card,
  Tooltip,
  CardMedia,
  CardActionArea,
  DialogTitle,
  DialogContent,
  DialogActions,
  Dialog,
  ButtonGroup,
  CardContent,
  TextField,
  Stack,
  Button,
  Grid,
  CardActions,
} from "@mui/material";
import AddTaskIcon from "@mui/icons-material/AddTask";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import BookmarkAddOutlinedIcon from "@mui/icons-material/BookmarkAddOutlined";
import BookmarkAddedOutlinedIcon from "@mui/icons-material/BookmarkAddedOutlined";
import { useEffect, useState } from "react";

export const BookCard = (props) => {
  const {
    book,
    handleBookmarkClick,
    handleReadClick,
    handleCardClick,
    handleBookDialogClose,
    handleBookDialogSave,
  } = props;

  const [notes, setNotes] = useState(null);

  useEffect(() => {
    if (notes === null && book.notes) {
      setNotes(book.notes);
    }
  }, [notes, book.notes]);

  return (
    <Card sx={{ width: 345, maxWidth: 345 }}>
      {book.volumeInfo && (
        <Dialog
          open={book.showBookDialog ? true : false}
          onClose={() => handleBookDialogClose(book.id)}
        >
          <DialogTitle sx={{ width: "550px", maxWidth: "600px" }}>
            <Stack direction="row" sx={{ justifyContent: "space-between" }}>
              <Stack sx={{ justifyContent: "start" }}>
                <Typography sx={{ fontSize: "24px", fontWeight: "700" }}>
                  {book.volumeInfo.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  By {book.volumeInfo.authors?.join(", ")} on{" "}
                  {book.volumeInfo.publishedDate?.substring(0, 4)}
                </Typography>
                <ButtonGroup variant="text" sx={{ marginTop: "8px" }}>
                  <Button
                    size="small"
                    color="primary"
                    onClick={() => handleBookmarkClick(book.id)}
                  >
                    {book.saved ? (
                      <>
                        <BookmarkAddedOutlinedIcon />
                        <Typography>Remove</Typography>
                      </>
                    ) : (
                      <>
                        <BookmarkAddOutlinedIcon />
                        <Typography>Save</Typography>
                      </>
                    )}
                  </Button>
                  <Button
                    size="small"
                    color="primary"
                    onClick={() => handleReadClick(book.id)}
                  >
                    {book.read ? (
                      <>
                        <AssignmentTurnedInIcon />
                        <Typography>Mark as Unread</Typography>
                      </>
                    ) : (
                      <>
                        <AddTaskIcon />
                        <Typography>Mark as Read</Typography>
                      </>
                    )}
                  </Button>
                </ButtonGroup>
              </Stack>
              <img
                src={book.volumeInfo.imageLinks?.thumbnail?.replace(
                  "zoom=1",
                  "zoom=0"
                )}
                alt={book.volumeInfo.title}
                loading="lazy"
                style={{ height: 200, maxWidth: 200, objectFit: "contain" }}
              />
            </Stack>
          </DialogTitle>
          <DialogContent>
            <Stack>
              <Typography sx={{ fontWeight: "700" }}>
                About this edition
              </Typography>
              <hr />
              <Grid container sx={{ justifyContent: "space-between" }}>
                <Grid item>
                  <Stack>
                    <Typography>
                      ISBN:{" "}
                      {book.volumeInfo.industryIdentifiers &&
                        book.volumeInfo.industryIdentifiers[0].identifier}
                    </Typography>
                    <Typography>
                      Published:{" "}
                      {book.volumeInfo.publishedDate?.substring(0, 4)}
                    </Typography>
                    {book.volumeInfo.publisher && (
                      <Typography>
                        Publisher: {book.volumeInfo.publisher}
                      </Typography>
                    )}
                    {book.volumeInfo.authors && (
                      <Typography>
                        Authors: {book.volumeInfo.authors?.join(", ")}
                      </Typography>
                    )}
                  </Stack>
                </Grid>
                <Grid item>
                  <Stack>
                    {book.volumeInfo.pageCount && (
                      <Typography>
                        Page Count: {book.volumeInfo.pageCount}
                      </Typography>
                    )}
                    {book.volumeInfo.printType && (
                      <Typography>
                        Format: {book.volumeInfo.printType}
                      </Typography>
                    )}
                    {book.volumeInfo.language && (
                      <Typography>
                        Language: {book.volumeInfo.language}
                      </Typography>
                    )}
                  </Stack>
                </Grid>
              </Grid>
              <TextField
                label="Personal Notes/Comment"
                multiline
                rows={4}
                value={notes ? notes : ""}
                onChange={(e) => setNotes(e.target.value)}
                sx={{ marginTop: "24px" }}
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                handleBookDialogClose(book.id);
              }}
            >
              Cancel
            </Button>
            <Button onClick={() => handleBookDialogSave(book.id, notes)}>
              Save
            </Button>
          </DialogActions>
        </Dialog>
      )}
      <CardActionArea onClick={() => handleCardClick(book.id)}>
        {/* Just a work around to show images on Chrome (Mixed Content) */}
        <CardMedia
          component="img"
          height="140"
          image={book.volumeInfo.imageLinks?.thumbnail?.replace(
            "http://",
            "https://"
          ).replace(
            "zoom=1",
            "zoom=0"
          )}
          alt={book.volumeInfo.title}
        />
        <CardContent>
          <Typography
            gutterBottom
            variant="h6"
            component="div"
            sx={{
              height: "50px",
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
            }}
          >
            {book.volumeInfo.title}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              height: "100px",
              overflow: "scroll",
            }}
          >
            {book.volumeInfo.description}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Tooltip title={book.saved ? "Remove Bookmark" : "Add Bookmark"}>
          <Button
            size="small"
            color="primary"
            onClick={() => handleBookmarkClick(book.id)}
          >
            {book.saved ? (
              <BookmarkAddedOutlinedIcon />
            ) : (
              <BookmarkAddOutlinedIcon />
            )}
          </Button>
        </Tooltip>
        <Tooltip title={book.read ? "Mark as Unread" : "Mark as Read"}>
          <Button
            size="small"
            color="primary"
            onClick={() => handleReadClick(book.id)}
          >
            {book.read ? <AssignmentTurnedInIcon /> : <AddTaskIcon />}
          </Button>
        </Tooltip>
      </CardActions>
    </Card>
  );
};

import { Box, Chip, Grid, Pagination, Typography, Stack } from "@mui/material";
import { BookCard } from "./BookCard";

export const SearchResult = (props) => {
  const {
    googleAPIResult,
    pageInfo,
    handlePagination,
    handleBookmarkClick,
    handleReadClick,
    handleCardClick,
    handleBookDialogSave,
    handleBookDialogClose,
    handleClearResult,
    adminView,
  } = props;

  return (
    <Box spacing={4}>
      {googleAPIResult?.items?.length > 0 && (
        <>
          <Stack direction="row" alignItems="baseline">
            {adminView ? (
              <Typography variant="h6" sx={{ padding: "24px" }}>
                All Saved Books from DB
              </Typography>
            ) : (
              <Typography variant="h6" sx={{ padding: "24px" }}>
                About {pageInfo.totalItems} results
              </Typography>
            )}
            <Chip
              label={adminView ? "Go Back to Search View" : "Clear Result"}
              variant="outlined"
              onClick={handleClearResult}
              onDelete={handleClearResult}
            />
          </Stack>
          <Box spacing={3} sx={{ padding: "24px" }}>
            <Grid container spacing={2}>
              {googleAPIResult.items.map((item) => {
                return (
                  <Grid item key={item.id}>
                    <BookCard
                      book={item}
                      handleBookmarkClick={handleBookmarkClick}
                      handleReadClick={handleReadClick}
                      handleCardClick={handleCardClick}
                      handleBookDialogClose={handleBookDialogClose}
                      handleBookDialogSave={handleBookDialogSave}
                    />
                  </Grid>
                );
              })}
            </Grid>
          </Box>
          <Stack alignItems="center">
            <Pagination
              page={pageInfo.page}
              count={Math.ceil(googleAPIResult.totalItems / pageInfo.size)}
              sx={{ justifyContent: "center" }}
              onChange={handlePagination}
            />
          </Stack>
        </>
      )}
    </Box>
  );
};

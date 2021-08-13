import React, { useState } from "react";
import { Box, Button, CircularProgress, Typography } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { BoardCard } from "../BoardCard/BoardCard";
import AddIcon from "@material-ui/icons/Add";
import { NewBoard } from "../NewBoard/NewBoard";
import { useUserBoardsSlice } from "../../../../redux/userBoards/userBoardsSlice";

export const Boards: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const userBoardsSlice = useUserBoardsSlice();

  const showAddBoardModal = () => {
    setShowModal(true);
  };

  const closeAddBoardModal = () => {
    setShowModal(false);
  };

  if (userBoardsSlice.status === "idle" || userBoardsSlice.status === "loading")
    return (
      <Box display="flex" justifyContent="center" alignItems="center">
        <CircularProgress />
        <Box marginLeft="8px">Loading existing boards...</Box>
      </Box>
    );
  if (userBoardsSlice.status === "error")
    return <p>There was an error while fetching boards</p>;
  return (
    <>
      <NewBoard show={showModal} onClose={closeAddBoardModal} />
      <Box marginTop="32px">
        <Box display="flex" justifyContent="space-between">
          <Typography variant="h5" color="textSecondary">
            Boards
          </Typography>
          <Button
            variant="text"
            startIcon={<AddIcon />}
            color="primary"
            onClick={showAddBoardModal}
          >
            Add board
          </Button>
        </Box>
        {userBoardsSlice.data.length === 0 ? (
          <Box display="flex" justifyContent="center" alignItems="center">
            <Alert severity="info">You don&apos;t have any boards yet</Alert>
          </Box>
        ) : (
          <Box display="flex" justifyContent="space-between" flexWrap="wrap">
            {userBoardsSlice.data.map((board) => (
              <BoardCard key={board.id} board={board} />
            ))}
          </Box>
        )}
      </Box>
    </>
  );
};

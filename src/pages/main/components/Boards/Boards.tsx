import React, { useState } from "react";
import { Box, Button, CircularProgress, Typography } from "@material-ui/core";
import { useUserBoards } from "../../useUserBoards";
import Alert from "@material-ui/lab/Alert";
import { BoardCard } from "../BoardCard/BoardCard";
import AddIcon from "@material-ui/icons/Add";
import { NewBoard } from "../NewBoard/NewBoard";

export const Boards: React.FC = () => {
  const { status, data, deleteBoard } = useUserBoards();
  const [showModal, setShowModal] = useState(false);

  const showAddBoardModal = () => {
    setShowModal(true);
  };

  const closeAddBoardModal = () => {
    setShowModal(false);
  };

  if (status === "idle" || status === "loading")
    return (
      <Box display="flex" justifyContent="center" alignItems="center">
        <CircularProgress />
        <Box marginLeft="8px">Loading existing boards...</Box>
      </Box>
    );
  if (status === "error")
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
        {data.length === 0 ? (
          <Box display="flex" justifyContent="center" alignItems="center">
            <Alert severity="info">You don&apos;t have any boards yet</Alert>
          </Box>
        ) : (
          <Box display="flex" justifyContent="space-between" flexWrap="wrap">
            {data.map((board) => (
              <BoardCard
                key={board.id}
                board={board}
                deleteBoard={deleteBoard}
              />
            ))}
          </Box>
        )}
      </Box>
    </>
  );
};

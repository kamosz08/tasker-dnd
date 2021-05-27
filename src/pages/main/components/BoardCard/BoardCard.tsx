import React from "react";
import { useHistory } from "react-router";
import { Box, Button, Card, Chip, Typography } from "@material-ui/core";
import { BoardTypeWithoutTaskPull } from "../../useUserBoards";
import styles from "./styles.module.css";
import { useAuth } from "../../../../contexts/AuthContext";
import { formatDistance } from "date-fns";

export const BoardCard: React.FC<{
  board: BoardTypeWithoutTaskPull;
  deleteBoard: (
    boardId: string,
    participantsIds: string[],
    tasksIds: string[]
  ) => Promise<void>;
}> = ({ board, deleteBoard }) => {
  const { push } = useHistory();
  const { user } = useAuth();

  const goToBoard = (id: string) => () => {
    push(`/boards/${id}`);
  };

  return (
    <Card className={styles["board-card"]}>
      <Box
        display="flex"
        flexWrap="nowrap"
        width="100%"
        justifyContent="space-between"
      >
        <Box>
          <Typography variant="h5" align="left" noWrap>
            {board.name}
          </Typography>
          <Typography color="textSecondary" variant="subtitle1" align="left">
            Created by: {board.createdBy.displayName}
          </Typography>
        </Box>
        <Box>
          {board.createdAt && (
            <Typography color="textSecondary" variant="body2" align="right">
              Created:{" "}
              {formatDistance(board.createdAt.toDate(), Date.now(), {
                addSuffix: true,
              })}
            </Typography>
          )}
          {board.lastUpdated && (
            <Typography color="textSecondary" variant="body2" align="right">
              Last updated:{" "}
              {formatDistance(board.lastUpdated.toDate(), Date.now(), {
                addSuffix: true,
              })}
            </Typography>
          )}
        </Box>
      </Box>
      <Box marginTop="8px" marginBottom="8px">
        <Typography align="left">{board.description}</Typography>
      </Box>
      <Box display="flex" justifyContent="flex-start">
        <Chip label={`${board.tasks.length} items`} variant="outlined" />
        <Chip label={`${board.participants.length} users`} variant="outlined" />
      </Box>
      <Box display="flex" justifyContent="flex-end">
        {user?.id === board.createdBy.userId && (
          <Button
            color="secondary"
            onClick={() =>
              deleteBoard(
                board.id,
                board.participants.map((p) => p.userId),
                board.tasks
              )
            }
          >
            Delete
          </Button>
        )}
        <Button color="primary" onClick={goToBoard(board.id)}>
          Open
        </Button>
      </Box>
    </Card>
  );
};

import React from "react";
import { useHistory } from "react-router";
import {
  Box,
  Button,
  Card,
  CardHeader,
  CircularProgress,
  Divider,
  Typography,
} from "@material-ui/core";
import { useUserBoards } from "./useUserBoards";
import styles from "./styles.module.css";
import { NewBoard } from "../new-board/NewBoard";
import Alert from "@material-ui/lab/Alert";
import { BoardType } from "../../types";

const BoardCard: React.FC<{ board: BoardType }> = ({ board }) => {
  const { push } = useHistory();

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
            Created by: Mayuuko
          </Typography>
        </Box>
        <Box>
          <Typography color="textSecondary" variant="body2" align="right">
            Created at: 17-02-2021
          </Typography>
          <Typography color="textSecondary" variant="body2" align="right">
            Last updated: 19-02-2021
          </Typography>
        </Box>
      </Box>
      <Box marginTop="8px" marginBottom="8px">
        <Typography>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium
          velit magni sapiente? Cupiditate quae dolorem iure fugit repellat non
          quos veritatis nostrum porro accusantium. Est vel ab consequatur in
          suscipit.
        </Typography>
      </Box>
      <Box display="flex" justifyContent="flex-end">
        <Button color="primary" onClick={goToBoard(board.id)}>
          Open
        </Button>
      </Box>
    </Card>
  );
};

const Boards: React.FC = () => {
  const { status, data } = useUserBoards();

  if (status === "idle" || status === "loading")
    return (
      <Box display="flex" justifyContent="center" alignItems="center">
        <CircularProgress />
        <Box marginLeft="8px">Loading existing boards...</Box>
      </Box>
    );
  if (status === "error")
    return <p>There was an error while fetching boards</p>;
  if (data.length === 0)
    return (
      <Box display="flex" justifyContent="center" alignItems="center">
        <Alert severity="info">You don&apos;t have any boards yet</Alert>
      </Box>
    );
  return (
    <Box marginTop="32px">
      {data.map((board) => (
        <BoardCard key={board.id} board={board} />
      ))}
    </Box>
  );
};

export const Main: React.FC = () => {
  return (
    <Box width="100%" display="flex" justifyContent="center">
      <Box display="flex" justifyContent="center" flexWrap="wrap">
        <Box width="100%" textAlign="center">
          <NewBoard />
          <Divider variant="fullWidth" />
          <Boards />
        </Box>
      </Box>
    </Box>
  );
};

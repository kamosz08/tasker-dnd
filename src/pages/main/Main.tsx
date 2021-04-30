import React from "react";
import { useHistory } from "react-router";
import { Box } from "../../ui/Box/Box";
import { Button } from "../../ui/Button/Button";
import { useUserBoards } from "./useUserBoards";
import styles from "./styles.module.css";

const Boards: React.FC = () => {
  const { status, data } = useUserBoards();
  const { push } = useHistory();

  const handleClick = (id: string) => () => {
    push(`/boards/${id}`);
  };

  if (status === "idle" || status === "loading") return <p>Loading...</p>;
  if (status === "error")
    return <p>There was an error while fetching boards</p>;
  if (data.length === 0) return <p>You don&apos;t have any boards yet</p>;
  return (
    <>
      {data.map((board) => (
        <div
          className={styles.card}
          key={board.id}
          onClick={handleClick(board.id)}
        >
          {board.name}
        </div>
      ))}
    </>
  );
};

export const Main: React.FC = () => {
  const { push } = useHistory();

  const handleNewBoard = () => {
    push("/new-board");
  };

  return (
    <Box width="100%" display="flex" justifyContent="center">
      <Box display="flex" justifyContent="center" flexWrap="wrap">
        <Box width="100%" textAlign="center">
          <Boards />
        </Box>
        <Button buttonType="primary" onClick={handleNewBoard}>
          Create new board
        </Button>
      </Box>
    </Box>
  );
};

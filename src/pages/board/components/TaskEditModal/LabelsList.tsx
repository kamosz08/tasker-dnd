import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Popover,
  PopoverProps,
} from "@material-ui/core";
import React, { useState } from "react";
import LabelIcon from "@material-ui/icons/Label";
import AddIcon from "@material-ui/icons/Add";
import { AddLabelDialog } from "./AddLabelDialog";
import { useUpdateTask } from "./useUpdateTask";
import { useBoardDetailsSlice } from "../../../../redux/boardDetails/boardDetailsSlice";
import { useParams } from "react-router-dom";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  anchorEl: PopoverProps["anchorEl"];
  taskId: string;
};

export const LabelsList: React.FC<Props> = ({
  isOpen,
  onClose,
  anchorEl,
  taskId,
}) => {
  const { id: boardId } = useParams<{ id: string }>();
  const board = useBoardDetailsSlice(boardId);
  const boardData = board!.data!;
  const { addLabelToTask } = useUpdateTask();

  const [isDialogOpen, setDialogOpen] = useState(false);
  const boardLabels = boardData.labels || [];
  const taskLabels = boardData.tasks.find((t) => t.id === taskId)?.labels || [];

  const labels = boardLabels.filter((l) => !taskLabels.includes(l.name));

  return (
    <>
      <Popover
        open={isOpen}
        onClose={onClose}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <Box padding="8px 16px">
          <List component="nav" aria-label="main mailbox folders">
            {labels.map((label) => (
              <ListItem
                key={label.name}
                button
                onClick={() => {
                  addLabelToTask(taskId, label.name);
                  onClose();
                }}
              >
                <ListItemIcon>
                  <LabelIcon style={{ color: label.color }} />
                </ListItemIcon>
                <ListItemText primary={label.name} />
              </ListItem>
            ))}
            <ListItem
              key="add new label"
              button
              onClick={() => setDialogOpen(true)}
            >
              <ListItemIcon>
                <AddIcon />
              </ListItemIcon>
              <ListItemText primary="Add label" />
            </ListItem>
          </List>
        </Box>
      </Popover>
      <AddLabelDialog
        isDialogOpen={isDialogOpen}
        taskId={taskId}
        onClose={() => setDialogOpen(false)}
      />
    </>
  );
};

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
import { useBoard } from "../../../../contexts/BoardContext";
import { useUpdateTask } from "./useUpdateTask";

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
  const { board } = useBoard();
  const { addLabelToTask } = useUpdateTask();

  const [isDialogOpen, setDialogOpen] = useState(false);
  const boardLabels = board?.labels || [];
  const taskLabels = board?.tasks.find((t) => t.id === taskId)?.labels || [];

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

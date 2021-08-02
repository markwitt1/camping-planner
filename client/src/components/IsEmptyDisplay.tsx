import React from "react";
import { Box, Button, Typography } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { FunctionComponent } from "react";

interface Props {
  text: string;
  buttonText: string;
  onClick: () => void;
}

const IsEmptyDisplay: FunctionComponent<Props> = ({
  text,
  buttonText,
  onClick,
}: Props) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      margin="1rem"
      justifyContent="center"
      alignItems="center"
    >
      <Typography>{text}</Typography>
      <div>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<AddIcon />}
          onClick={onClick}
        >
          {buttonText}
        </Button>
      </div>
    </Box>
  );
};

export default IsEmptyDisplay;

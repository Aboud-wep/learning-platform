import React from "react";
import { Dialog, DialogTitle, DialogContent, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useQuestion } from "../../Pages/Questions/Context/QuestionContext";

const QuestionVideoDialog = () => {
  const { videoDialogOpen, videoUrl, closeVideoDialog } = useQuestion();

  return (
    <Dialog
      open={videoDialogOpen}
      onClose={closeVideoDialog}
      maxWidth="md"
      fullWidth
    >
      {/* <DialogTitle
        sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
      >
        فيديو السؤال
        <IconButton onClick={closeVideoDialog}>
          <CloseIcon />
        </IconButton>
      </DialogTitle> */}
      <DialogContent dividers sx={{ p: 0 }}>
        {videoUrl && (
          <iframe
            width="100%"
            height="400"
            src={videoUrl.replace("watch?v=", "embed/")}
            title="Question Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default QuestionVideoDialog;

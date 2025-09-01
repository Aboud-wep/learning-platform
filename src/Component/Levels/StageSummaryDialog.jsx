import * as React from "react";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import ModalClose from "@mui/joy/ModalClose";
import DialogTitle from "@mui/joy/DialogTitle";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import ReactMarkdown from "react-markdown";

export default function StageSummaryDialogJoy({
  open,
  onClose,
  stageSummaries,
}) {
  if (!stageSummaries) return null;

  return (
    <div style={{ zIndex: 3001 }}>
      <Modal
        open={open}
        onClose={(_, reason) => {
          if (reason === "backdropClick" || reason === "escapeKeyDown") {
            onClose(); // ✅ close only when clicking outside or pressing Esc
          }
        }}
      >
        <ModalDialog
          layout="center"
          variant="outlined"
          sx={{
            maxHeight: "80vh",
            width: { xs: 360, sm: 600 },
            overflow: "hidden",
            px: 5,
          }}
        >
          {/* Title */}
          <DialogTitle
            sx={{
              textAlign: "left",
              fontWeight: "bold",
              fontSize: "1.25rem",
              p: 2,
            }}
          >
            شرح المرحلة
          </DialogTitle>

          <Stack>{stageSummaries.title || "العنوان"}</Stack>

          {/* Scrollable content */}
          <Stack
            sx={{
              p: 2,
              maxHeight: "60vh",
              overflowY: "auto",
              direction: "rtl",
              textAlign: "left",
              "& h1, & h2, & h3": {
                fontWeight: "bold",
                margin: "16px 0 8px",
                color: "#222",
              },
              "& ul": { paddingRight: "20px", marginBottom: "12px" },
              "& li": { marginBottom: "6px" },
              "& blockquote": {
                borderRight: "4px solid #ccc",
                paddingRight: "10px",
                margin: "10px 0",
                fontStyle: "italic",
                background: "#f9f9f9",
              },
              "& p": { marginBottom: "10px", lineHeight: 1.6 },
            }}
          >
            <ReactMarkdown>
              {stageSummaries.text || "لا يوجد وصف"}
            </ReactMarkdown>
          </Stack>
        </ModalDialog>
      </Modal>
    </div>
  );
}

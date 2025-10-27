import * as React from "react";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import ModalClose from "@mui/joy/ModalClose";
import DialogTitle from "@mui/joy/DialogTitle";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import { useLanguage } from "../../Context/LanguageContext";
import { Box } from "@mui/material";

export default function StageSummaryDialogJoy({
  open,
  onClose,
  stageSummaries,
}) {
  const { t } = useLanguage();

  if (!stageSummaries || stageSummaries.length === 0) return null;

  return (
    <div style={{ zIndex: 3001 }}>
      <Modal
        open={open}
        onClose={(_, reason) => {
          if (reason === "backdropClick" || reason === "escapeKeyDown") {
            onClose();
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
            px: 3,
          }}
        >
          <ModalClose />
          <DialogTitle
            sx={{
              textAlign: "center",
              fontWeight: "bold",
              fontSize: "1.3rem",
              mb: 1,
            }}
          >
            {t("stage_summary_title")}
          </DialogTitle>

          <Stack
            sx={{
              p: 2,
              maxHeight: "60vh",
              overflowY: "auto",
              textAlign: "left",
              direction: "rtl",
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
            {stageSummaries.map((summary) => (
              <Box key={summary.id} sx={{ mb: 3 }}>
                <Typography level="title-md" sx={{ fontWeight: "bold", mb: 1 }}>
                  {summary.title || t("stage_summary_no_title")}
                </Typography>

                <div
                  dangerouslySetInnerHTML={{
                    __html: summary.text || t("stage_summary_no_desc"),
                  }}
                />
              </Box>
            ))}
          </Stack>
        </ModalDialog>
      </Modal>
    </div>
  );
}

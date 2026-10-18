import Button from '@mui/material/Button';

function PrimaryButton({ children, ...props }) {
  return (
    <Button
      variant="contained"
      color="primary"
      sx={{
        mt: 2,
        mb: 2,
        px: 3,
        py: 1,
        borderRadius: 2,
        textTransform: 'none',
      }}
      {...props}
    >
      {children}
    </Button>
  );
}

export default PrimaryButton;

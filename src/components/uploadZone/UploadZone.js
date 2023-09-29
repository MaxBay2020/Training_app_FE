import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import {Card, CardContent, Dialog, Grid} from "@mui/material";
import {useState} from "react";
import Typography from "@mui/material/Typography";
import Dropzone from "react-dropzone";

const UploadZone = () => {

    const [open, setOpen] = useState(true)

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <IconButton onClick={handleClickOpen}><CloudUploadOutlinedIcon /></IconButton>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >

                <Dropzone onDrop={acceptedFiles => console.log(acceptedFiles)}>
                    {({getRootProps, getInputProps, isDragActive}) => (
                        <section>
                            <div {...getRootProps()}>
                                <input {...getInputProps()} />
                                <Card sx={{width: '200px', height: '200px', m: 2, border: `${isDragActive ? '1px dashed rgba(71, 102, 196, 0.7)' : '1px dashed rgba(71, 102, 196, 0.3)'}`}} variant="outlined">
                                    <Grid sx={{height: '100%'}} container alignItems='center' justifyContent='center'>
                                        <Grid item>
                                            <CardContent>
                                                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                                    {
                                                        isDragActive ? 'Drop file here' : 'File drop or click to upload'
                                                    }
                                                </Typography>
                                            </CardContent>
                                        </Grid>
                                    </Grid>
                                </Card>
                            </div>
                        </section>
                    )}
                </Dropzone>


                <Button onClick={handleClose} autoFocus>Confirm</Button>
            </Dialog>
        </>
    )
}

export default UploadZone

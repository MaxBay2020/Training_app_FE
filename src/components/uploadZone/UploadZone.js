import {useCallback, useState} from 'react'
import Button from "@mui/material/Button";
import {Card, CardContent, Dialog, Grid} from "@mui/material";
import Typography from "@mui/material/Typography";
import {useDropzone} from "react-dropzone";
import {read, utils} from 'xlsx';
import {useDispatch} from "react-redux";
import {addUploadedTrainings} from "../../features/trainingSlice";
import {useNavigate} from "react-router-dom";

const UploadZone = ({open, setOpen}) => {

    const [isUploaded, setIsUploaded] = useState(false)
    const [fileName, setFileName] = useState('')
    const [invalidFileType, setInvalidFileType] = useState(false)
    const dispatch = useDispatch()
    const [uploadedTrainings, setUploadedTrainings] = useState([])
    const navigate = useNavigate()


    const onDrop = useCallback((acceptedFiles) => {
        acceptedFiles.forEach((file) => {
            const {name} = file
            setFileName(name)

            const reader = new FileReader()

            reader.onabort = () => console.log('file reading was aborted')
            reader.onerror = () => console.log('file reading has failed')
            reader.onload = () => {
                const binaryStr = reader.result
                setIsUploaded(true)
                setInvalidFileType(false)

                const wb = read(binaryStr)

                const ws = wb.Sheets[wb.SheetNames[0]]
                const allTrainings = utils.sheet_to_json(ws)
                setUploadedTrainings(allTrainings)
            }

            reader.readAsArrayBuffer(file)
        })

    }, [])

    const onDropRejected = (fileRejections, _e) => {
        setInvalidFileType(true)
    }

    const {getRootProps, getInputProps, isDragActive} = useDropzone({
            onDrop,
            accept: {
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [],
            },
            onDropRejected
        }
    )

    const handleClose = () => {
        setOpen(false);
    };

    const goToUploadedFileDetailPage = () => {
        dispatch(addUploadedTrainings({ uploadedTrainings }))
        navigate('uploads')
        // window.open('/training/uploads', '_blank')
    }


    return (
        <>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <section>
                    <div {...getRootProps()}>
                        <input {...getInputProps()} />
                        <Card
                            sx={{
                                width: '200px',
                                height: '200px',
                                m: 2,
                                border: `${isDragActive ? '1px dashed rgba(71, 102, 196, 0.7)' : '1px dashed rgba(71, 102, 196, 0.3)'}`
                            }} variant="outlined"
                        >
                            <Grid sx={{height: '100%'}} container alignItems='center' justifyContent='center'>
                                <Grid item>
                                    {
                                        isUploaded ?
                                            <>{fileName}</>
                                            :
                                            <CardContent>

                                                {
                                                    isDragActive ?
                                                        <Typography sx={{fontSize: 14}} color="text.secondary"
                                                                    gutterBottom>
                                                            Drop file here
                                                        </Typography>
                                                        :


                                                        (
                                                            invalidFileType
                                                                ?
                                                                <Typography
                                                                    sx={{fontSize: 14}}
                                                                    color="error"
                                                                    gutterBottom
                                                                >
                                                                    Only .xlsx file accepted
                                                                </Typography>
                                                                :
                                                                <Grid container direction='column' alignItems='center'>
                                                                    <Grid item>
                                                                        <Typography sx={{fontSize: 14}}
                                                                                    color="text.secondary"
                                                                                    gutterBottom>
                                                                            File drop or click to upload
                                                                        </Typography>
                                                                    </Grid>
                                                                    <Grid item>
                                                                        <Typography sx={{fontSize: 10}}
                                                                                    color="text.secondary"
                                                                                    gutterBottom>
                                                                            only .xlsx file accepted
                                                                        </Typography>
                                                                    </Grid>
                                                                </Grid>
                                                        )
                                                }
                                            </CardContent>
                                    }
                                </Grid>
                            </Grid>
                        </Card>
                    </div>
                </section>

                <Button
                    onClick={() => goToUploadedFileDetailPage()}
                    autoFocus
                    disabled={invalidFileType || !isUploaded}
                >
                    Confirm
                </Button>
            </Dialog>
        </>
    )
}

export default UploadZone

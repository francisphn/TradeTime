import * as React from 'react';
import {fetchAllAuctions, fetchAllCategories} from "../services/AuctionServices";
import axios from "axios";

import { styled } from '@mui/material/styles';
import {Box, Pagination} from "@mui/material";

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';

import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {useNavigate} from "react-router-dom";
import Button from "@mui/material/Button";


const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const theme = createTheme();

export default function CreateAuction() {

    const navigator = useNavigate()

    const [auctionCount, setAuctionCount] = React.useState(-1)

    const [auctions, setAuctions] = React.useState<Array<auction>>([])

    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")

    const [categories, setCategories] = React.useState<Array<category>>([])

    React.useEffect(() => {
        const getCategoriesMe = getCategories().then(r => {
            setCategories(r.data)

        })

        getAuctions().then(r => {
            setAuctions(r.data.auctions)
            setAuctionCount(r.data.count)
        }
        )
    }, [])

    const getAuctions = async () => {
        return await fetchAllAuctions();
    }

    const getCategories = async () => {
        return await fetchAllCategories();
    }

    const handleClickRegister = () => {
        navigator("/register")
    }

    const handleClickLogIn = () => {
        navigator('/login')
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <main>
                {/* Hero unit */}
                <Box
                    sx={{
                        bgcolor: 'background.paper',
                        pt: 8,
                        pb: 6,
                    }}
                >
                    <Container maxWidth="sm">
                        <Typography
                            component="h1"
                            variant="h3"
                            align="center"
                            color="text.primary"
                            gutterBottom
                        >
                            Haere mai!
                        </Typography>
                        <Typography variant="h5" align="center" color="text.secondary" paragraph>
                            TradeTime is your one-stop site for all things auctions. Discover {auctionCount.toString()} listings on now!
                        </Typography>
                        <Stack
                            sx={{ pt: 4 }}
                            direction="row"
                            spacing={2}
                            justifyContent="center"
                        >
                            <Button variant="contained" onClick={handleClickRegister}>Sign up now</Button>
                            <Button variant="outlined" onClick={handleClickLogIn}>Log in</Button>
                        </Stack>
                    </Container>
                </Box>

                <Container sx={{ py: 8 }} >
                    {/* End hero unit */}

                    <Stack
                        sx={{ pt: 4 }}
                        direction="row"
                        spacing={2}
                        justifyContent="center"
                    >
                        <Box sx={{marginBottom: 5}}>
                            <Pagination count={10} variant="outlined" color="primary" />
                        </Box>
                    </Stack>




                    <Grid container spacing={4}>
                        {auctions.map((auction) => (
                            <Grid item key={auction.auctionId} xs={5} sm={6} md={4}>
                                <Card
                                    sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                                >
                                    <CardMedia
                                        component="img"
                                        sx={{
                                            // 16:9
                                            width: 390,
                                            height: 200
                                        }}
                                        image={"http://localhost:4941/api/v1/auctions/" + auction.auctionId + "/image"}
                                        alt="random"
                                    />
                                    <CardContent sx={{ flexGrow: 1 }}>

                                        <Typography gutterBottom variant="overline" component="h2">
                                            {categories[auction.categoryId-1].name}
                                        </Typography>

                                        <Typography gutterBottom variant="h6" component="h2">
                                            {auction.title}
                                        </Typography>
                                        <Typography variant="caption">
                                            Listed by {auction.sellerFirstName} {auction.sellerLastName}

                                        </Typography>

                                        <Typography variant="caption">
                                            {auction.sellerFirstName}
                                        </Typography>

                                    </CardContent>
                                    <CardActions>
                                        <Button size="small" href={"/auctions/" + auction.auctionId}>View</Button>
                                        <Button size="small">Bid</Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </main>
            {/* Footer */}
            <Box sx={{ bgcolor: 'background.paper', p: 6 }} component="footer">
                <Typography variant="h6" align="center" gutterBottom>
                    Footer
                </Typography>
                <Typography
                    variant="subtitle1"
                    align="center"
                    color="text.secondary"
                    component="p"
                >
                    Something here to give the footer a purpose!
                </Typography>

            </Box>
            {/* End footer */}
        </ThemeProvider>
    )
}
import Sidebar from './templates/Sidebar';
import { Box, Typography, Avatar } from '@mui/material';
import { getPage, LocalStorage, Redirect } from "./Utils";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightToBracket } from '@fortawesome/free-solid-svg-icons';

// Page import
import Login from './pages/forms/Login';
import Home from './pages/Home';
import Alert from './pages/Alert';
import MessageBoard from './pages/MessageBoard';
import Pictures from './pages/Pictures';
import Law from'./pages/Law';

import SignupReq from './pages/req/SignupReq';
import Rename from './pages/req/Rename';
import ChangeServ from './pages/req/ChangeServ';

import McservBrd from './pages/McservBrd';

function App() {
    const ls = LocalStorage();

    if (getPage() === "error404") {
        return (
            <div className={"contents"}>
                <div style={{display: "flex", justifyContent: "center"}}>
                    <Typography sx={{fontFamily: "SeoulNamsan", color: "black", fontSize: "2rem"}}>
                        ERROR
                    </Typography>
                    <Typography sx={{fontFamily: "SeoulNamsan", color: "red", fontSize: "2rem"}}>
                        404
                    </Typography>
                </div><br/>
                <Typography sx={{fontFamily: "SeoulNamsan", color: "gray", fontSize: "1.2rem"}}>
                    PAGE NOT FOUND
                </Typography>
            </div>
        );
    }

    // Contents
    let contents;

    // eslint-disable-next-line
    switch (getPage()) {
        case "login": contents = <Login/>; break;
        case "home": contents = <Home/>; break;
        case "alert": contents = <Alert/>; break;
        case "msgbrd": contents = <MessageBoard/>; break;
        case "picture": contents = <Pictures/>; break;
        case "law": contents = <Law/>; break;

        case "signup": contents = <SignupReq/>; break;
        case "rename": contents = <Rename/>; break;
        case "chgserv": contents = <ChangeServ/>; break;

        case "mcservboard": contents = <McservBrd/>; break;
    }

    if (ls.get("id") === null && ls.get("pwd") !== null) { ls.remove("pwd"); Redirect(".", false); }
    if (ls.get("id") !== null && ls.get("pwd") === null) { ls.remove("id"); Redirect('.', false); }

    return (
        <div className={"contents"} style={{display: "flex"}}>
            <Sidebar/>
            {/* Topbar*/}
            <Box sx={{
                position: "fixed",
                backgroundColor: "white",
                justifyContent: "left",
                alignItems: "flex-start",
                width: "100%",
                marginLeft: "280px"
            }}>
                <Box sx={{
                    display: "flex",
                    height: "62px",
                    borderBottom: "1px solid #E6E6E6",
                    borderLeft: "1px solid #E6E6E6"
                }}>
                    { (ls.get("id") === null) ? (
                        <a style={{
                            display: "flex",
                            transition: "all .2s",
                            cursor: "pointer",
                            color: "rgb(47,98,143)",
                            textDecoration: "none",
                            width: "70px",
                            height: "30px",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: "3px",
                            marginTop: "auto",
                            marginBottom: "auto",
                            marginLeft: "10px",
                            padding: "3px"
                        }} className={"loginbtn"} href={".?pid=login"}>
                            <Typography sx={{
                                pr: "8px",
                                mt: "3.5px",
                                mb: "auto",
                                fontFamily: "SeoulNamsan"
                            }}>로그인</Typography>
                            <Typography sx={{
                                mt: "auto",
                                mb: "auto"
                            }}>
                                <FontAwesomeIcon icon={faRightToBracket}/>
                            </Typography>
                        </a>
                    ) : (
                        <Box sx={{
                            display: "flex",
                            alignItems: "center",
                            ml: "10px",
                            cursor: "pointer"
                        }}>
                            <Avatar sx={{width: "30px", height: "30px", mr: "10px"}}>T</Avatar>
                            <Typography sx={{
                                fontFamily: "SeoulNamsan",
                                fontWeight: "bold",
                                fontSize: "1.15rem",
                                mt: "3px",
                                mr: "5px"
                            }}>
                                { ls.get("id") }
                            </Typography>
                        </Box>
                    )}
                </Box>
            </Box>
            <div style={{
                marginLeft: "280px",
                marginTop: "62px"
            }}>
                {contents}
            </div>
        </div>
      );
}

export default App;
import mcicon from '../../icons/mcicon.png';
import servericon from '../../icons/servericon.png';
import discordicon from './../../icons/discordicon.png';

import { LocalStorage, Redirect } from '../../Utils';
import { useState } from 'react';
import $ from 'jquery';

import {
    Box,
    Typography,
    TextField
} from "@mui/material";
import { LoadingButton } from '@mui/lab';
import useMediaQuery from '@mui/material/useMediaQuery';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCircle
} from '@fortawesome/free-solid-svg-icons';

export default function Login() {
    const [btnloading, setbtnloading] = useState(false);
    const [err, seterr] = useState(false);
    const [txt, settxt] = useState("");

    const ls = LocalStorage();
    if (ls.get("id") !== null) {
        alert("잘못된 접근입니다.");
        Redirect(".", true);
    }

    let boxStyle = {
        width: "350px",
        textAlign: "center",
        p: "10px"
    };

    // Check : height 1000px
    if (useMediaQuery('(min-height: 1000px)')) Object.assign(boxStyle, {mt: "300px"});
    else Object.assign(boxStyle, {mt: "150px"});

    // Check : width 1200px
    if (useMediaQuery('(min-width: 1700px)')) Object.assign(boxStyle, {ml: "200px"});
    // Check : width 850px
    // else if (useMediaQuery('(min-width: 850px)')) Object.assign(boxStyle, {ml: "100px"});
    else Object.assign(boxStyle, {ml: "100px"});

    return (
        <div className={"contents"}>
            <Box sx={boxStyle}>
                <Box sx={{display: "flex", justifyContent: "center"}}>
                    <Box sx={{textAlign: "center", display: "inline-block"}}>
                        <Typography sx={{
                            fontFamily: "SeoulNamsan",
                            fontSize: "1.8rem",
                            fontWeight: "bold"
                        }}>
                            로그인
                        </Typography>
                        <Typography sx={{
                            fontFamily: "SeoulNamsan",
                            fontSize: "1.2rem",
                            fontWeight: "bold",
                            color: "gray",
                            mt: "-8px",
                        }}>
                            LOG IN
                        </Typography>
                    </Box>
                    <span style={{fontSize: "0.5rem", marginTop: "auto", marginBottom: "auto", marginLeft: "20px"}}>
                        <FontAwesomeIcon icon={faCircle}/>
                    </span>
                    <img src={servericon} alt={"logo"} style={{
                        width: "40px",
                        height: "40px",
                        marginTop: "auto",
                        marginBottom: "auto",
                        marginLeft: "20px",
                        borderRadius: "3px"
                    }}/>
                    <img src={discordicon} alt={"logo2"} style={{
                        width: "40px",
                        height: "40px",
                        marginTop: "auto",
                        marginBottom: "auto",
                        marginLeft: "10px"
                    }}/>
                    <img src={mcicon} alt={"logo2"} style={{
                        width: "40px",
                        height: "40px",
                        marginTop: "auto",
                        marginBottom: "auto",
                        marginLeft: "10px"
                    }}/>
                </Box>
                <Box sx={{mt: "50px"}}>
                    <iframe name={"dummy"} style={{display: "none"}} title={"dummy"}/>
                    <form target={"dummy"} onSubmit={() => {
                        setbtnloading(true);
                        seterr(false);
                        settxt("");

                        const id = document.getElementById("id").value;
                        const pwd = document.getElementById("pwd").value;

                        if (id === '') {
                            seterr(true);
                            settxt("필수 입력란입니다.");
                            setbtnloading(false);
                            return;
                        } else if (pwd === '') {
                            seterr(true);
                            settxt("필수 입력란입니다.");
                            setbtnloading(false);
                            return;
                        }

                        $.ajax({
                            url: "login.php",
                            data: {
                                ctpd: process.env.REACT_APP_CTPD,
                                id: id,
                                pwd: pwd
                            },
                            type: "post"
                        }).then((r) => {
                            const response = JSON.parse(r);
                            if (response.status) {
                                ls.set("id", id);
                                ls.set("pwd", pwd);
                                Redirect(".", true);
                            } else {
                                seterr(true);
                                settxt("아이디 또는 비밀번호가 잘못되었습니다.");
                                setbtnloading(false);
                            }
                        })
                    }}>
                        <TextField id={"id"} error={err} helperText={txt} label={"DSL 아이디"} type={"id"} autoComplete={"id"} variant={"outlined"} sx={{width: "310px"}}/>
                        <TextField id={"pwd"} error={err} helperText={txt} label={"비밀번호"} type={"password"} autoComplete={"password"} variant={"outlined"} sx={{width: "310px", mt: "10px"}}/>
                        <LoadingButton loading={btnloading} type={"submit"} sx={{
                            width: "310px",
                            height: "45px",
                            mt: "20px",
                            fontSize: "1rem",
                            backgroundColor: "#277c9d",
                            color: "#FFFFFF",
                            ':hover': {
                                backgroundColor: "#8ab5e0",
                                color: "black"
                            }
                        }}>
                            <Typography sx={{fontFamily: "SeoulNamsan"}}>
                                로그인
                            </Typography>
                        </LoadingButton>
                    </form>
                </Box>
            </Box>
        </div>
    )
}
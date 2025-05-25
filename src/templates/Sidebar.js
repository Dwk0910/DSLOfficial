import { Redirect, getPage } from '../Utils';
import { Box, Button, Typography, Divider } from "@mui/material";

import servericon from '../icons/servericon.png';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faHome,
    faBullhorn,
    faCamera,
    faArrowsRotate,
    faUpload,
    faHammer,
    faDesktop,
    faUserPlus,
    faBookBookmark
} from "@fortawesome/free-solid-svg-icons";

function Sidebar() {
    // seperate : 기본
    const menuList = [{
        id: 1,
        title: "home",
        key: "home",
        icon: faHome,
        redirect: "."
    }, {
        id: 2,
        title: "공지",
        key: "alert",
        icon: faBullhorn,
        redirect: ".?pid=2"
    }, {
        id: 3,
        title: "법률",
        key: "law",
        icon: faBookBookmark,
        redirect: ".?pid=3"
    }, {
        id: 4,
        title: "사진방",
        key: "picture",
        icon: faCamera,
        redirect: ".?pid=4"
    }, {
        id: 5,
        title: "messageboard",
        key: "msgbrd",
        icon: faUpload,
        redirect: ".?pid=msgbrd"
    }];

    // seperate : 신청 관련
    const menuList_sep1 = [{
        id: 1,
        title: "이름변경신청",
        key: "rename",
        icon: faArrowsRotate,
        redirect: ".?pid=req&type=rename"
    }, {
        id: 2,
        title: "서버건의함",
        key: "chgserv",
        icon: faHammer,
        redirect: ".?pid=req&type=chgserv"
    }, {
        id: 3,
        title: "회원가입신청",
        key: "signup",
        icon: faUserPlus,
        redirect: ".?pid=req&type=signup"
    }];

    // seperate : 서버 관련
    const menuList_sep2 = [{
        id: 1,
        title: "서버 대시보드",
        key: "mcservboard",
        icon: faDesktop,
        redirect: ".?pid=mcserv"
    }]

    const menu = [];
    menuList.map((m) => {
        let sx;
        if (m.key === getPage()) {
            sx = {
                width: "100%",
                color: "black",
                justifyItems: "left",
                justifyContent: "left",
                borderLeft: "3px solid rgb(80, 162, 255)",
                borderRadius: "0px"
            };
        } else {
            sx = {
                width: "100%",
                color: "gray",
                justifyItems: "left",
                justifyContent: "left",
                borderRadius: "0px"
            };
        }

        menu.push(
            <Button sx={sx} onClick={() => {
                Redirect(m.redirect, false)
            }} key={m.id}>
                <Box sx={{
                    ml: "10px",
                    mr: "10px"
                }}>
                    <FontAwesomeIcon icon={m.icon}/>
                </Box>
                <Typography sx={{
                    ml: "4px",
                    fontFamily: "SeoulNamsan"
                }}>{m.title}</Typography>
            </Button>
        );
        return null;
    });

    // seps
    const menu_sep1 = [];
    menuList_sep1.map((m) => {
        let sx;
        if (m.key === getPage()) {
            sx = {
                width: "100%",
                color: "black",
                justifyItems: "left",
                justifyContent: "left",
                borderLeft: "3px solid rgb(80, 162, 255)",
                borderRadius: "0px"
            };
        } else {
            sx = {
                width: "100%",
                color: "gray",
                justifyItems: "left",
                justifyContent: "left",
                borderRadius: "0px"
            };
        }

        menu_sep1.push(
            <Button sx={sx} onClick={() => {
                Redirect(m.redirect, false)
            }} key={m.id}>
                <Box sx={{
                    ml: "10px",
                    mr: "10px"
                }}>
                    <FontAwesomeIcon icon={m.icon}/>
                </Box>
                <Typography sx={{
                    ml: "4px",
                    fontFamily: "SeoulNamsan"
                }}>{m.title}</Typography>
            </Button>
        );
        return null;
    });

    const menu_sep2 = [];
    menuList_sep2.map((m) => {
        let sx;
        if (m.key === getPage()) {
            sx = {
                width: "100%",
                color: "black",
                justifyItems: "left",
                justifyContent: "left",
                borderLeft: "3px solid rgb(80, 162, 255)",
                borderRadius: "0px"
            };
        } else {
            sx = {
                width: "100%",
                color: "gray",
                justifyItems: "left",
                justifyContent: "left",
                borderRadius: "0px"
            };
        }

        menu_sep2.push(
            <Button sx={sx} onClick={() => {
                Redirect(m.redirect, false)
            }} key={m.id}>
                <Box sx={{
                    ml: "10px",
                    mr: "10px"
                }}>
                    <FontAwesomeIcon icon={m.icon}/>
                </Box>
                <Typography sx={{
                    ml: "4px",
                    fontFamily: "SeoulNamsan"
                }}>{m.title}</Typography>
            </Button>
        );
        return null;
    });

    return (
        <Box sx={{
            width: "280px",
            height: "100%",
            borderRight: "1px solid #E6E6E6",
            position: "fixed"
        }}>
            <Box sx={{display: "flex", cursor: "pointer", pt: "10px", mb: "5px", ml: "10px"}} onClick={() => {
                Redirect(".", true);
            }}>
                <img style={{marginTop: "0", marginRight: "2px", width: "40px", height: "40px", borderRadius: "10px"}} src={servericon} alt={"logo"}/>
                <Typography sx={{fontFamily: "SeoulNamsan", ml: "7px", mt: "7px", mb: "auto", fontSize: "1.3rem"}}>DSL OFFICIAL SERVER</Typography>
            </Box>
            <Divider sx={{mt: "4px", color: "gray", fontSize: "0.8rem"}}>기본</Divider>
            { menu }
            <Divider sx={{mt: "4px", color: "gray", fontSize: "0.8rem"}}>신청</Divider>
            { menu_sep1 }
            <Divider sx={{mt: "4px", color: "gray", fontSize: "0.8rem"}}>마인크래프트 서버</Divider>
            { menu_sep2 }
        </Box>
    );
}

export default Sidebar;
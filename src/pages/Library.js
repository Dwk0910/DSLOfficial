import * as React from 'react';
import MDEdit from "@uiw/react-md-editor";
import { getURLString } from '../Util';

import library_banner from '../docs/banners/library_banner.png';
import forMC_banner_day from '../docs/Library/Library_forMC_Day.png';
import forMC_banner_night from '../docs/Library/Library_forMC_Night.png';
import forMC_CheckDSLOfficial from '../docs/Library/forMC_CheckDSLServers.png';
import forMC_plugin_resource from '../docs/Library/forMC_plugin_and_resource.png';
import forMC_DSLModUpdater from '../docs/Library/forMC_DSLModUpdater.png';

// Information Screenshots
import DCS_Screenshot_1 from '../docs/Library/Information/DCS/1.png';
import DCS_Screenshot_2 from '../docs/Library/Information/DCS/2.png';
import DCS_Screenshot_3 from '../docs/Library/Information/DCS/3.png';

// Guide Pictures
import guide_1 from '../docs/Library/InstallationGuide/1.png';
import guide_2 from '../docs/Library/InstallationGuide/2.png';
import guide_3 from '../docs/Library/InstallationGuide/3.png';
import guide_4 from '../docs/Library/InstallationGuide/4.png';
import guide_5 from '../docs/Library/InstallationGuide/5.png';
import guide_6 from '../docs/Library/InstallationGuide/6.png';
import guide_7 from '../docs/Library/InstallationGuide/7.png';
import guide_8 from '../docs/Library/InstallationGuide/8.png';
import guide_9 from '../docs/Library/InstallationGuide/9.png';
import guide_10 from '../docs/Library/InstallationGuide/10.png';
import guide_11 from '../docs/Library/InstallationGuide/11.png';
import guide_12 from '../docs/Library/InstallationGuide/12.png';
import guide_13 from '../docs/Library/InstallationGuide/13.png';
import guide_14 from '../docs/Library/InstallationGuide/14.png';
import guide_15 from '../docs/Library/InstallationGuide/15.png';
import guide_16 from '../docs/Library/InstallationGuide/16.png';
import guide_17 from '../docs/Library/InstallationGuide/17.png';
import guide_18 from '../docs/Library/InstallationGuide/18.png';
import guide_19 from '../docs/Library/InstallationGuide/19.png';

export default function Library() {
    document.title = "DSL OFFICIAL - 자료실";
    let page;

    const now = new Date(Date.now());
    const isNight = now.getHours() >= 19 || now.getHours() <= 6;
    const forMC_banner = (isNight) ? forMC_banner_night : forMC_banner_day;

    const target = getURLString("t");
    if (target === "0") {
        // 기본화면 (사용자가 메뉴를 선택하지 않음)
        page = (
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div style={{ border: '1px solid gray', backgroundColor: (isNight) ? 'black' : 'white' }}>
                    <img src={forMC_banner} alt={"forMC_banner"} width={"350px"}/>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '15px' }}>
                    <img className={"childhoverstyle"} src={forMC_CheckDSLOfficial} width={"100%"} alt={"forMC_CheckDSLOfficial"} style={{ border: '1px solid gray' }} onClick={ () => window.location.assign(".?pid=4&t=1") }/>
                    <img className={"childhoverstyle"} src={forMC_plugin_resource} width={"100%"} alt={"forMC_plugin_resource"} style={{ border: '1px solid gray', marginTop: '10px' }} onClick={ () => window.location.assign(".?pid=4&t=2") }/>
                    <img className={"childhoverstyle"} src={forMC_DSLModUpdater} width={"100%"} alt={"forMC_DSLModUpdater"} style={{ border: '1px solid gray', marginTop: '10px', height: '300px' }} onClick={ () => window.location.assign(".?pid=4&t=3") } />
                </div>
            </div>
        );
    } else {
        // 사용자가 메뉴를 선택한 것
        switch (target) {
            case "1": {
                // DSL공식 운영서버 확인
                document.documentElement.setAttribute("data-color-mode", "light");
                let main_section = (<span style={{ color: 'gray', marginTop: '150px' }}>설명을 보실 서버를 선택해주세요</span>);

                const serverList = [
                    {
                        name: 'DSL CITY SERVER',
                        link: '.?pid=4&t=1&st=1',
                        content: '# DSL CITY SERVER\n' +
                            '### 개요\n' +
                            'DSL CITY SERVER(DCS)는 2023년 7월 시작하여 DSL에서의 중요 마인크래프트 서버로 자리잡은 **도시 개발 서버**입니다.<br/>서버는 버스와 지하철 등 교통시설을 바탕으로 건축되며, 서버 내에서는 큰 도시들과 많은 건물들이 자리잡고 있습니다.<br/>서버에 참여해서, 자신만의 건물을 짓고, 자신만의 도시를 꾸며보세요!\n' +
                            '\n' +
                            '### 참여\n' +
                            '| 서버링크 | 서버버전 | 비고 |\n' +
                            '| ---------- | ---------- | ------ |\n' +
                            '| mcserver.dslofficial.org | Forge 1.18.2 | DSLModUpdater를 통한 모드 다운로드 필수\n' +
                            '\n' +
                            '### 서버 스크린샷\n' +
                            `![DCS_Screenshot_1](${DCS_Screenshot_1})\n` +
                            `![DCS_Screenshot_2](${DCS_Screenshot_2})\n` +
                            `![DCS_Screenshot_3](${DCS_Screenshot_3})`
                    },
                    {
                        name: 'playDSL',
                        link: '.?pid=4&t=1&st=2',
                        content: '# playDSL\n' +
                            '### 개요\n' +
                            'playDSL (DSL놀이터) 서버는 [마플 마인크래프트 채널](https://www.youtube.com/@MOMOISDOG) 에서 영감을 받아 만든 **DSL의 놀이터 서버** 입니다. 2023년 4월 시작하여 서버에서 스트레스를 푸는 하나의 놀이터의 역할이 되어 주었지만, 1년도 유지되지 못한 채 현재는 운영 중지 상태에 있습니다.\n' +
                            '\n' +
                            '### 참여\n' +
                            '| 서버링크 | 서버버전 | 비고 |\n' +
                            '| ---------- | ---------- | ---- |\n' +
                            '| ~~playdsl.kro.kr~~ **운영중단** | Release 1.19.2 | PaperMC (추가 작업 필요없음)'
                    }
                ];

                const style_default = {
                    borderTop: '1px solid gray',
                    width: '92.5%',
                    padding: '10px',
                    paddingTop: '10px'
                };

                const style_checked = {
                    borderTop: '1px solid gray',
                    width: '92.5%',
                    padding: '10px',
                    paddingTop: '10px',
                    borderLeft: '2px solid skyblue',
                    backgroundColor: 'rgba(200, 210, 250, 0.3)'
                };

                const target_serv = getURLString("st");
                // target_serv에 맞는 서버설명이 없는가? (단 target_serv가 '0'이 아니여야 함. 즉, 설명할 서버가 선택되어 있는 상태에서, 그 선택한 서버를 찾을 수 없는 경우 실행)
                if (!serverList[target_serv - 1] && target_serv !== "0") {
                    window.location.assign('.?pid=er404');
                    return;
                }

                page = (
                    <div style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
                        <div className={"option_section"} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '30%', borderRight: '1px solid gray', fontFamily: 'suite', minHeight: '100vh' }}>
                            <span style={{ marginTop: '10px', marginBottom: '10px' }}><span style={{ fontSize: '0.8rem' }}>DSL 공식</span> <span style={{ fontWeight: 'bold', fontSize: '1.05rem' }}>Minecraft 운영서버</span></span>
                            {
                                serverList.map((item, idx) => <span key={idx} className={"menuhoverstyle"} style={(target_serv === (idx + 1).toString()) ? style_checked : style_default} onClick={() => window.location.assign(item.link)}>{ item.name }</span>)
                            }
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', width: "70%" }}>
                            <div className={"main_section"} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: 'suite' }}>
                                <div style={{ display: 'flex', justifyContent: 'flex-start', width: '100%' }}>
                                    <span className={"hoverstyle"} style={{ fontFamily: 'suite', marginLeft: '25px', marginTop: '10px' }} onClick={ () => window.location.assign(".?pid=4") }>{"< 돌아가기"}</span>
                                </div>
                        {
                            (target_serv === "0") ? main_section : (
                                <React.Fragment>
                                    <MDEdit.Markdown source={serverList[target_serv - 1].content.toString()} style={{ fontFamily: 'suite', width: '97%', marginLeft: '15px', paddingLeft: '2%', marginTop: '5px' }}/>
                                </React.Fragment>
                            )
                        }
                            </div>
                        </div>
                    </div>
                );
                break;
            }
            case "2": {
                // DCS 적용 Plugin & Resource Pack
                alert("아이디어 고갈");
                window.history.back();
                break;
            }
            case "3": {
                // DSLModUpdater
                document.documentElement.setAttribute("data-color-mode", "light");
                page = (
                    <div style={{ width: '100%' }}>
                        <span className={"hoverstyle"} style={{ fontFamily: 'suite', marginTop: '10px' }} onClick={ () => window.location.assign(".?pid=4") }>{"< 돌아가기"}</span>
                        <MDEdit.Markdown style={{ fontFamily: 'suite' }} source={
                            "# DSLModUpdater\n" +
                            "### 1. 개요\n" +
                            "DSLModUpdater는 `Java JDK 17`을 기반으로 만들어진 서버 모드 다운로드 매니저입니다.<br/>" +
                            "`DCS`에 접속을 원하는 멤버들은 이 프로그램을 다운받아 사용하면 **서버 내 많은 모드들을 한 번에 다운받으실 수 있으며**,<br/> 이를 통하여 모드들을 수동적으로 찾는 수고를 덜 수 있습니다.<br/>" +
                            "***이제 모드를 직접 다운로드 하는 시대는 끝났습니다. 신세대를 맞이합시다!***\n\n" +
                            "### 2. 설치 및 사용\n" +
                            "> [**DSLModUpdater v1.1.0 다운로드 링크**](https://drive.google.com/file/d/1eBToOC4Fyu7DPqkbBokAaH_r9r4FESJ5/view?usp=sharing)<br/>\n\n" +
                            "#### 패치노트 (v1.1.0)\n\n" +
                            "Release Date : 2025.04.17.\n\n" +
                            "##### 새로운 기능\n\n" +
                            "- 이제부터 `.exe` `.bat`이 기본적으로 탑재되어 배포됩니다.\n" +
                            "- 대대적인 UI 업데이트\n" +
                            "- 이제 모드 추가 신청을 하실 수 있습니다\n" +
                            "- 모드들은 이제부터 버전명으로 관리됩니다\n" +
                            "  (예) '2024FEB01', '2025JAN07' 등등\n\n" +
                            "##### 버그 수정\n\n" +
                            "- 윈도우에서 한글이 깨지던 오류를 수정했습니다.\n" +
                            "- 자바 `UnsupportedClassVersionError`를 수정했습니다. 이제 `JAR`도 같이 배포되며, `Java`를 설치할 필요가 없습니다.\n" +
                            "- `temp` 폴더를 찾을 수 없다는 오류를 수정했습니다.\n\n" +
                            "#### 2.1. 실행\n" +
                            "설치 후 빈 폴더에 압축을 푸신 뒤, `DSLModUpdater.exe` 파일을 실행합니다. 만약 바이러스 검사로 인해 실행이 되지 않는다면, `compile` 폴더의 `run.bat` 파일로 이를 대체할 수 있습니다.<br/><br/>" +
                            `![InstallationGuide_1](${guide_1}) <br/>` +
                            "또는 <br/>" +
                            `![InstallationGuide_2](${guide_2}) <br/>` +
                            `![InstallationGuide_3](${guide_3}) <br/>\n` +
                            "# \n" +
                            `![InstallationGuide_4](${guide_4}) <br/>\n` +
                            "> `Enter`를 눌러 계속합니다\n\n" +
                            "# \n" +
                            "#### 2.2. `mods`폴더 경로 넣기 (`mods`폴더의 `절대경로`를 알고, 넣으실 수 있는 분은 2.3 단계로 넘어가십시오)\n\n" +
                            `![InstallationGuide_5](${guide_5}) <br/>\n` +
                            "> `Win + R`을 누릅니다\n\n" +
                            `![InstallationGuide_6](${guide_6}) <br/>\n` +
                            `![InstallationGuide_7](${guide_7}) <br/>\n` +
                            "> `열기` 란에 `%appdata%`를 넣은 뒤, `확인` 버튼을 누릅니다.\n\n" +
                            `![InstallationGuide_8](${guide_8}) <br/>\n` +
                            "> 파일 탐색기가 열리면, `.minecraft` 폴더에 들어갑니다. 없는 경우, `Minecraft`를 먼저 설치하십시오.\n\n" +
                            `![InstallationGuide_9](${guide_9}) <br/>\n` +
                            "> `mods` 폴더에 들어갑니다. 없을 경우 새로 만듭니다.\n\n" +
                            `![InstallationGuide_10](${guide_10}) <br/>\n` +
                            `![InstallationGuide_11](${guide_11}) <br/>\n` +
                            "> 위의 주소창에서 `mods`를 우클릭 한 뒤, `주소 복사`를 클릭합니다.\n\n" +
                            `![InstallationGuide_12](${guide_12}) <br/>\n` +
                            "> 다시 `DSLModUpdater`로 돌아와, `Ctrl + V`로 붙여 넣습니다.\n\n" +
                            "> `Enter`를 눌러 계속합니다\n\n" +
                            "# \n" +
                            "#### 2.3. 서버 모드 적용하기" +
                            `![InstallationGuide_13](${guide_13}) <br/>\n` +
                            "> `1`을 입력한 후, `Enter`를 누릅니다\n\n" +
                            `![InstallationGuide_14](${guide_14}) <br/>\n` +
                            "> `y` 또는 `yes`를 입력한 후, `Enter`를 누릅니다\n\n" +
                            `![InstallationGuide_15](${guide_15}) <br/>\n` +
                            "서버 내 모든 모드들을 알아서 가져온 뒤 설치합니다.\n\n" +
                            `![InstallationGuide_16](${guide_16}) <br/>\n` +
                            "모드의 버전명이 일치한 것을 알 수 있습니다. (이 때, 입력한 `mods` 폴더에 가보면 모드들이 설치되어 있는 것을 확인하실 수 있습니다)\n\n" +
                            "# \n" +
                            "#### 2.4. 업데이터 종료" +
                            `![InstallationGuide_17](${guide_17}) <br/>\n` +
                            `![InstallationGuide_18](${guide_18}) <br/>\n` +
                            `![InstallationGuide_19](${guide_19}) <br/>\n` +
                            "> `3(뒤로가기)` → `3(업데이터 종료)` → `y`를 눌러 업데이터를 종료합니다\n" +
                            "# \n" +
                            "### 3. Credits\n" +
                            "@neatore는 여러분들의 편하고 재밌는 서버생활을 위해 항상 코딩합니다<br/>버그제보는 @neatore 또는 @dongwan0910 DM으로 부탁드립니다.<br/> **감사합니다.**\n" +
                            "# \n" +
                            "***Thanks for reading!***<br/>" +
                            "Copyright 2024-2025. DSL All rights reserved.<br/><br/>"
                        }/>
                    </div>
                );
                break;
            }
            default: {
                window.location.assign(".?pid=er404");
                return;
            }
        }
    }

    // Final : return
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '10px', width: '90.9%' }}>
            <img src={library_banner} alt={"banner"} width={"100%"} style={{ marginBottom: '10px' }} />
            { page }
        </div>
    );
}
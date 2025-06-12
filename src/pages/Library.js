import * as React from 'react';
import MDEdit from "@uiw/react-md-editor";
import { getURLString } from '../Util';

import library_banner from '../docs/banners/library_banner.png';
import forMC_banner_day from '../docs/Library/Library_forMC_Day.png';
import forMC_banner_night from '../docs/Library/Library_forMC_Night.png';
import forMC_CheckDSLOfficial from '../docs/Library/forMC_CheckDSLServers.png';
import forMC_plugin_resource from '../docs/Library/forMC_plugin_and_resource.png';
import forMC_DSLModUpdater from '../docs/Library/forMC_DSLModUpdater.png';

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
                            '![DCS_Screenshot_1](https://media.discordapp.net/attachments/1159894364571566100/1333084466754617446/2025-01-26_23.41.32.png?ex=684b8fe8&is=684a3e68&hm=aff8545b01ff306bf60dc502d90e2b3d95359df529a49993cf51ded4efeaa280&=&format=webp&quality=lossless)\n' +
                            '![DCS_Screenshot_2](https://cdn.discordapp.com/attachments/1159894364571566100/1333085261353058304/2025-01-26_23.44.36.png?ex=684b90a5&is=684a3f25&hm=fa82bbce91aec9a7f59beafd4547caf85d07f5fedecfc4eb5e87428241fd7cd1&)\n' +
                            '![DCS_Screenshot_3](https://cdn.discordapp.com/attachments/1302288650968502404/1379368483137130607/image.png?ex=684bda01&is=684a8881&hm=d7bb7acf1fe4e4fefcfee7428ecd7bf146d4744a3ca2bf26143942ce30bae099&)'
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
                            "#### 2.1. 실행\n" +
                            "> [**DSLModUpdater 다운로드 링크**](https://rb.gy/hvggmk)<br/>\n\n" +
                            "설치 후 빈 폴더에 압축을 푸신 뒤, `DSLModUpdater.exe` 파일을 실행합니다. 만약 바이러스 검사로 인해 실행이 되지 않는다면, `compile` 폴더의 `run.bat` 파일로 이를 대체할 수 있습니다.<br/><br/>" +
                            "![InstallationGuide_1](https://cdn.discordapp.com/attachments/753612337461854302/1382757982667931829/image.png?ex=684c5139&is=684affb9&hm=150637d3d3218a59de105efd43f6364bc1b13fd52a3251b6b10299ce4a8b6c93&) <br/>" +
                            "또는 <br/>" +
                            "![InstallationGuide_2](https://cdn.discordapp.com/attachments/753612337461854302/1382758239732764703/image.png?ex=684c5176&is=684afff6&hm=e441799ccd5f1d4de99f39cb29596470cd872c47eaf8759a9d3489e7d9e1f214&) <br/>" +
                            "![InstallationGuide_3](https://cdn.discordapp.com/attachments/753612337461854302/1382758304412995774/image.png?ex=684c5186&is=684b0006&hm=b86392e3cd87f3d74269c6fe6df130ea4a05273284a4ad65f4e6086781eb91aa&) <br/>\n" +
                            "# \n" +
                            "![InstallationGuide_4](https://cdn.discordapp.com/attachments/753612337461854302/1382759922004922438/image.png?ex=684c5307&is=684b0187&hm=69114bda2d27a4e0a2ec252f7f392fcfb12cd6095fd2702b6ba8a917aefd3697&) <br/>\n" +
                            "> `Enter`를 눌러 계속합니다\n\n" +
                            "# \n" +
                            "#### 2.2. `mods`폴더 경로 넣기 (`mods`폴더의 `절대경로`를 알고, 넣으실 수 있는 분은 2.3 단계로 넘어가십시오)\n\n" +
                            "![InstallationGuide_5](https://cdn.discordapp.com/attachments/753612337461854302/1382760240205795348/image.png?ex=684c5353&is=684b01d3&hm=055c9450563145d7a1bcdb657162e82d58e10e37d47bf528bce9d146ba12c43d&) <br/>\n" +
                            "> `Win + R`을 누릅니다\n\n" +
                            "![InstallationGuide_5](https://cdn.discordapp.com/attachments/753612337461854302/1382761500418113556/image.png?ex=684c5480&is=684b0300&hm=9d928fac629f73be4de6ba715fb7db44b52c192ea4c0259460fac24cad4239dd&) <br/>\n" +
                            "> `열기` 란에 `%appdata%`를 넣은 뒤, `확인` 버튼을 누릅니다.\n\n" +
                            "![InstallationGuide_6](https://cdn.discordapp.com/attachments/753612337461854302/1382762101810139186/image.png?ex=684c550f&is=684b038f&hm=151c71ce3f7ff72651d4e1943ce8c63273e26a1fc19bf76a6602e18d7b112777&) <br/>\n" +
                            "![InstallationGuide_7](https://cdn.discordapp.com/attachments/753612337461854302/1382762408845639700/image.png?ex=684c5558&is=684b03d8&hm=163109c009e14f642cde6dc0beff46f1bf93685b5c0ae0ad99674a232c0dd6be&) <br/>\n" +
                            "> 파일 탐색기가 열리면, `.minecraft` 폴더에 들어갑니다. 없는 경우, `Minecraft`를 먼저 설치하십시오.\n\n" +
                            "![InstallationGuide_8](https://cdn.discordapp.com/attachments/753612337461854302/1382762707832275084/image.png?ex=684c55a0&is=684b0420&hm=dee23cb5c5fcf58991720aa4e0c93450d6fbe851e8e0b49c59fb1704b2eb7f3a&) <br/>\n" +
                            "> `mods` 폴더에 들어갑니다. 없을 경우 새로 만듭니다.\n\n" +
                            "![InstallationGuide_9](https://cdn.discordapp.com/attachments/753612337461854302/1382763235752808548/image.png?ex=684c561d&is=684b049d&hm=32b8e552e0af37a783b655def32d77e1bc958696d9833e150e87a287e85503cf&) <br/>\n" +
                            "![InstallationGuide_10](https://cdn.discordapp.com/attachments/753612337461854302/1382763288332472330/image.png?ex=684c562a&is=684b04aa&hm=b2e666e841976a0b8f12d70634d6a7e18a142d859de0d18cbd92bc4049499415&) <br/>\n" +
                            "> 위의 주소창에서 `mods`를 우클릭 한 뒤, `주소 복사`를 클릭합니다.\n\n" +
                            "![InstallationGuide_11](https://cdn.discordapp.com/attachments/753612337461854302/1382764254381473882/image.png?ex=684c5710&is=684b0590&hm=f8b3430ffaf30367df0ad1098b112816c36239efa1cf4eef2dabd5724bdce500&) <br/>\n" +
                            "> 다시 `DSLModUpdater`로 돌아와, `Ctrl + V`로 붙여 넣습니다.\n\n" +
                            "> `Enter`를 눌러 계속합니다\n\n" +
                            "# \n" +
                            "#### 2.3. 서버 모드 적용하기" +
                            "![InstallationGuide_12](https://cdn.discordapp.com/attachments/753612337461854302/1382764883774406747/image.png?ex=684c57a6&is=684b0626&hm=dce5be0ab3b642b81884fdc9a395167942cbd662789423eb776159ca9afb9376&) <br/>\n" +
                            "> `1`을 입력한 후, `Enter`를 누릅니다\n\n" +
                            "![InstallationGuide_13](https://cdn.discordapp.com/attachments/753612337461854302/1382765127022936164/image.png?ex=684c57e0&is=684b0660&hm=2f5773492aa953fa5513393406cfca44c24c99739e321a2c11169caaaec5fe1b&) <br/>\n" +
                            "> `y` 또는 `yes`를 입력한 후, `Enter`를 누릅니다\n\n" +
                            "![InstallationGuide_14](https://cdn.discordapp.com/attachments/753612337461854302/1382765506557378803/image.png?ex=684c583b&is=684b06bb&hm=d0c768f9a5dd4d4c77e0c23f8ca5f5f25d1b4d3d115102d74e040374c28c3c48&) <br/>\n" +
                            "서버 내 모든 모드들을 알아서 가져온 뒤 설치합니다.\n\n" +
                            "![InstallationGuide_15](https://cdn.discordapp.com/attachments/753612337461854302/1382765728763089097/image.png?ex=684c5870&is=684b06f0&hm=7ccbd42d0b88534e8556fc24fdb122ab56d005eedd5807933925815f81ec7f92&) <br/>\n" +
                            "모드의 버전명이 일치한 것을 알 수 있습니다. (이 때, 입력한 `mods` 폴더에 가보면 모드들이 설치되어 있는 것을 확인하실 수 있습니다)\n\n" +
                            "# \n" +
                            "#### 2.4. 업데이터 종료" +
                            "![InstallationGuide_16](https://cdn.discordapp.com/attachments/753612337461854302/1382766321644863489/image.png?ex=684c58fd&is=684b077d&hm=45ac5be4aa663b25a8788f8783aa12ff37219914ea50129e8556e053b877f591&) <br/>\n" +
                            "![InstallationGuide_17](https://cdn.discordapp.com/attachments/753612337461854302/1382766456197873714/image.png?ex=684c591d&is=684b079d&hm=0896f50a49a8c13fbdf2ba625914ed9a48e4a0878375f28bea0c79597a22d746&) <br/>\n" +
                            "![InstallationGuide_18](https://cdn.discordapp.com/attachments/753612337461854302/1382766511869005894/image.png?ex=684c592a&is=684b07aa&hm=ae92b28cfc97164bdedc21dc3769f6ec3a2347abed58ea6bb2b5b16d0376deaa&) <br/>\n" +
                            "> `3(뒤로가기)` → `3(업데이터 종료)` → `y`를 눌러 업데이터를 종료합니다\n" +
                            "# \n" +
                            "### 3. Cradits\n" +
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
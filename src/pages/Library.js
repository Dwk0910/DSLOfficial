import library_banner from '../docs/banners/library_banner.png';
import forMC_banner_day from '../docs/Library/Library_forMC_Day.png';
import forMC_banner_night from '../docs/Library/Library_forMC_Night.png';
import forMC_CheckDSLOfficial from '../docs/Library/forMC_CheckDSLServers.png';
import forMC_plugin_resource from '../docs/Library/forMC_plugin_and_resource.png';
import forMC_DSLModUpdater from '../docs/Library/forMC_DSLModUpdater.png';

export default function Library() {
    const now = new Date(Date.now());
    const isNight = now.getHours() >= 14 || now.getHours() <= 6;
    const forMC_banner = (isNight) ? forMC_banner_night : forMC_banner_day;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px', width: '90.9%' }}>
            <img src={library_banner} alt={"banner"} width={"100%"} style={{marginBottom: "20px"}}/>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div style={{ border: '1px solid gray', backgroundColor: (isNight) ? 'black' : 'white' }}>
                    <img src={forMC_banner} alt={"forMC_banner"} width={"350px"}/>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '15px' }}>
                    <img className={"childhoverstyle"} src={forMC_CheckDSLOfficial} width={"100%"} alt={"forMC_CheckDSLOfficial"} style={{ border: '1px solid gray' }}/>
                    <img className={"childhoverstyle"} src={forMC_plugin_resource} width={"100%"} alt={"forMC_plugin_resource"} style={{ border: '1px solid gray', marginTop: '10px' }} />
                    <img className={"childhoverstyle"} src={forMC_DSLModUpdater} width={"100%"} alt={"forMC_DSLModUpdater"} style={{ border: '1px solid gray', marginTop: '10px', height: '300px' }} />
                </div>
            </div>
        </div>
    );
}
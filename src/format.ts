
export interface weather {
    code: string
    metar: any
    taf: any
}

export async function format(weather: weather): Promise<string> {
    return `
        ${format_metar(weather.metar)}
        ${format_taf(weather.taf)}

See more details here. https://aviationweather.gov/adds/tafs/?station_ids=${weather.code}&std_trans=translated&submit_both=Get+TAFs+and+METARs
    `
}

function format_taf(taf: any) {

    console.log('formatting taf')

    let s = `
**TAF**
`;
    
    if (taf) {

        s += `     ${format_time(taf.start_time.dt)} - ${format_time(taf.end_time.dt)}\n`

        taf.forecast.forEach((f) => {
            s += `\n     **${format_taf_time(f.sanitized.split(' ')[0])}** - ${f.summary}`
        });
    } else {
        s += `     No TAF available.`
    }

    return s
}

function format_metar(metar: any) {

    console.log('formatting metar')

    let clouds = `Clear`
    if (metar.clouds.length > 0) {
        clouds = `${metar.clouds[0].type} at ${metar.clouds[0].altitude}00 ft`
    }

    let wind = 'Calm'
    const gusts = metar.wind_gust ? metar.wind_gust : 'no gusts'
    if (metar.wind_direction.value !== 0 || metar.wind_speed.value !== 0) {
        console.log(typeof metar.wind_direction.value, metar.wind_direction.value)
        wind = `${metar.wind_direction.value}° at ${metar.wind_speed.value} kts ${gusts}`
    }

    let temp = metar.temperature.value;
    if (metar.remarks_info && metar.remarks_info.temperature_decimal) {
        temp = metar.remarks_info.temperature_decimal.repr;
    }

    let dew = metar.dewpoint.value;
    if (metar.remarks_info && metar.remarks_info.dewpoint_decimal) {
        dew = metar.remarks_info.dewpoint_decimal.repr;
    }

    return `
\n**Metar**
     ${metar.sanitized}

     **Observed**:  ${format_time(metar.time.dt)}
     **Altimeter**:  ${metar.altimeter.value} inHg
     **Clouds**:       ${clouds}
     **Visibility**:   ${metar.visibility.value} SM
     **Wind**:          ${wind}
     **Temp**:         ${temp} °C
     **Dew**:            ${dew} °C`
}

// produces 'Sat, April 10th 12:36'
function format_time(t: string): string {
    const d = new Date(t.substring(0, t.length - 1))
    let min = String(d.getMinutes());
    if (min.length === 1) {
        min = `0${min}`
    }
    return `${get_day(d.getDay())} ${get_month(d.getMonth())} ${d.getDate()}th ${d.getHours()}:${min}`
}

// FM120200 - From 2:00 am
function format_taf_time(t: string): string {
    if (t.substring(0, 2) === 'FM') {
        return `From ${t.substring(2, 4)}th ${t.substring(4, 6)}:${t.substring(6, 8)}`
    }

    return `From ${t.substring(0, 2)}th ${t.substring(2, 4)}:00`
}

function get_day(i: number): string {
    switch(i){
        case 0: return 'Sun';
        case 1: return 'Mon';
        case 2: return 'Tues';
        case 3: return 'Wed';
        case 4: return 'Thurs';
        case 5: return 'Fri';
        case 6: return 'Sat';
    }
    return '';
}

function get_month(i: number): string {
    switch(i){
        case 0: return 'Jan';
        case 1: return 'Feb';
        case 2: return 'March';
        case 3: return 'April';
        case 4: return 'May';
        case 5: return 'June';
        case 6: return 'July';
        case 7: return 'Aug';
        case 8: return 'Sept';
        case 9: return 'Oct';
        case 10: return 'Nov';
        case 11: return 'Dec';
    }
    return '';
}

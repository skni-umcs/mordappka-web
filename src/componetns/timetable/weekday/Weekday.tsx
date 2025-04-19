import './Weekday.scss'

interface Prop{
    day:string;

}

function Weekday(prop: Prop){
    return <div className='weekday'>weekday({prop.day})</div>
}
export default Weekday;

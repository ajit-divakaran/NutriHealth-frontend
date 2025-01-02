

const StatusBar = ({small,curr,total}) => {
  // console.log(typeof curr, typeof total,total)
  const percent = (curr/total)*100;
  // console.log(percent)
  return (
    <div className="status-bar relative">
    <div className={`${small?'h-[5px]':'h-[10px]'} bg-[#757471] w-[100%] rounded-full`}></div>
    <div className={`${small?'h-[5px]':'h-[10px]'} rounded-full absolute left-0 top-0`} style={{width:`${percent>100?100:percent}%`, backgroundColor:`${percent>100?'#d03a2e':'#EE973F'}`}} ></div>
   
  </div>
  )
}

export default StatusBar
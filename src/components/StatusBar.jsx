import { useEffect, useState } from "react";


const StatusBar = ({animation,small,curr,total}) => {
  // console.log(typeof curr, typeof total,total)
  const percent = (curr/total)*100;
  
  // console.log(percent)

  return (
    <div className="status-bar relative overflow-hidden rounded-full">
    <div className={`${small?'h-[5px]':'h-[10px]'} bg-[#757471] w-[100%] rounded-full`}></div>
    <div className={`${small?'h-[5px]':'h-[10px]'} ${animation?`animated-bar`:''} rounded-full absolute left-0 top-0`} style={{"--w-bar":`${animation?percent:0}%`, backgroundColor:`${percent>100?'#d03a2e':'#EE973F'}`, display:animation?'block':'none',width: animation?`${percent>100?100:percent}%`:'0px'}} ></div>
   
  </div>
  )
}

export default StatusBar
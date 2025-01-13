import { useEffect, useState } from "react";


const StatusBar = ({animation,small,curr,total}) => {
  // console.log(typeof curr, typeof total,total)
  const percent = (curr/total)*100;
  
  // console.log(percent)

  return (
   <>
      <div className="status-bar relative rounded-full">
      <div className={`${small?'h-[5px]':'h-[10px]'} bg-[#757471] w-[100%] rounded-full`}></div>
      <div className={`${small?'h-[5px]':'h-[10px]'} ${animation?`animated-bar `:''} rounded-full absolute left-0 top-0`} style={{"--w-bar":`${Math.min(percent, 100)}%`, backgroundColor:`${percent>100?'#d03a2e':'#EE973F'}`, display:animation?'block':'none'}} ></div>
    {/* <div className={animation?`d-block animated-current res-font ${small?'top-[10px]':'-top-[20px]'} bg-none text-white text-sm`:'d-none'} style={{position:'absolute','--w-bar':`${Math.min(percent, 100)}%`,'--bs-font':`${small?'0.25rem':'0.45rem'}`}}>1000</div> */}
      
     
    </div>
   </>
  )
}

export default StatusBar
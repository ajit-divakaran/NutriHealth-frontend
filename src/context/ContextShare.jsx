import React, { createContext, useState } from "react";

export const addHeaderHeight = createContext();
export const removeProfileDiv = createContext();
export const isgoalsdefined = createContext()
// export const shareUserDetails = createContext()

const ContextShare = ({ children }) => {
  const [headHeight, setHeadHeight] = useState(0);
  const [show, setShow] = useState(false);
  const [showgoal, setShowgoal] = useState(false);
  const [isGoalsDefined,setIsGoalsDefined] = useState(false)
  // const [fullUserDetails,setFullUserDetails] = useState({
  //   username:"",
  //   email:"",
  //   password:"",
  //   calories:"",
  //   protein:"",
  //   fats:"",
  //   carbs:""
  
  // })
  return (
    <>
      <addHeaderHeight.Provider value={{ headHeight, setHeadHeight }}>
        <removeProfileDiv.Provider value={{show,setShow,showgoal,setShowgoal}}> 
          {/* <shareUserDetails.Provider value={{fullUserDetails,setFullUserDetails}}> */}
          <isgoalsdefined.Provider value = {{isGoalsDefined,setIsGoalsDefined}}>
            {children}
            </isgoalsdefined.Provider>
            {/* </shareUserDetails.Provider> */}
        </removeProfileDiv.Provider>
      </addHeaderHeight.Provider>
    </>
  );
};

export default ContextShare;
